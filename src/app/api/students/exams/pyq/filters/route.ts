// prelimspass\src\app\api\students\exams\pyq\filters\route.ts
//
// Returns the actual filter values available for PYQ practice, sourced
// directly from pyq_exam_meta (joined against exams.is_pyq / is_active) -
// never from the admin subjects/topics tables, since pyq_exam_meta.subject/
// topic/difficulty/answer_type are free-text columns with no FK relation to
// them (see prisma schema). This guarantees the dropdowns the student sees
// can never mismatch what's actually queryable in /api/students/exams/pyq.
//
//   GET /filters                    -> { success, subjects: string[] }
//   GET /filters?subject=Economics  -> { success, topics, difficulties, answerTypes }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/utils/auth";

const DIFFICULTY_ORDER = ["Easy", "Medium", "Hard"];

function sortDifficulties(values: string[]): string[] {
  return [...values].sort((a, b) => {
    const ai = DIFFICULTY_ORDER.indexOf(a);
    const bi = DIFFICULTY_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
}

export async function GET(req: NextRequest) {
  try {
    // ---------------- AUTH ----------------
    // Same student-only auth as /api/students/exams/pyq - this endpoint
    // exposes which PYQ subjects/topics exist, so it stays behind auth too.
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

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");

    // Shared "only real, live PYQ exams count" condition.
    const activePyqCondition = {
      exams: {
        is_pyq: true,
        is_active: true,
      },
    };

    // ---------------- NO SUBJECT: return distinct subjects ----------------
    if (!subject) {
      const subjectRows = await prisma.pyq_exam_meta.groupBy({
        by: ["subject"],
        where: activePyqCondition,
        orderBy: { subject: "asc" },
      });

      return NextResponse.json({
        success: true,
        subjects: subjectRows.map((r) => r.subject),
      });
    }

    // ---------------- SUBJECT GIVEN: return topics/difficulties/answerTypes ----------------
    const [topicRows, difficultyRows, answerTypeRows] = await Promise.all([
      prisma.pyq_exam_meta.groupBy({
        by: ["topic"],
        where: {
          ...activePyqCondition,
          subject,
          filter_type: "topic",
          topic: { not: null },
        },
        orderBy: { topic: "asc" },
      }),
      prisma.pyq_exam_meta.groupBy({
        by: ["difficulty"],
        where: {
          ...activePyqCondition,
          subject,
          filter_type: "difficulty",
          difficulty: { not: null },
        },
      }),
      prisma.pyq_exam_meta.groupBy({
        by: ["answer_type"],
        where: {
          ...activePyqCondition,
          subject,
          filter_type: "answer_type",
          answer_type: { not: null },
        },
        orderBy: { answer_type: "asc" },
      }),
    ]);

    const topics = topicRows
      .map((r) => r.topic)
      .filter((v): v is string => !!v);
    const difficulties = sortDifficulties(
      difficultyRows.map((r) => r.difficulty).filter((v): v is string => !!v),
    );
    const answerTypes = answerTypeRows
      .map((r) => r.answer_type)
      .filter((v): v is string => !!v);

    return NextResponse.json({
      success: true,
      topics,
      difficulties,
      answerTypes,
    });
  } catch (error) {
    console.error("PYQ filters fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch PYQ filter options" },
      { status: 500 },
    );
  }
}