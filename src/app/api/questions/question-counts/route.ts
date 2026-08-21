//prelimspass\src\app\api\questions\question-counts\route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const subjects = await prisma.subjects.findMany({
      // Normal exam creation should never see PYQ subjects at all - they
      // have their own separate flow via /api/exams/pyq.
      where: { is_pyq: false },
      include: {
        topics: {
          // A subject is either PYQ or normal as a whole, but this filter
          // stays here too as a belt-and-braces guard in case a topic
          // somehow ends up flagged out of sync with its subject.
          where: { is_pyq: false },
          include: {
            _count: {
              select: {
                // Only count non-PYQ questions - otherwise a topic could
                // show "20 available" while some of those are actually
                // PYQ-only questions that normal exam creation can't
                // legally select.
                questions: {
                  where: { is_pyq: false },
                },
              },
            },
          },
        },
      },
      orderBy: { subject_name: "asc" },
    });

    const formatted = subjects.map((subj) => ({
      subject_id: subj.subject_id,
      subject_name: subj.subject_name,
      topics: subj.topics.map((topic) => ({
        topic_id: topic.topic_id,
        topic_name: topic.topic_name,
        question_count: topic._count.questions,
      })),
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Error fetching subject/topic counts:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subject/topic counts" },
      { status: 500 }
    );
  }
}