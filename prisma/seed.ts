// prisma/seed.ts
//
// Creates one default admin user and one default student user (with a
// linked student_details row) so the app isn't locked-out after a DB reset.
//
// Run after `npx prisma db push --force-reset` (or migrate reset) + `npx prisma generate`:
//   npx prisma db seed
//
// Make sure package.json has:
//   "prisma": { "seed": "ts-node prisma/seed.ts" }
// and ts-node is installed as a dev dependency:
//   npm install -D ts-node

import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs"; // swap to "bcrypt" here + in imports if that's what your auth route uses

const prisma = new PrismaClient();

async function main() {
  const SALT_ROUNDS = 10;

  // ---------------------------------------------------------
  // 1. Real Admin User (restored with existing hash - your current
  //    password keeps working after reset, nothing to remember/change)
  // ---------------------------------------------------------
  const admin = await prisma.users.upsert({
    where: { email: "manisha.admin@gmail.com" },
    update: {},
    create: {
      username: "Manisha AD",
      email: "manisha.admin@gmail.com",
      // Pasted directly from your existing DB record - already a valid
      // bcrypt hash, so we do NOT re-hash it here.
      password_hash:
        "$2b$10$dX3jBDArv/kapPXBnmH9qex18B0qdR4eYc5VU4oPMpNEIMKEZgsUe",
      role: "admin",
      first_name: "Manisha",
      last_name: "AD",
      status: "active",
      mobile_number: null, // wasn't provided - set if you have it
    },
  });

  console.log(`✅ Admin user restored -> id: ${admin.user_id}, email: ${admin.email}`);
  console.log(`   Your existing password still works - hash was carried over as-is.`);

  // ---------------------------------------------------------
  // 2. Real Student User (restored with existing hash - her current
  //    password keeps working after reset, nothing to remember/change)
  //    student_details fields (dob/gender/grade/school/section) weren't
  //    provided, so these are placeholders - update once you have the
  //    real values.
  // ---------------------------------------------------------
  const student = await prisma.users.upsert({
    where: { email: "sara@gmail.com" },
    update: {},
    create: {
      username: "Sara ST",
      email: "sara@gmail.com",
      // Pasted directly from your existing DB record - already a valid
      // bcrypt hash, so we do NOT re-hash it here.
      password_hash:
        "$2b$10$3VCY2/F.W30MFC14jsblA.3JS4VPSeEWnJP595X.1bRcxUvhyHZLW",
      role: "student",
      first_name: "Sara",
      last_name: "ST",
      status: "active",
      mobile_number: "120001",
      student_details: {
        create: {
          dob: new Date("2000-01-01"), // placeholder - not provided
          gender: "female", // placeholder - not provided
          grade: "N/A",
          school: "N/A",
          section: "N/A",
          is_paid_user: false,
        },
      },
    },
    include: { student_details: true },
  });

  console.log(`✅ Student user restored -> id: ${student.user_id}, email: ${student.email}`);
  console.log(`   Her existing password still works - hash was carried over as-is.`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });