// prelimspass\src\lib\pyqAssignmentSync.ts
//
// Shared logic for "make sure this student has an assignment row for
// every PYQ exam that currently exists." Used in two places:
//
//   1. The student LOGIN route - call this once per login for the
//      logging-in student, so any PYQ exam created before OR after their
//      registration ends up assigned to them (self-healing on every login,
//      not just a one-time registration hook).
//
//   2. The bulk resync endpoint (PATCH /api/exams/pyq) - an admin-triggered
//      "assign all PYQ exams to all currently registered students" utility,
//      for backfilling students who registered before this system existed,
//      or as a manual safety net.
//
// All inserts use skipDuplicates, so calling this repeatedly (e.g. on every
// login) is always safe and never creates duplicate assignment rows.

import { prisma } from "@/lib/db";

/**
 * Ensures the given student has an exam_assignment_students row for every
 * exam where is_pyq = true. Creates an exam_assignments row for a PYQ exam
 * if one doesn't already exist (mode: "same", shared by all students).
 *
 * @param studentId - the user_id of the student to sync
 * @param systemUserId - the user_id to record as `assigned_by` on any
 *   exam_assignments row this function has to create. Since this can run
 *   automatically (e.g. on login, with no admin present), pass a fixed
 *   "system" or "admin" user id here rather than the student's own id -
 *   check your exam_assignments.assigned_by foreign key constraint for
 *   what's valid in your schema.
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

  let newlyAssigned = 0;

  for (const exam of pyqExams) {
    let assignment = await prisma.exam_assignments.findFirst({
      where: { exam_id: exam.exam_id },
    });

    if (!assignment) {
      assignment = await prisma.exam_assignments.create({
        data: {
          exam_id: exam.exam_id,
          assigned_by: systemUserId,
          mode: "same",
        },
      });
    }

    const result = await prisma.exam_assignment_students.createMany({
      data: [{ assignment_id: assignment.id, student_id: studentId }],
      skipDuplicates: true,
    });

    newlyAssigned += result.count;
  }

  return newlyAssigned;
}

/**
 * Ensures EVERY currently registered student has an assignment row for
 * EVERY existing PYQ exam. Used by the bulk resync endpoint as a manual
 * "fix everything right now" utility (e.g. after a batch of signups, or
 * to backfill students who registered before the login-time sync existed).
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

  let studentsNewlyAssigned = 0;

  for (const exam of pyqExams) {
    let assignment = await prisma.exam_assignments.findFirst({
      where: { exam_id: exam.exam_id },
    });

    if (!assignment) {
      assignment = await prisma.exam_assignments.create({
        data: {
          exam_id: exam.exam_id,
          assigned_by: systemUserId,
          mode: "same",
        },
      });
    }

    const result = await prisma.exam_assignment_students.createMany({
      data: students.map((s) => ({
        assignment_id: assignment!.id,
        student_id: s.user_id,
      })),
      skipDuplicates: true,
    });

    studentsNewlyAssigned += result.count;
  }

  return { examsProcessed: pyqExams.length, studentsNewlyAssigned };
}