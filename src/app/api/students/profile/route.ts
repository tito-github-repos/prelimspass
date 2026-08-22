export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/utils/auth";

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

    const studentDetails = await prisma.student_details.findUnique({
      where: { user_id: decoded.userId },
      select: { is_paid_user: true },
    });

    return NextResponse.json({
      success: true,
      data: { isPaidUser: studentDetails?.is_paid_user ?? false },
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}