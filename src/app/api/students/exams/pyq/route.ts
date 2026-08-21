//prelimspass\src\app\api\students\exams\pyq\route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/utils/auth";

// Maps the query param "type" (topic | difficulty | answer_type) to both
// the pyq_filter_type enum value AND the actual column on pyq_exam_meta
// that holds the comparison value for that type. Only one of
// topic/difficulty/answer_type is ever populated per row, matching
// whichever filter_type that exam was tagged with.
const FILTER_COLUMN_MAP: Record<string, "topic" | "difficulty" | "answer_type"> = {
  topic: "topic",
  difficulty: "difficulty",
  answer_type: "answer_type",
};

export async function GET(req: NextRequest) {
  try {
    // ---------------- AUTH ----------------
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const decoded = verifyToken(authHeader.substring(7));
    if (!decoded || decoded.role !== "student") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const studentId = decoded.userId;

    const { searchParams } = new URL(req.url);

    const subject = searchParams.get("subject");
    const type = searchParams.get("type");
    const value = searchParams.get("value");

    if (!subject || !type || !value) {
      return NextResponse.json(
        {
          success: false,
          message: "subject, type and value are required",
        },
        { status: 400 },
      );
    }

    const matchColumn = FILTER_COLUMN_MAP[type];
    if (!matchColumn) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid type "${type}". Use: topic, difficulty, or answer_type`,
        },
        { status: 400 },
      );
    }

    // FETCH FROM PYQ META + JOIN EXAMS - using the real schema columns
    // (filter_type + topic/difficulty/answer_type), not the old
    // categoryType/category fields that never actually existed on this table.
    const pyqExams = await prisma.pyq_exam_meta.findMany({
      where: {
        subject: { equals: subject },
        filter_type: type as "topic" | "difficulty" | "answer_type",
        [matchColumn]: { equals: value },
        // Belt-and-braces: only ever surface exams that are actually
        // flagged is_pyq on the exams table itself, and still active.
        exams: {
          is_pyq: true,
          is_active: true,
        },
      },
      include: {
        exams: true,
      },
      orderBy: {
        set_number: "asc",
      },
    });

    if (pyqExams.length === 0) {
      return NextResponse.json({
        success: true,
        exams: [],
      });
    }

    const examIds = pyqExams.map((item) => item.exams.exam_id);

    // ---------------- ATTACH THIS STUDENT'S LATEST ATTEMPT PER EXAM ----------------
    const attempts = examIds.length
      ? await prisma.student_exam_attempts.findMany({
          where: {
            student_id: studentId,
            exam_id: { in: examIds },
          },
          orderBy: [{ start_time: "desc" }, { attempt_id: "desc" }],
          select: { attempt_id: true, exam_id: true },
        })
      : [];

    const latestAttemptByExam = new Map<number, number>();
    for (const a of attempts) {
      if (!latestAttemptByExam.has(a.exam_id)) {
        latestAttemptByExam.set(a.exam_id, a.attempt_id);
      }
    }

    // FORMAT RESPONSE
    const exams = pyqExams.map((item) => ({
      exam_id: item.exams.exam_id,
      exam_title: item.exams.exam_title,
      exam_type: item.exams.exam_type,

      duration_minutes: item.exams.time_limit_minutes,
      question_count: item.exams.question_count,
      total_marks: Number(item.exams.total_marks),

      // Only meaningful when type === "difficulty" - null otherwise,
      // frontend already falls back to "Medium" for display.
      difficulty: item.difficulty,

      set_number: item.set_number,

      // This student's latest attempt at this exam, or null if they've
      // never attempted it. The frontend reads this field name directly.
      last_attempt_id: latestAttemptByExam.get(item.exams.exam_id) ?? null,
    }));

    return NextResponse.json({
      success: true,
      exams,
    });
  } catch (error) {
    console.error("PYQ fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch PYQ exams",
      },
      { status: 500 },
    );
  }
}