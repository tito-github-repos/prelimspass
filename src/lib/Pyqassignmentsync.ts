// src/lib/Pyqassignmentsync.ts
//
// Shared logic for "make sure this student has an assignment row for
// every PYQ exam that currently exists." Used in two places:
//
//   1. The student LOGIN route - call this once per login for the
//      logging-in student, so any PYQ exam created before OR after their
//      registration ends up assigned to them.
//
//   2. The bulk resync endpoint (PATCH /api/exams/pyq) - an admin-triggered
//      "assign all PYQ exams to all currently registered students" utility.
//
// All inserts use skipDuplicates, so calling this repeatedly is always safe
// and never creates duplicate assignment rows.
//
// PERFORMANCE: everything here is done with a fixed number of set-based
// queries (no per-exam database round trips), so the cost does not grow
// with the number of PYQ exams.

import { prisma } from "@/lib/db";

const INSERT_CHUNK_SIZE = 5000;

/**
 * Returns a map of exam_id -> assignment id (one assignment per exam, the
 * lowest id), creating exam_assignments rows for exams that have none.
 */
async function ensureAssignmentsForExams(
  examIds: number[],
  systemUserId: number,
): Promise<Map<number, number>> {
  const load = async () => {
    const rows = await prisma.exam_assignments.findMany({
      where: { exam_id: { in: examIds } },
      select: { id: true, exam_id: true },
      orderBy: { id: "asc" },
    });

    const byExam = new Map<number, number>();
    for (const row of rows) {
      // keep the first (lowest id) assignment per exam
      if (!byExam.has(row.exam_id)) byExam.set(row.exam_id, row.id);
    }
    return byExam;
  };

  let byExam = await load();

  const missing = examIds.filter((id) => !byExam.has(id));
  if (missing.length > 0) {
    await prisma.exam_assignments.createMany({
      data: missing.map((exam_id) => ({
        exam_id,
        assigned_by: systemUserId,
        mode: "same",
      })),
    });
    byExam = await load();
  }

  return byExam;
}

/**
 * Ensures the given student has an exam_assignment_students row for every
 * exam where is_pyq = true. Creates an exam_assignments row for a PYQ exam
 * if one doesn't already exist (mode: "same", shared by all students).
 *
 * @param studentId - the user_id of the student to sync
 * @param systemUserId - the user_id recorded as `assigned_by` on any
 *   exam_assignments row this function has to create (must satisfy the
 *   assigned_by foreign key).
 * @returns the number of new assignment rows created for this student
 */
export async function syncPyqAssignmentsForStudent(
  studentId: number,
  systemUserId: number,
): Promise<number> {
  const pyqExams = await prisma.exams.findMany({
    where: { is_pyq: true },
    select: { exam_id: true },
  });

  if (pyqExams.length === 0) return 0;

  const examIds = pyqExams.map((e) => e.exam_id);
  const byExam = await ensureAssignmentsForExams(examIds, systemUserId);

  const rows = [...byExam.values()].map((assignment_id) => ({
    assignment_id,
    student_id: studentId,
  }));

  if (rows.length === 0) return 0;

  const result = await prisma.exam_assignment_students.createMany({
    data: rows,
    skipDuplicates: true,
  });

  return result.count;
}

/**
 * Ensures EVERY currently registered student has an assignment row for
 * EVERY existing PYQ exam. Used by the bulk resync endpoint as a manual
 * "fix everything right now" utility.
 *
 * @returns summary counts for the admin-facing response
 */
export async function syncPyqAssignmentsForAllStudents(
  systemUserId: number,
): Promise<{ examsProcessed: number; studentsNewlyAssigned: number }> {
  const pyqExams = await prisma.exams.findMany({
    where: { is_pyq: true },
    select: { exam_id: true },
  });

  const students = await prisma.users.findMany({
    where: { role: "student" },
    select: { user_id: true },
  });

  if (pyqExams.length === 0 || students.length === 0) {
    return { examsProcessed: 0, studentsNewlyAssigned: 0 };
  }

  const examIds = pyqExams.map((e) => e.exam_id);
  const byExam = await ensureAssignmentsForExams(examIds, systemUserId);

  // Build every (assignment, student) pair, then insert in chunks.
  const rows: { assignment_id: number; student_id: number }[] = [];
  for (const assignmentId of byExam.values()) {
    for (const s of students) {
      rows.push({ assignment_id: assignmentId, student_id: s.user_id });
    }
  }

  let studentsNewlyAssigned = 0;
  for (let i = 0; i < rows.length; i += INSERT_CHUNK_SIZE) {
    const result = await prisma.exam_assignment_students.createMany({
      data: rows.slice(i, i + INSERT_CHUNK_SIZE),
      skipDuplicates: true,
    });
    studentsNewlyAssigned += result.count;
  }

  return { examsProcessed: pyqExams.length, studentsNewlyAssigned };
}