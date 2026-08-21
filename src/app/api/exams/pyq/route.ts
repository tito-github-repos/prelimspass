// prelimspass\src\app\api\exams\pyq\route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

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
  // Present on every row regardless of filter type:
  // - "topic" mode: same topicId for every row (from the dropdown)
  // - "difficulty" / "answer_type" mode: client-resolved topic_id, which
  //   we re-resolve server-side via topic_name below - never trusted as-is
  topic_id?: number;
  topic_name?: string;
}

const NEGATIVE_MARKS_DEFAULT = 0.66; // matches questions.negative_marks @default

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

    // All is_pyq topics under this subject - used to resolve/validate
    // every row, regardless of filter type.
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
        // Every row uses the single dropdown-selected topic - never trust
        // a client-sent topic_id here, always use the server-validated one.
        resolvedTopicId = topicId!;
      } else {
        // Difficulty / Answer-Type: re-resolve from topic_name, ignore
        // any client-sent topic_id.
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
        // ---- Create exam ----
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
            total_marks: 0, // updated after questions are created
            is_active: true,
            is_pyq: true,
            created_by: userId,
          },
        });

        // ---- pyq_exam_meta ----
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

        // ---- Create question rows ----
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

        // ---- exam_subject_configs (grouped by topic actually used) ----
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

        // ---- Auto-assign to all students ----
        const students = await tx.users.findMany({
          where: { role: "student" },
          select: { user_id: true },
        });

        if (students.length > 0) {
          const assignment = await tx.exam_assignments.create({
            data: {
              exam_id: exam.exam_id,
              assigned_by: userId,
              mode: "same",
            },
          });

          await tx.exam_assignment_students.createMany({
            data: students.map((s) => ({
              assignment_id: assignment.id,
              student_id: s.user_id,
            })),
          });
        }

        return exam;
      },
      { timeout: 50000 },
    );

    return NextResponse.json({
      success: true,
      message: "PYQ exam created and assigned to all users",
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