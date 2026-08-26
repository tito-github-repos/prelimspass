// app/api/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { syncPyqAssignmentsForStudent } from "@/lib/Pyqassignmentsync";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user (case-insensitive handled by normalization)
    const user = await prisma.users.findFirst({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (user.status !== "active") {
      return NextResponse.json(
        { error: "Account not active. Please contact admin." },
        { status: 403 } // Forbidden
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // ---- Self-heal PYQ exam assignments for students ----
    // Runs on every successful student login and ensures the student has
    // an exam_assignment_students row for every existing PYQ exam - this
    // is what makes PYQ exams "just work" for a student regardless of
    // when they registered, without needing a one-time registration hook
    // that could be missed (bulk imports, admin-created accounts, etc.).
    //
    // Deliberately isolated in its own try/catch: a sync failure here must
    // NEVER block a successful login. If this fails, the student simply
    // won't see brand-new PYQ exams until their next successful sync (next
    // login, or a manual PATCH /api/exams/pyq resync) - annoying, but not
    // login-breaking.
    if (user.role === "student") {
      try {
        // TODO: confirm this is the right value for your schema.
        // exam_assignments.assigned_by is a FK - when this sync runs at
        // login time there's no admin present, so we need a fixed
        // "system" user id to attribute these auto-created assignments
        // to. Set SYSTEM_ASSIGNER_USER_ID in your environment to a real,
        // existing user_id (e.g. a dedicated system/admin account).
        const systemUserId = process.env.SYSTEM_ASSIGNER_USER_ID
          ? Number(process.env.SYSTEM_ASSIGNER_USER_ID)
          : null;

        if (systemUserId) {
          await syncPyqAssignmentsForStudent(user.user_id, systemUserId);
        } else {
          console.warn(
            "SYSTEM_ASSIGNER_USER_ID is not set - skipping PYQ assignment sync at login. " +
              "Set this env var to a valid user_id to enable auto-assignment on login.",
          );
        }
      } catch (syncError) {
        console.error("PYQ assignment sync failed (login still succeeds):", syncError);
      }
    }

    // Generate JWT token (8 hour expiry)
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Get username from database
    const username = user.username;

    // Safe log
    console.log("User login:", {
      userId: user.user_id,
      email: normalizedEmail,
      role: user.role,
    });

    return NextResponse.json({
      message: "Login successful",
      role: user.role,
      token,
      username,
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}