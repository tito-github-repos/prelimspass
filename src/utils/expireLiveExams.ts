import { prisma } from "@/lib/db";

// Marks live exams whose end time has passed as inactive in the database
export async function expireLiveExams() {
  await prisma.exams.updateMany({
    where: {
      exam_type: "live",
      is_active: true,
      scheduled_end: { lt: new Date() },
    },
    data: { is_active: false },
  });
}