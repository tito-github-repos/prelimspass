//prelimspass\src\app\api\students\exams\pyq\route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/utils/auth";

export async function GET(req: NextRequest) {
  try {
    // ---------------- AUTH ----------------
    // Previously this route never checked who was asking, so it could never
    // tell you which student's attempts to attach to each exam. That's the
    // root cause of "Retake" / "View Result" not surviving a page reload -
    // the response literally never contained attempt data.
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
        { status: 400 }
      );
    }

    // FETCH FROM PYQ META + JOIN EXAMS
    const pyqExams = await prisma.pyq_exam_meta.findMany({
      where: {
        subject: { equals: subject },
        categoryType: { equals: type },
        category: { equals: value },
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

    // Drop any meta rows with no linked exam before we bother looking up
    // attempts for them.
    const validItems = pyqExams.filter((item) => {
      if (!item.exams) {
        console.warn("Pyq exam meta has no associated exam:", {
          pyqExamId: item.id,
          examId: item.exam_id,
          subject: item.subject,
          categoryType: item.categoryType,
          category: item.category,
        });
        return false;
      }
      return true;
    });

    const examIds = validItems.map((item) => item.exams!.exam_id);

    // ---------------- ATTACH THIS STUDENT'S LATEST ATTEMPT PER EXAM ----------------
    // One query for every exam on this page instead of one query per exam.
    // Ordered newest-first so the first attempt we see per exam_id is the
    // latest one - this is what "latest attempt" is actually derived from.
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
    const exams = validItems.map((item) => ({
      exam_id: item.exams!.exam_id,
      exam_title: item.exams!.exam_title,
      exam_type: item.exams!.exam_type,

      duration_minutes: item.exams!.time_limit_minutes,

      question_count: item.exams!.question_count,

      total_marks: Number(item.exams!.total_marks),

      set_number: item.set_number,

      // This student's latest attempt at this exam, or null if they've
      // never attempted it. The frontend reads this field name directly.
      last_attempt_id: latestAttemptByExam.get(item.exams!.exam_id) ?? null,
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
      { status: 500 }
    );
  }
}