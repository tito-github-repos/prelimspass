//prelimspass\src\app\api\students\exams\route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/utils/auth";

// Helper to determine exam state
function getExamState(exam: any) {
  // Practice & Mock exams are always available
  if (exam.exam_type === "practice" || exam.exam_type === "mock") {
    return "available";
  }

  const now = new Date();

  if (exam.scheduled_start && now < exam.scheduled_start) {
    return "upcoming";
  }

  if (exam.scheduled_end && now > exam.scheduled_end) {
    return "expired";
  }

  return "available";
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "student") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const studentId = decoded.userId;
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("id");

    /* ======================================================
       SINGLE EXAM META (START EXAM)
       Handles both normal exams (must be assigned) and PYQ exams
       (globally available to every student, no assignment row needed).
    ====================================================== */
    if (examId) {
      const examIdNum = Number(examId);

      const exam = await prisma.exams.findUnique({
        where: { exam_id: examIdNum },
      });

      if (!exam) {
        return NextResponse.json(
          { success: false, message: "Exam not found" },
          { status: 404 },
        );
      }

      // PYQ exams are available to every student by design - no
      // exam_assignment_students row exists or is needed for them.
      if (exam.is_pyq) {
        return NextResponse.json({
          success: true,
          data: {
            id: exam.exam_id,
            title: exam.exam_title,
            duration: exam.time_limit_minutes,
            questions: exam.question_count,
            examType: exam.exam_type,
            shuffleQuestions: false,
            state: getExamState(exam),
            startDate: exam.scheduled_start,
            endDate: exam.scheduled_end,
            points: String(exam.total_marks ?? 0),
          },
        });
      }

      // Normal exam - must be explicitly assigned to this student
      const assignment = await prisma.exam_assignment_students.findFirst({
        where: {
          student_id: studentId,
          assignment: { exam_id: examIdNum },
        },
        include: {
          assignment: {
            include: {
              exam: true,
            },
          },
        },
      });

      if (!assignment) {
        return NextResponse.json(
          { success: false, message: "Exam not assigned or not found" },
          { status: 404 },
        );
      }

      const assignedExam = assignment.assignment.exam;

      return NextResponse.json({
        success: true,
        data: {
          id: assignedExam.exam_id,
          title: assignedExam.exam_title,
          duration: assignedExam.time_limit_minutes,
          questions: assignedExam.question_count,
          examType: assignedExam.exam_type,
          shuffleQuestions: assignment.assignment.shuffle_questions,
          state: getExamState(assignedExam),
          startDate: assignedExam.scheduled_start,
          endDate: assignedExam.scheduled_end,
          points: String(assignedExam.total_marks ?? 0),
        },
      });
    }

    /* ======================================================
       AVAILABLE EXAMS LIST (My Exams page)
       Normal exams ONLY - PYQ exams live in their own dedicated module
       (Previous Year Questions page / /api/students/exams/pyq) and are
       never auto-assigned or listed here. There is no more PYQ
       auto-assignment step in this route: PYQ availability is driven
       entirely by the is_pyq flag + pyq_exam_meta, not by
       exam_assignment_students rows.
    ====================================================== */
    const assignedExams = await prisma.exam_assignment_students.findMany({
      where: { student_id: studentId },
      include: {
        assignment: {
          include: {
            exam: true,
          },
        },
      },
    });

    // Get all completed attempts for the student
    const completedAttempts = await prisma.student_exam_attempts.findMany({
      where: {
        student_id: studentId,
        status: "completed",
      },
      select: { exam_id: true },
    });

    const completedExamIds = new Set(
      completedAttempts.map((attempt) => attempt.exam_id),
    );

    const exams = assignedExams
      .filter((a) => {
        const exam = a.assignment.exam;

        // NEW - explicit guard: My Exams must never show PYQ exams, even
        // if a stale assignment row somehow exists for one from before
        // this route was cleaned up.
        if (exam.is_pyq) return false;

        const state = getExamState(exam);

        // Only show upcoming or available exams that haven't been completed
        const isUpcomingOrAvailable =
          state === "upcoming" || state === "available";
        const notCompleted = !completedExamIds.has(exam.exam_id);

        return isUpcomingOrAvailable && notCompleted;
      })
      .map((a) => {
        const exam = a.assignment.exam;

        return {
          id: exam.exam_id,
          title: exam.exam_title,
          duration: exam.time_limit_minutes,
          questions: exam.question_count,
          examType: exam.exam_type,
          state: getExamState(exam),
          startDate: exam.scheduled_start,
          endDate: exam.scheduled_end,
          points: String(exam.total_marks ?? 0),
        };
      });

    return NextResponse.json({ success: true, data: exams });
  } catch (error) {
    console.error("Error fetching student exams:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch exams" },
      { status: 500 },
    );
  }
}