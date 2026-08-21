import { render } from "@react-email/render";
import OtpEmail from "@/templates/OtpEmail";
import { resend } from "./resend";

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