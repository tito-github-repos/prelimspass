import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OtpEmailProps {
  otp: string;
}

export default function OtpEmail({ otp }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your PrelimsPass verification code</Preview>

      <Body
        style={{
          backgroundColor: "#f4f6f8",
          fontFamily: "Arial, sans-serif",
          padding: "40px 0",
          margin: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            padding: "40px 32px",
          }}
        >
          {/* Brand */}
          <Text
            style={{
              color: "#15803d",
              fontSize: "20px",
              fontWeight: "bold",
              margin: "0 0 24px",
              letterSpacing: "0.3px",
            }}
          >
            PrelimsPass
          </Text>

          <Heading
            style={{
              color: "#0f172a",
              fontSize: "20px",
              margin: "0 0 8px",
            }}
          >
            Verify it&apos;s you
          </Heading>

          <Text
            style={{
              color: "#475569",
              fontSize: "14px",
              margin: "0 0 24px",
              lineHeight: "20px",
            }}
          >
            Use the code below to reset your password. This code is valid for
            the next 5 minutes.
          </Text>

          {/* OTP box */}
          <Section
            style={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              padding: "18px 0",
              textAlign: "center",
              margin: "0 0 24px",
            }}
          >
            <Text
              style={{
                color: "#15803d",
                fontSize: "36px",
                fontWeight: "bold",
                letterSpacing: "8px",
                margin: 0,
              }}
            >
              {otp}
            </Text>
          </Section>

          <Text
            style={{
              color: "#64748b",
              fontSize: "13px",
              margin: "0 0 24px",
              lineHeight: "18px",
            }}
          >
            Didn&apos;t request this? You can safely ignore this email — your
            account is still secure.
          </Text>

          <Section
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "20px",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                margin: 0,
              }}
            >
              PrelimsPass · UPSC Preparation Platform
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
