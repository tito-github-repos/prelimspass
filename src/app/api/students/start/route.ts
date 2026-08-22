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
      select: { exam_type: true, is_pyq: true }
    });

    if (!exam) {
      return NextResponse.json({ success: false, message: "Exam not found" });
    }

    if (!exam.is_pyq) {
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

    const existingAttempts = await prisma.student_exam_attempts.count({
      where: {
        student_id: user.userId,
        exam_id: examId
      }
    });

    const attemptNumber = existingAttempts + 1;

    if (exam.exam_type === "mock" && existingAttempts >= 2) {
      return NextResponse.json({ success: false, message: "Mock exam limit reached" });
    }

    if (exam.exam_type === "live" && existingAttempts >= 1) {
      return NextResponse.json({ success: false, message: "Live exam already attempted" });
    }

    const attempt = await prisma.student_exam_attempts.create({
      data: {
        student_id: user.userId,
        exam_id: examId,
        attempt_number: attemptNumber,
        status: "in_progress", // ✅ correct enum value
        start_time: new Date() // ✅ matches your schema
      }
    });

    return NextResponse.json({
      success: true,
      attemptId: attempt.attempt_id
    });

  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
