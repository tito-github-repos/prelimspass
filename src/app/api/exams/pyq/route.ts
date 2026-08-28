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
    /* ============================================================
       AUTH
    ============================================================ */

    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user information",
        },
        { status: 401 }
      );
    }

    /* ============================================================
       PARSE BODY
    ============================================================ */

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

    /* ============================================================
       BASIC VALIDATION
    ============================================================ */

    if (!examTitle || !examType) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    if (!duration || duration <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Duration is required",
        },
        { status: 400 }
      );
    }

    if (!subjectId) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject is required",
        },
        { status: 400 }
      );
    }

    if (!["topic", "difficulty", "answer_type"].includes(filterType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid filter type",
        },
        { status: 400 }
      );
    }

    if (filterType === "difficulty" && !difficultyValue) {
      return NextResponse.json(
        {
          success: false,
          message: "Difficulty is required",
        },
        { status: 400 }
      );
    }

    if (filterType === "answer_type" && !answerTypeValue) {
      return NextResponse.json(
        {
          success: false,
          message: "Answer type is required",
        },
        { status: 400 }
      );
    }

    if (!setNumber || setNumber < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Set number is required",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one question is required",
        },
        { status: 400 }
      );
    }

    if (examType === "live") {
      if (!startTime || !endTime) {
        return NextResponse.json(
          {
            success: false,
            message: "Start and end time are required for live exams",
          },
          { status: 400 }
        );
      }
    }

    /* ============================================================
       SUBJECT VALIDATION
    ============================================================ */

    const subject = await prisma.subjects.findUnique({
      where: {
        subject_id: subjectId,
      },
    });

    if (!subject || !subject.is_pyq) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject is not a valid PYQ subject",
        },
        { status: 400 }
      );
    }

    /* ============================================================
       LOAD PYQ TOPICS
    ============================================================ */

    const pyqTopics = await prisma.topics.findMany({
      where: {
        subject_id: subjectId,
        is_pyq: true,
      },
    });

    /*
     * Map topic name -> topic ID.
     *
     * This is especially important for:
     *   - Difficulty Wise
     *   - Answer Type Wise
     *
     * Because the Excel file contains topic_name for each question.
     */

    const topicNameToId = new Map<string, number>(
      pyqTopics.map((t) => [
        t.topic_name.toLowerCase().trim(),
        t.topic_id,
      ])
    );

    const validTopicIds = new Set(
      pyqTopics.map((t) => t.topic_id)
    );

    let dropdownTopicName: string | null = null;

    /* ============================================================
       TOPIC FILTER VALIDATION
    ============================================================ */

    if (filterType === "topic") {
      if (!topicId || !validTopicIds.has(topicId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid topic for this subject",
          },
          { status: 400 }
        );
      }

      dropdownTopicName =
        pyqTopics.find(
          (t) => t.topic_id === topicId
        )?.topic_name ?? null;
    }

    /* ============================================================
       RESOLVE TOPIC ID FOR EACH QUESTION
    ============================================================ */

    const resolvedQuestions: (IncomingQuestion & {
      resolved_topic_id: number;
    })[] = [];

    for (const [i, q] of questions.entries()) {
      /* ----------------------------------------------------------
         Required question fields
      ---------------------------------------------------------- */

      if (
        !q.question_text ||
        !q.option_a ||
        !q.option_b ||
        !q.option_c ||
        !q.option_d ||
        !q.correct_answer
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Row ${i + 1}: missing required fields`,
          },
          { status: 400 }
        );
      }

      let resolvedTopicId: number | undefined;

      /* ----------------------------------------------------------
         Topic Wise
         Every question gets the selected topic ID.
      ---------------------------------------------------------- */

      if (filterType === "topic") {
        resolvedTopicId = topicId!;
      }

      /* ----------------------------------------------------------
         Difficulty Wise / Answer Type Wise
         Topic ID comes from topic_name in Excel.
      ---------------------------------------------------------- */

      else {
        const name = q.topic_name?.toLowerCase().trim();

        resolvedTopicId = name
          ? topicNameToId.get(name)
          : undefined;

        if (!resolvedTopicId) {
          return NextResponse.json(
            {
              success: false,
              message: `Row ${
                i + 1
              }: topic "${
                q.topic_name || "(missing)"
              }" not found under this subject's PYQ topics`,
            },
            { status: 400 }
          );
        }
      }

      resolvedQuestions.push({
        ...q,
        resolved_topic_id: resolvedTopicId,
      });
    }

    /* ============================================================
       MAIN DATABASE TRANSACTION
       
       IMPORTANT:
       Student assignment is NOT done inside this transaction.
       
       This transaction only contains the core exam creation
       operations.
    ============================================================ */

    const createdExam = await prisma.$transaction(
      async (tx) => {
        /* --------------------------------------------------------
           1. CREATE EXAM
        -------------------------------------------------------- */

        const exam = await tx.exams.create({
          data: {
            exam_title: examTitle,
            description: description || null,
            exam_type: examType,
            selection_mode: "auto",

            time_limit_minutes: duration,

            scheduled_start:
              examType === "live" && startTime
                ? new Date(startTime)
                : null,

            scheduled_end:
              examType === "live" && endTime
                ? new Date(endTime)
                : null,

            question_count: resolvedQuestions.length,

            total_marks: 0,

            is_active: true,

            is_pyq: true,

            created_by: userId,
          },
        });

        /* --------------------------------------------------------
           2. CREATE PYQ EXAM META
        -------------------------------------------------------- */

        await tx.pyq_exam_meta.create({
          data: {
            exam_id: exam.exam_id,

            subject: subject.subject_name,

            filter_type: filterType,

            topic:
              filterType === "topic"
                ? dropdownTopicName
                : null,

            difficulty:
              filterType === "difficulty"
                ? difficultyValue
                : null,

            answer_type:
              filterType === "answer_type"
                ? answerTypeValue
                : null,

            set_number: setNumber,
          },
        });

        /* --------------------------------------------------------
           3. CREATE QUESTIONS
           
           Each question is created individually because we need
           its generated question_id for exam_questions.
        -------------------------------------------------------- */

        let totalMarks = 0;

        const examQuestionsData: any[] = [];

        let questionOrder = 1;

        for (const q of resolvedQuestions) {
          const marks = Number(q.points) || 2;

          const createdQuestion = await tx.questions.create({
            data: {
              question_text: q.question_text,

              option_a: q.option_a,

              option_b: q.option_b,

              option_c: q.option_c,

              option_d: q.option_d,

              correct_answer: q.correct_answer,

              marks,

              negative_marks:
                NEGATIVE_MARKS_DEFAULT,

              difficulty: q.difficulty,

              explanation:
                q.explanation || null,

              subject_id: subjectId,

              topic_id: q.resolved_topic_id,

              is_pyq: true,

              created_by: userId,
            },
          });

          /* ------------------------------------------------------
             Prepare exam_questions bulk insert
          ------------------------------------------------------ */

          examQuestionsData.push({
            exam_id: exam.exam_id,

            question_id:
              createdQuestion.question_id,

            question_order: questionOrder++,

            assigned_marks: marks,

            assigned_negative:
              NEGATIVE_MARKS_DEFAULT,
          });

          totalMarks += marks;
        }

        /* --------------------------------------------------------
           4. CREATE EXAM -> QUESTION MAPPINGS
        -------------------------------------------------------- */

        await tx.exam_questions.createMany({
          data: examQuestionsData,
        });

        /* --------------------------------------------------------
           5. UPDATE TOTAL MARKS
        -------------------------------------------------------- */

        await tx.exams.update({
          where: {
            exam_id: exam.exam_id,
          },

          data: {
            total_marks: totalMarks,
          },
        });

        /* --------------------------------------------------------
           6. CREATE TOPIC CONFIGURATION
        -------------------------------------------------------- */

        const topicCounts = new Map<number, number>();

        for (const q of resolvedQuestions) {
          topicCounts.set(
            q.resolved_topic_id,
            (topicCounts.get(q.resolved_topic_id) || 0) + 1
          );
        }

        if (topicCounts.size > 0) {
          await tx.exam_subject_configs.createMany({
            data: Array.from(
              topicCounts.entries()
            ).map(
              ([topic_id, question_count]) => ({
                exam_id: exam.exam_id,

                subject_id: subjectId,

                topic_id,

                question_count,
              })
            ),
          });
        }

        /* --------------------------------------------------------
           IMPORTANT:
           
           DO NOT assign students here.
           
           Student assignment has been intentionally moved
           outside the transaction to prevent the transaction
           from exceeding the timeout.
        -------------------------------------------------------- */

        return exam;
      },

      /*
       * 100 questions can require many database operations.
       * Keep a reasonable safety margin for remote DB connections.
       */
      {
        timeout: 120000,
      }
    );

    /* ============================================================
       AUTO-ASSIGN PYQ EXAM TO ALL EXISTING STUDENTS
       
       IMPORTANT:
       This is now OUTSIDE the main transaction.
       
       Therefore:
       
       Exam creation transaction
              ↓
       COMMIT
              ↓
       Find students
              ↓
       Create assignment
              ↓
       Assign students
       
       The student assignment process can no longer cause the
       exam creation transaction to expire.
    ============================================================ */

    try {
      const students = await prisma.users.findMany({
        where: {
          role: "student",
        },

        select: {
          user_id: true,
        },
      });

      if (students.length > 0) {
        /* --------------------------------------------------------
           Create assignment for this newly created exam.
           
           Since this is a brand-new exam, there should not
           already be an assignment for it.
        -------------------------------------------------------- */

        const assignment =
          await prisma.exam_assignments.create({
            data: {
              exam_id: createdExam.exam_id,

              assigned_by: userId,

              mode: "same",
            },
          });

        /* --------------------------------------------------------
           Assign exam to all existing students in one bulk query.
        -------------------------------------------------------- */

        await prisma.exam_assignment_students.createMany({
          data: students.map((student) => ({
            assignment_id: assignment.id,

            student_id: student.user_id,
          })),

          skipDuplicates: true,
        });
      }

      console.log(
        `PYQ exam ${createdExam.exam_id} assigned to ${students.length} students`
      );
    } catch (assignmentError) {
      /*
       * IMPORTANT:
       *
       * The exam itself has already been successfully created.
       *
       * If assignment fails, don't delete the exam or pretend
       * that exam creation failed.
       *
       * The existing PATCH resync endpoint/helper can be used
       * to repair missing PYQ assignments.
       */

      console.error(
        "PYQ exam created, but student assignment failed:",
        assignmentError
      );

      return NextResponse.json(
        {
          success: true,

          message:
            "PYQ exam created successfully, but student assignment could not be completed. Please run PYQ assignment resync.",

          examId: createdExam.exam_id,

          assignmentWarning: true,
        },
        { status: 200 }
      );
    }

    /* ============================================================
       SUCCESS RESPONSE
    ============================================================ */

    return NextResponse.json({
      success: true,

      message:
        "PYQ exam created and is available to all students",

      examId: createdExam.exam_id,
    });
  } catch (error: any) {
    console.error(
      "Error creating PYQ exam:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error?.message ||
          "Failed to create PYQ exam",
      },
      { status: 500 }
    );
  }
}

/* ===============================================================
   PATCH: BULK RESYNC PYQ ASSIGNMENTS

   Manual "fix everything right now" utility.

   Ensures EVERY currently registered student has an assignment
   row for EVERY existing PYQ exam.

   Useful for:
   - Backfilling students who registered before login-time sync
   - Recovering from assignment failures
   - Manual safety net after batch signups
   - Repairing assignment data

   Safe to call repeatedly because the shared helper uses
   duplicate-safe inserts.
=============================================================== */

export async function PATCH(req: Request) {
  try {
    /* ------------------------------------------------------------
       AUTH
    ------------------------------------------------------------ */

    const authHeader =
      req.headers.get("Authorization");

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const token =
      authHeader.split(" ")[1];

    let decoded: any;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      );
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user information",
        },
        { status: 401 }
      );
    }

    /* ------------------------------------------------------------
       RUN SHARED PYQ ASSIGNMENT SYNC
    ------------------------------------------------------------ */

    const {
      examsProcessed,
      studentsNewlyAssigned,
    } =
      await syncPyqAssignmentsForAllStudents(
        userId
      );

    /* ------------------------------------------------------------
       RESPONSE
    ------------------------------------------------------------ */

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
    console.error(
      "Error resyncing PYQ assignments:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error?.message ||
          "Failed to resync PYQ assignments",
      },
      { status: 500 }
    );
  }
}