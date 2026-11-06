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

interface AdminNewRegistrationEmailProps {
  name: string;
  email: string;
  username: string;
  mobile: string;
  registeredAt: string;
}

const row = { fontSize: "14px", color: "#1e293b", margin: "0 0 6px" } as const;

export default function AdminNewRegistrationEmail({
  name,
  email,
  username,
  mobile,
  registeredAt,
}: AdminNewRegistrationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New registration: {name}</Preview>
      <Body
        style={{ backgroundColor: "#f5f7fa", fontFamily: "Arial, sans-serif" }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "30px auto",
            padding: "28px",
            borderRadius: "8px",
            maxWidth: "480px",
          }}
        >
          <Heading
            style={{ color: "#1a7a3c", fontSize: "20px", margin: "0 0 16px" }}
          >
            New user registered
          </Heading>

          <Section>
            <Text style={row}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={row}>
              <strong>Email:</strong> {email}
            </Text>
            <Text style={row}>
              <strong>Username:</strong> {username}
            </Text>
            <Text style={row}>
              <strong>Mobile:</strong> +91 {mobile}
            </Text>
            <Text style={row}>
              <strong>Registered at:</strong> {registeredAt}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}