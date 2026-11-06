import { render } from "@react-email/render";
import OtpEmail from "@/templates/OtpEmail";
import { resend } from "./resend";
import WelcomeEmail from "@/templates/WelcomeEmail";

export const sendOtpEmail = async (to: string, otp: string) => {
  try {
    const html = await render(<OtpEmail otp={otp} />);

    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to,
      subject: "PrelimsPass - Password Reset Code",
      html,
    });

    console.log("OTP Email:", response);
  } catch (error) {
    console.error("EMAIL ERROR:", error);
  }
};

export const sendWelcomeEmail = async (to: string, firstName: string) => {
  try {
    const html = await render(<WelcomeEmail firstName={firstName} />);

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to,
      subject: "Welcome to PrelimsPass - Registration Successful",
      html,
    });

    if (error) {
      console.error("WELCOME EMAIL ERROR:", error);
      return;
    }
    console.log("Welcome email sent:", data?.id);
  } catch (error) {
    console.error("WELCOME EMAIL ERROR:", error);
  }
};

import AdminNewRegistrationEmail from "@/templates/AdminNewRegistrationEmail";

export const sendAdminNewRegistrationEmail = async (user: {
  name: string;
  email: string;
  username: string;
  mobile: string;
}) => {
  try {
    const adminEmails = process.env.ADMIN_EMAIL?.split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (!adminEmails || adminEmails.length === 0) {
      console.warn("ADMIN_EMAIL is not set, skipping admin notification");
      return;
    }

    const registeredAt = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const html = await render(
      <AdminNewRegistrationEmail {...user} registeredAt={registeredAt} />,
    );

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: adminEmails,
      subject: `New Registration - ${user.name}`,
      html,
    });

    if (error) {
      console.error("ADMIN EMAIL ERROR:", error);
      return;
    }
    console.log("Admin notification sent:", data?.id);
  } catch (error) {
    console.error("ADMIN EMAIL ERROR:", error);
  }
};