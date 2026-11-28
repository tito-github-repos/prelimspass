//prelimspass\src\app\api\students\exams\route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/utils/auth";
import { expireLiveExams } from "@/utils/expireLiveExams"; // NEW

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

    await expireLiveExams(); // NEW

    const studentId = decoded.userId;
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("id");

    const studentDetails = await prisma.student_details.findUnique({
      where: { user_id: studentId },
      select: { is_paid_user: true },
    });
    const isPaidUser = studentDetails?.is_paid_user ?? false;

    /* ======================================================
       SINGLE EXAM META (START EXAM)
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
            isLocked: false,
          },
        });
      }

      if (!exam.is_active) {
        return NextResponse.json(
          { success: false, message: "Exam not found" },
          { status: 404 },
        );
      }

      const legacyAssignment = await prisma.exam_assignment_students.findFirst({
        where: {
          student_id: studentId,
          assignment: { exam_id: examIdNum },
        },
        select: {
          assignment: { select: { shuffle_questions: true } },
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: exam.exam_id,
          title: exam.exam_title,
          duration: exam.time_limit_minutes,
          questions: exam.question_count,
          examType: exam.exam_type,
          shuffleQuestions:
            legacyAssignment?.assignment.shuffle_questions ?? false,
          state: getExamState(exam),
          startDate: exam.scheduled_start,
          endDate: exam.scheduled_end,
          points: String(exam.total_marks ?? 0),
          isLocked: !(exam.is_free || isPaidUser),
        },
      });
    }

    /* ======================================================
       AVAILABLE EXAMS LIST (My Exams page + dashboard)
    ====================================================== */
    const allExams = await prisma.exams.findMany({
      where: { is_active: true, is_pyq: false },
      orderBy: { created_at: "desc" },
    });

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

    const visibleExams = allExams.filter((exam) => {
      const state = getExamState(exam);
      const isUpcomingOrAvailable =
        state === "upcoming" || state === "available";
      const notCompleted = !completedExamIds.has(exam.exam_id);
      return isUpcomingOrAvailable && notCompleted;
    });

    const examIds = visibleExams.map((exam) => exam.exam_id);

    const subjectsByExam = new Map<number, Map<number, string>>();
    const addSubject = (examId: number, id: number, name: string) => {
      if (!subjectsByExam.has(examId)) subjectsByExam.set(examId, new Map());
      subjectsByExam.get(examId)!.set(id, name);
    };

    if (examIds.length > 0) {
      const configs = await prisma.exam_subject_configs.findMany({
        where: { exam_id: { in: examIds } },
        select: {
          exam_id: true,
          subject: { select: { subject_id: true, subject_name: true } },
        },
      });
      configs.forEach((c) =>
        addSubject(c.exam_id, c.subject.subject_id, c.subject.subject_name),
      );

      const examsWithoutSubjects = examIds.filter(
        (id) => !subjectsByExam.has(id),
      );
      if (examsWithoutSubjects.length > 0) {
        const examQuestions = await prisma.exam_questions.findMany({
          where: { exam_id: { in: examsWithoutSubjects } },
          select: {
            exam_id: true,
            question: {
              select: {
                subject: { select: { subject_id: true, subject_name: true } },
              },
            },
          },
        });
        examQuestions.forEach((eq) =>
          addSubject(
            eq.exam_id,
            eq.question.subject.subject_id,
            eq.question.subject.subject_name,
          ),
        );
      }
    }

    const exams = visibleExams.map((exam) => {
      const subjectMap = subjectsByExam.get(exam.exam_id);

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
        isLocked: !(exam.is_free || isPaidUser),
        subjects: subjectMap
          ? Array.from(subjectMap, ([id, name]) => ({ id, name }))
          : [],
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