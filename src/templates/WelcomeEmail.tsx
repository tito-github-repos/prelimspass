// import {
//   Body,
//   Button,
//   Container,
//   Head,
//   Heading,
//   Hr,
//   Html,
//   Link,
//   Preview,
//   Section,
//   Text,
// } from "@react-email/components";

// interface WelcomeEmailProps {
//   firstName: string;
// }

// /* TODO: replace with your real app links */
// const FF_PLAY_STORE = "https://play.google.com/store/apps/details?id=REPLACE_FF";
// const FF_APP_STORE = "https://apps.apple.com/app/REPLACE_FF";
// const RR_PLAY_STORE = "https://play.google.com/store/apps/details?id=REPLACE_RR";
// const RR_APP_STORE = "https://apps.apple.com/app/REPLACE_RR";

// const SITE_URL = "https://prelimspass.com";
// const PRICING_URL = "https://www.prelimspass.com/pricing";
// const CONTACT_URL = "https://www.prelimspass.com/contacts";

// const GREEN = "#1a7a3c";
// const GREEN_DARK = "#0f7a35";
// const GREEN_LIGHT = "#e9f7ee";
// const GREEN_BORDER = "#bfe5cb";
// const ORANGE = "#d9631e";
// const ORANGE_LIGHT = "#fff4ea";
// const ORANGE_BORDER = "#f6cfb4";
// const TEXT = "#1e293b";
// const MUTED = "#6b7280";

// const para = {
//   fontSize: "14px",
//   color: TEXT,
//   lineHeight: "1.65",
//   margin: "0 0 8px",
// } as const;

// const cardTitle = (color: string) =>
//   ({
//     fontSize: "17px",
//     fontWeight: 700,
//     color,
//     margin: "0 0 2px",
//   }) as const;

// const cardSub = {
//   fontSize: "12px",
//   fontWeight: 700,
//   letterSpacing: "0.6px",
//   textTransform: "uppercase",
//   color: MUTED,
//   margin: "0 0 10px",
// } as const;

// const storeBtn = (bg: string) =>
//   ({
//     backgroundColor: bg,
//     color: "#ffffff",
//     padding: "9px 16px",
//     borderRadius: "6px",
//     fontWeight: 700,
//     fontSize: "12.5px",
//     textDecoration: "none",
//     display: "inline-block",
//   }) as const;

// const packBox = (border: string) =>
//   ({
//     border: `1px solid ${border}`,
//     backgroundColor: "#ffffff",
//     borderRadius: "8px",
//     padding: "12px 14px",
//     margin: "0 0 10px",
//   }) as const;

// export default function WelcomeEmail({ firstName }: WelcomeEmailProps) {
//   return (
//     <Html>
//       <Head />
//       <Preview>
//         Welcome to PrelimsPass! Your registration is successful.
//       </Preview>
//       <Body
//         style={{
//           backgroundColor: "#f1f5f3",
//           fontFamily: "Arial, Helvetica, sans-serif",
//           margin: 0,
//           padding: "24px 0",
//         }}
//       >
//         <Container
//           style={{
//             backgroundColor: "#ffffff",
//             maxWidth: "560px",
//             margin: "0 auto",
//             borderRadius: "12px",
//             overflow: "hidden",
//             border: "1px solid #e6e9ee",
//           }}
//         >
//           {/* Header band */}
//           <Section style={{ backgroundColor: GREEN, padding: "28px 32px" }}>
//             <Text
//               style={{
//                 color: "#ffffff",
//                 fontSize: "14px",
//                 fontWeight: 700,
//                 letterSpacing: "1px",
//                 margin: "0 0 6px",
//                 opacity: 0.9,
//               }}
//             >
//               PRELIMS<span style={{ color: "#a7f0c0" }}>PASS</span>
//             </Text>
//             <Heading
//               style={{
//                 color: "#ffffff",
//                 fontSize: "26px",
//                 fontWeight: 800,
//                 margin: 0,
//                 lineHeight: "1.25",
//               }}
//             >
//               Welcome to PrelimsPass!
//             </Heading>
//           </Section>

//           <Section style={{ padding: "28px 32px 8px" }}>
//             <Text style={para}>Hi {firstName},</Text>
//             <Text style={para}>
//               Welcome to PrelimsPass! Your registration is successful. Thank you
//               for joining us on your UPSC journey.
//             </Text>

//             {/* Free PYQ */}
//             <Section
//               style={{
//                 backgroundColor: GREEN_LIGHT,
//                 border: `1px solid ${GREEN_BORDER}`,
//                 borderRadius: "10px",
//                 padding: "16px 18px",
//                 margin: "18px 0",
//               }}
//             >
//               <Text
//                 style={{
//                   ...cardTitle(GREEN),
//                   fontSize: "16px",
//                   margin: "0 0 8px",
//                 }}
//               >
//                 🎁 Free for you: PYQ practice
//               </Text>
//               <Text style={{ ...para, margin: "0 0 4px" }}>
//                 • <strong>FF web app:</strong> topic-wise, answer-type-wise and
//                 difficulty-wise practice
//               </Text>
//               <Text style={{ ...para, margin: "0 0 4px" }}>
//                 • <strong>FF mobile app:</strong> PYQs in True or False format
//               </Text>
//               <Text style={{ ...para, margin: 0 }}>
//                 • <strong>RR mobile app:</strong> PYQs available
//               </Text>
//             </Section>

//             {/* FF */}
//             <Section
//               style={{
//                 border: `1px solid ${GREEN_BORDER}`,
//                 borderRadius: "10px",
//                 padding: "18px",
//                 margin: "0 0 18px",
//               }}
//             >
//               <Text style={cardTitle(GREEN)}>For Facts (FF)</Text>
//               <Text style={cardSub}>GS Prelims</Text>
//               <Text style={para}>
//                 10,000 facts, weekly updates, and 30 mock tests in the real UPSC
//                 pattern.
//               </Text>

//               <Section
//                 style={{
//                   backgroundColor: GREEN_LIGHT,
//                   borderRadius: "8px",
//                   padding: "10px 14px",
//                   margin: "6px 0 14px",
//                 }}
//               >
//                 <Text style={{ ...para, margin: 0, color: GREEN_DARK }}>
//                   🎉 <strong>Special offer: just ₹999</strong>{" "}
//                   <span
//                     style={{ textDecoration: "line-through", color: MUTED }}
//                   >
//                     ₹9,999
//                   </span>{" "}
//                   until Dec 31, 2026.
//                 </Text>
//               </Section>

//               <Text style={{ margin: 0 }}>
//                 <Button href={FF_PLAY_STORE} style={storeBtn(GREEN)}>
//                   Google Play
//                 </Button>
//                 <span style={{ display: "inline-block", width: "8px" }} />
//                 <Button href={FF_APP_STORE} style={storeBtn("#1e293b")}>
//                   App Store
//                 </Button>
//               </Text>
//             </Section>

//             {/* RR */}
//             <Section
//               style={{
//                 border: `1px solid ${ORANGE_BORDER}`,
//                 backgroundColor: ORANGE_LIGHT,
//                 borderRadius: "10px",
//                 padding: "18px",
//                 margin: "0 0 18px",
//               }}
//             >
//               <Text style={cardTitle(ORANGE)}>wRite Right (RR)</Text>
//               <Text style={cardSub}>GS Mains</Text>
//               <Text style={para}>
//                 Answer writing practice with answer script evaluation and
//                 one-to-one feedback.
//               </Text>

//               <Section style={packBox(ORANGE_BORDER)}>
//                 <Text style={{ ...para, margin: "0 0 2px", fontWeight: 700 }}>
//                   PYQs Pack{" "}
//                   <span style={{ color: ORANGE, float: "right" }}>₹9,999</span>
//                 </Text>
//                 <Text style={{ ...para, fontSize: "13px", margin: 0 }}>
//                   14 years of GS Mains PYQs for practice, with 70 PYQs getting
//                   answer script evaluation.
//                 </Text>
//               </Section>

//               <Section style={packBox(ORANGE_BORDER)}>
//                 <Text style={{ ...para, margin: "0 0 2px", fontWeight: 700 }}>
//                   Mock Tests Pack{" "}
//                   <span style={{ color: ORANGE, float: "right" }}>₹9,999</span>
//                 </Text>
//                 <Text style={{ ...para, fontSize: "13px", margin: 0 }}>
//                   10 full-length GS Mains mock tests for practice, with 50 mock
//                   papers getting answer script evaluation.
//                 </Text>
//               </Section>

//               <Text style={{ margin: "6px 0 0" }}>
//                 <Button href={RR_PLAY_STORE} style={storeBtn(ORANGE)}>
//                   Google Play
//                 </Button>
//                 <span style={{ display: "inline-block", width: "8px" }} />
//                 <Button href={RR_APP_STORE} style={storeBtn("#1e293b")}>
//                   App Store
//                 </Button>
//               </Text>
//             </Section>

//             {/* Pricing CTA */}
//             <Section style={{ textAlign: "center", margin: "6px 0 18px" }}>
//               <Button
//                 href={PRICING_URL}
//                 style={{
//                   backgroundColor: GREEN,
//                   color: "#ffffff",
//                   padding: "13px 30px",
//                   borderRadius: "8px",
//                   fontWeight: 700,
//                   fontSize: "14.5px",
//                   textDecoration: "none",
//                 }}
//               >
//                 View plans &amp; pricing →
//               </Button>
//             </Section>

//             <Hr style={{ borderColor: "#e6e9ee", margin: "6px 0 16px" }} />

//             <Text style={para}>
//               If you have any queries, please feel free to{" "}
//               <Link href={CONTACT_URL} style={{ color: GREEN, fontWeight: 700 }}>
//                 contact us
//               </Link>
//               .
//             </Text>

//             <Text style={{ ...para, margin: "14px 0 0" }}>Best wishes,</Text>
//             <Text style={{ ...para, fontWeight: 700, margin: "0 0 4px" }}>
//               Team PrelimsPass
//             </Text>
//           </Section>

//           {/* Footer */}
//           <Section
//             style={{
//               backgroundColor: "#f8faf9",
//               padding: "14px 32px",
//               textAlign: "center",
//               borderTop: "1px solid #e6e9ee",
//             }}
//           >
//             <Link
//               href={SITE_URL}
//               style={{ color: GREEN, fontSize: "13px", fontWeight: 700 }}
//             >
//               prelimspass.com
//             </Link>
//           </Section>
//         </Container>
//       </Body>
//     </Html>
//   );
// }

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  firstName: string;
}

const SITE_URL = "https://prelimspass.com";
const CONTACT_URL = "https://www.prelimspass.com/contacts";

const GREEN = "#1a7a3c";
const TEXT = "#1e293b";

const para = {
  fontSize: "14px",
  color: TEXT,
  lineHeight: "1.65",
  margin: "0 0 10px",
} as const;

export default function WelcomeEmail({ firstName }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Thank you for registering with PrelimsPass. We will contact you
        shortly.
      </Preview>
      <Body
        style={{
          backgroundColor: "#f1f5f3",
          fontFamily: "Arial, Helvetica, sans-serif",
          margin: 0,
          padding: "24px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            maxWidth: "560px",
            margin: "0 auto",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e6e9ee",
          }}
        >
          {/* Header band */}
          <Section style={{ backgroundColor: GREEN, padding: "28px 32px" }}>
            <Text
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "1px",
                margin: "0 0 6px",
                opacity: 0.9,
              }}
            >
              PRELIMS<span style={{ color: "#a7f0c0" }}>PASS</span>
            </Text>
            <Heading
              style={{
                color: "#ffffff",
                fontSize: "26px",
                fontWeight: 800,
                margin: 0,
                lineHeight: "1.25",
              }}
            >
              Thank you for registering!
            </Heading>
          </Section>

          {/* Body */}
          <Section style={{ padding: "28px 32px 8px" }}>
            <Text style={para}>Hi {firstName},</Text>
            <Text style={para}>
              Thank you for registering with PrelimsPass. We will contact you
              shortly.
            </Text>
            <Text style={para}>
              If you have any queries, please feel free to{" "}
              <Link
                href={CONTACT_URL}
                style={{ color: GREEN, fontWeight: 700 }}
              >
                contact us
              </Link>
              .
            </Text>

            <Hr style={{ borderColor: "#e6e9ee", margin: "20px 0 16px" }} />

            <Text style={{ ...para, margin: "0 0 2px" }}>Best wishes,</Text>
            <Text style={{ ...para, fontWeight: 700, margin: "0 0 14px" }}>
              Team PrelimsPass
            </Text>
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: "#f8faf9",
              padding: "14px 32px",
              textAlign: "center",
              borderTop: "1px solid #e6e9ee",
            }}
          >
            <Link
              href={SITE_URL}
              style={{ color: GREEN, fontSize: "13px", fontWeight: 700 }}
            >
              prelimspass.com
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}