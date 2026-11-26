// Save this file at: src/app/api/exams/excel/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";

const norm = (v: any) => String(v ?? "").trim().replace(/\s+/g, " ");

// Reads the logged-in user's id from the Bearer token.
// NOTE: JWT_SECRET and the payload key must match what your existing
// POST /api/exams route uses. Adjust here if yours is different.
const getUserId = (req: Request): number | null => {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const id = decoded.userId ?? decoded.user_id ?? decoded.id;
    return id ? Number(id) : null;
  } catch {
    return null;
  }
};

export async function POST(req: Request) {
  const userId = getUserId(req);
  if (!userId)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );

  const body = await req.json();
  const examTitle = norm(body.examTitle);
  const examType = body.examType === "live" ? "live" : "mock";
  const questions: any[] = body.questions ?? [];

  if (!examTitle)
    return NextResponse.json(
      { success: false, message: "Exam title is required" },
      { status: 400 },
    );

  if (questions.length !== 100)
    return NextResponse.json(
      { success: false, message: "Exam must contain exactly 100 questions" },
      { status: 400 },
    );

  // Re-validate on the server, never trust the browser
  for (const [i, q] of questions.entries()) {
    const ok =
      q.question_text &&
      q.option_a &&
      q.option_b &&
      q.option_c &&
      q.option_d &&
      ["A", "B", "C", "D"].includes(q.correct_answer) &&
      norm(q.subject) &&
      norm(q.topic) &&
      ["Easy", "Medium", "Hard"].includes(q.difficulty);
    if (!ok)
      return NextResponse.json(
        { success: false, message: `Question ${i + 1} is invalid` },
        { status: 400 },
      );
  }

  const dup = await prisma.exams.findFirst({ where: { exam_title: examTitle } });
  if (dup)
    return NextResponse.json(
      { success: false, message: "Exam title already exists" },
      { status: 400 },
    );

  // ---- Match names to EXISTING ids. Nothing is created here. ----
  const subjects = await prisma.subjects.findMany({
    where: { is_pyq: false }, // PYQ subjects are never used in normal exams
    include: { topics: true },
  });
  const subjMap = new Map(
    subjects.map((s) => [norm(s.subject_name).toLowerCase(), s]),
  );

  const missing = new Set<string>();
  const resolved: { subject_id: number; topic_id: number }[] = [];

  for (const q of questions) {
    const s = subjMap.get(norm(q.subject).toLowerCase());
    const t = s?.topics.find(
      (t) => norm(t.topic_name).toLowerCase() === norm(q.topic).toLowerCase(),
    );
    if (!s || !t) {
      missing.add(
        s ? `${s.subject_name} → ${norm(q.topic)}` : `Subject "${norm(q.subject)}"`,
      );
      resolved.push({ subject_id: 0, topic_id: 0 });
      continue;
    }
    resolved.push({ subject_id: s.subject_id, topic_id: t.topic_id });
  }

  if (missing.size > 0) {
    const list = [...missing];
    return NextResponse.json(
      {
        success: false,
        message: `Add these in Subjects & Topics first: ${list.slice(0, 10).join(", ")}${
          list.length > 10 ? ` and ${list.length - 10} more` : ""
        }`,
      },
      { status: 400 },
    );
  }

  try {
    const exam = await prisma.$transaction(
      async (tx) => {
        const created = await tx.exams.create({
          data: {
            exam_title: examTitle,
            description: body.description || null,
            exam_type: examType,
            selection_mode: "manual",
            time_limit_minutes: Number(body.duration) || null,
            scheduled_start: body.startTime ? new Date(body.startTime) : null,
            scheduled_end: body.endTime ? new Date(body.endTime) : null,
            created_by: userId,
            is_pyq: false,
            question_count: questions.length,
            total_marks: questions.reduce(
              (s, q) => s + Number(q.points || 2),
              0,
            ),
          },
        });

        const configs = new Map<
          string,
          { subject_id: number; topic_id: number; n: number }
        >();

        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          const { subject_id, topic_id } = resolved[i];

          const saved = await tx.questions.create({
            data: {
              question_text: q.question_text,
              option_a: q.option_a,
              option_b: q.option_b,
              option_c: q.option_c,
              option_d: q.option_d,
              correct_answer: q.correct_answer,
              marks: Number(q.points) || 2,
              difficulty: q.difficulty,
              explanation: q.explanation || null,
              subject_id,
              topic_id,
              created_by: userId,
              is_pyq: false,
            },
          });

          await tx.exam_questions.create({
            data: {
              exam_id: created.exam_id,
              question_id: saved.question_id,
              question_order: i + 1,
              assigned_marks: saved.marks,
              assigned_negative: saved.negative_marks,
            },
          });

          const k = `${subject_id}|${topic_id}`;
          const cur = configs.get(k) ?? { subject_id, topic_id, n: 0 };
          cur.n++;
          configs.set(k, cur);
        }

        await tx.exam_subject_configs.createMany({
          data: [...configs.values()].map((c) => ({
            exam_id: created.exam_id,
            subject_id: c.subject_id,
            topic_id: c.topic_id,
            question_count: c.n,
          })),
        });

        return created;
      },
      { timeout: 60000, maxWait: 10000 },
    );

    return NextResponse.json({ success: true, examId: exam.exam_id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { success: false, message: e?.message || "Import failed, nothing was saved" },
      { status: 500 },
    );
  }
}