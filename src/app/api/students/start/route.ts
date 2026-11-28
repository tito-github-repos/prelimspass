// app/api/students/start/route.ts

//this for create exam attempt id and start the exam details store in todb

import { prisma } from "@/lib/db";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ success: false }, { status: 401 });

    const token = auth.split(" ")[1];
    const user = verifyToken(token);
    if (!user || user.role !== "student") {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { examId } = await req.json();

    const exam = await prisma.exams.findUnique({
      where: { exam_id: examId },
      select: {
        exam_type: true,
        is_pyq: true,
        is_free: true, // NEW
        is_active: true, // NEW
        scheduled_start: true, // NEW
        scheduled_end: true, // NEW
      },
    });

    if (!exam || !exam.is_active) {
      return NextResponse.json(
        { success: false, message: "Exam not found" },
        { status: 404 },
      );
    }

    // PYQ exams and free exams skip the paid check. Everything else
    // needs a paid student.
    if (!exam.is_pyq && !exam.is_free) {
      const studentDetails = await prisma.student_details.findUnique({
        where: { user_id: user.userId },
        select: { is_paid_user: true },
      });

      if (!studentDetails?.is_paid_user) {
        return NextResponse.json(
          { success: false, message: "Upgrade to premium to start this exam" },
          { status: 403 },
        );
      }
    }

    // NEW - live exams can only be started inside their time window
    if (exam.exam_type === "live") {
      const now = new Date();
      if (
        (exam.scheduled_start && now < exam.scheduled_start) ||
        (exam.scheduled_end && now > exam.scheduled_end)
      ) {
        return NextResponse.json(
          { success: false, message: "Exam is not open right now" },
          { status: 403 },
        );
      }
    }

    const existingAttempts = await prisma.student_exam_attempts.count({
      where: {
        student_id: user.userId,
        exam_id: examId,
      },
    });

    const attemptNumber = existingAttempts + 1;

    if (exam.exam_type === "mock" && existingAttempts >= 2) {
      return NextResponse.json({
        success: false,
        message: "Mock exam limit reached",
      });
    }

    if (exam.exam_type === "live" && existingAttempts >= 1) {
      return NextResponse.json({
        success: false,
        message: "Live exam already attempted",
      });
    }

    const attempt = await prisma.student_exam_attempts.create({
      data: {
        student_id: user.userId,
        exam_id: examId,
        attempt_number: attemptNumber,
        status: "in_progress",
        start_time: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      attemptId: attempt.attempt_id,
    });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}