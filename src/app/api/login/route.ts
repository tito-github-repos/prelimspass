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
    // an exam_assignment_students row for every existing PYQ exam.
    //
    // Fire-and-forget: login does NOT wait for this sync, and a sync
    // failure can never block or break a successful login.
    //
    // NOTE: if you deploy to serverless hosting (e.g. Vercel), background
    // work may be cut off after the response is sent. In that case replace
    // the `void ...catch(...)` call below with:
    //   await syncPyqAssignmentsForStudent(user.user_id, systemUserId);
    // inside a try/catch (this is fast now that the sync is set-based).
    if (user.role === "student") {
      // exam_assignments.assigned_by is a FK - set SYSTEM_ASSIGNER_USER_ID
      // in your environment to a real, existing user_id (e.g. a dedicated
      // system/admin account).
      const systemUserId = process.env.SYSTEM_ASSIGNER_USER_ID
        ? Number(process.env.SYSTEM_ASSIGNER_USER_ID)
        : null;

      if (systemUserId) {
        void syncPyqAssignmentsForStudent(user.user_id, systemUserId).catch(
          (syncError) =>
            console.error(
              "PYQ assignment sync failed (login still succeeds):",
              syncError
            )
        );
      } else {
        console.warn(
          "SYSTEM_ASSIGNER_USER_ID is not set - skipping PYQ assignment sync at login. " +
            "Set this env var to a valid user_id to enable auto-assignment on login."
        );
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