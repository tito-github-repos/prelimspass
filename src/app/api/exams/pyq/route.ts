// prelimspass\src\app\api\exams\pyq\route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";
import { syncPyqAssignmentsForAllStudents } from "@/lib/Pyqassignmentsync";

type FilterType = "topic" | "difficulty" | "answer_type";

interface IncomingQuestion {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
  explanation: string;
  topic_id?: number;
  topic_name?: string;
}

const NEGATIVE_MARKS_DEFAULT = 0.66;

export async function POST(req: Request) {
  try {
    /* ---------------- Auth ---------------- */
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }
    const userId = decoded.userId;

    /* ---------------- Parse body ---------------- */
    const body = await req.json();

    const {
      examTitle,
      description,
      examType,
      duration,
      startTime,
      endTime,
      subjectId,
      filterType,
      topicId,
      difficultyValue,
      answerTypeValue,
      setNumber,
      questions,
    }: {
      examTitle: string;
      description?: string;
      examType: "practice" | "mock" | "live";
      duration: number;
      startTime?: string | null;
      endTime?: string | null;
      subjectId: number;
      filterType: FilterType;
      topicId: number | null;
      difficultyValue: string | null;
      answerTypeValue: string | null;
      setNumber: number;
      questions: IncomingQuestion[];
    } = body;

    /* ---------------- Basic validation ---------------- */
    if (!examTitle || !examType) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!duration || duration <= 0) {
      return NextResponse.json(
        { success: false, message: "Duration is required" },
        { status: 400 },
      );
    }

    if (!subjectId) {
      return NextResponse.json(
        { success: false, message: "Subject is required" },
        { status: 400 },
      );
    }

    if (!["topic", "difficulty", "answer_type"].includes(filterType)) {
      return NextResponse.json(
        { success: false, message: "Invalid filter type" },
        { status: 400 },
      );
    }

    if (filterType === "difficulty" && !difficultyValue) {
      return NextResponse.json(
        { success: false, message: "Difficulty is required" },
        { status: 400 },
      );
    }

    if (filterType === "answer_type" && !answerTypeValue) {
      return NextResponse.json(
        { success: false, message: "Answer type is required" },
        { status: 400 },
      );
    }

    if (!setNumber || setNumber < 1) {
      return NextResponse.json(
        { success: false, message: "Set number is required" },
        { status: 400 },
      );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one question is required" },
        { status: 400 },
      );
    }

    if (examType === "live") {
      if (!startTime || !endTime) {
        return NextResponse.json(
          {
            success: false,
            message: "Start and end time are required for live exams",
          },
          { status: 400 },
        );
      }
    }

    /* ---------------- Subject / topic validation ---------------- */
    const subject = await prisma.subjects.findUnique({
      where: { subject_id: subjectId },
    });

    if (!subject || !subject.is_pyq) {
      return NextResponse.json(
        { success: false, message: "Subject is not a valid PYQ subject" },
        { status: 400 },
      );
    }

    const pyqTopics = await prisma.topics.findMany({
      where: { subject_id: subjectId, is_pyq: true },
    });
    const topicNameToId = new Map(
      pyqTopics.map((t) => [t.topic_name.toLowerCase().trim(), t.topic_id]),
    );
    const validTopicIds = new Set(pyqTopics.map((t) => t.topic_id));

    let dropdownTopicName: string | null = null;

    if (filterType === "topic") {
      if (!topicId || !validTopicIds.has(topicId)) {
        return NextResponse.json(
          { success: false, message: "Invalid topic for this subject" },
          { status: 400 },
        );
      }
      dropdownTopicName =
        pyqTopics.find((t) => t.topic_id === topicId)?.topic_name ?? null;
    }

    /* ---------------- Resolve topic_id per question ---------------- */
    const resolvedQuestions: (IncomingQuestion & {
      resolved_topic_id: number;
    })[] = [];

    for (const [i, q] of questions.entries()) {
      if (
        !q.question_text ||
        !q.option_a ||
        !q.option_b ||
        !q.option_c ||
        !q.option_d ||
        !q.correct_answer
      ) {
        return NextResponse.json(
          { success: false, message: `Row ${i + 1}: missing required fields` },
          { status: 400 },
        );
      }

      let resolvedTopicId: number | undefined;

      if (filterType === "topic") {
        resolvedTopicId = topicId!;
      } else {
        const name = q.topic_name?.toLowerCase().trim();
        resolvedTopicId = name ? topicNameToId.get(name) : undefined;

        if (!resolvedTopicId) {
          return NextResponse.json(
            {
              success: false,
              message: `Row ${i + 1}: topic "${q.topic_name || "(missing)"}" not found under this subject's PYQ topics`,
            },
            { status: 400 },
          );
        }
      }

      resolvedQuestions.push({ ...q, resolved_topic_id: resolvedTopicId });
    }

    /* ---------------- Transaction ---------------- */
    const createdExam = await prisma.$transaction(
      async (tx) => {
        const exam = await tx.exams.create({
          data: {
            exam_title: examTitle,
            description: description || null,
            exam_type: examType,
            selection_mode: "auto",
            time_limit_minutes: duration,
            scheduled_start:
              examType === "live" && startTime ? new Date(startTime) : null,
            scheduled_end:
              examType === "live" && endTime ? new Date(endTime) : null,
            question_count: resolvedQuestions.length,
            total_marks: 0,
            is_active: true,
            is_pyq: true,
            created_by: userId,
          },
        });

        await tx.pyq_exam_meta.create({
          data: {
            exam_id: exam.exam_id,
            subject: subject.subject_name,
            filter_type: filterType,
            topic: filterType === "topic" ? dropdownTopicName : null,
            difficulty: filterType === "difficulty" ? difficultyValue : null,
            answer_type: filterType === "answer_type" ? answerTypeValue : null,
            set_number: setNumber,
          },
        });

        let totalMarks = 0;
        const examQuestionsData: any[] = [];
        let questionOrder = 1;

        for (const q of resolvedQuestions) {
          const marks = Number(q.points) || 2;

          const created = await tx.questions.create({
            data: {
              question_text: q.question_text,
              option_a: q.option_a,
              option_b: q.option_b,
              option_c: q.option_c,
              option_d: q.option_d,
              correct_answer: q.correct_answer,
              marks,
              negative_marks: NEGATIVE_MARKS_DEFAULT,
              difficulty: q.difficulty,
              explanation: q.explanation || null,
              subject_id: subjectId,
              topic_id: q.resolved_topic_id,
              is_pyq: true,
              created_by: userId,
            },
          });

          examQuestionsData.push({
            exam_id: exam.exam_id,
            question_id: created.question_id,
            question_order: questionOrder++,
            assigned_marks: marks,
            assigned_negative: NEGATIVE_MARKS_DEFAULT,
          });

          totalMarks += marks;
        }

        await tx.exam_questions.createMany({ data: examQuestionsData });

        await tx.exams.update({
          where: { exam_id: exam.exam_id },
          data: { total_marks: totalMarks },
        });

        const topicCounts = new Map<number, number>();
        for (const q of resolvedQuestions) {
          topicCounts.set(
            q.resolved_topic_id,
            (topicCounts.get(q.resolved_topic_id) || 0) + 1,
          );
        }

        await tx.exam_subject_configs.createMany({
          data: Array.from(topicCounts.entries()).map(
            ([topic_id, question_count]) => ({
              exam_id: exam.exam_id,
              subject_id: subjectId,
              topic_id,
              question_count,
            }),
          ),
        });

        // ---- Auto-assign to every student that exists right now ----
        // This covers "new PYQ exam -> existing students". The other
        // direction ("new student -> existing PYQ exams") is handled by
        // the equivalent sync in the student registration route - see
        // that file for the counterpart logic. Together, every
        // student/exam pair ends up with a real exam_assignment_students
        // row, so /api/students/exams/take's assignment check works
        // correctly for PYQ exams with no special-casing needed there.
        const students = await tx.users.findMany({
          where: { role: "student" },
          select: { user_id: true },
        });

        if (students.length > 0) {
          let assignment = await tx.exam_assignments.findFirst({
            where: { exam_id: exam.exam_id },
          });

          if (!assignment) {
            assignment = await tx.exam_assignments.create({
              data: {
                exam_id: exam.exam_id,
                assigned_by: userId,
                mode: "same",
              },
            });
          }

          await tx.exam_assignment_students.createMany({
            data: students.map((s) => ({
              assignment_id: assignment!.id,
              student_id: s.user_id,
            })),
            skipDuplicates: true,
          });
        }

        return exam;
      },
      { timeout: 50000 },
    );

    return NextResponse.json({
      success: true,
      message: "PYQ exam created and is available to all students",
      examId: createdExam.exam_id,
    });
  } catch (error: any) {
    console.error("Error creating PYQ exam:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create PYQ exam" },
      { status: 500 },
    );
  }
}

/* ===========================
   PATCH: Bulk resync PYQ assignments
   ---------------------------
   Manual "fix everything right now" utility: ensures EVERY currently
   registered student has an assignment row for EVERY existing PYQ exam.
   Useful for:
     - backfilling students who registered before the login-time sync
       existed (see /api/students/login, or wherever that sync is wired in)
     - a manual safety net after a batch of signups or a data issue
   Safe to call as often as you like - every insert is skipDuplicates, so
   it never creates a duplicate row. Uses the shared helper so this logic
   only lives in one place.
=========================== */
export async function PATCH(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }
    const userId = decoded.userId;

    const { examsProcessed, studentsNewlyAssigned } =
      await syncPyqAssignmentsForAllStudents(userId);

    return NextResponse.json({
      success: true,
      message:
        examsProcessed === 0
          ? "Nothing to resync"
          : "PYQ assignment resync complete",
      examsProcessed,
      studentsNewlyAssigned,
    });
  } catch (error: any) {
    console.error("Error resyncing PYQ assignments:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to resync PYQ assignments" },
      { status: 500 },
    );
  }
}