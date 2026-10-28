"use client";
import PyqSection from "./PyqSection";
import PromoPopup from "./PromoPopup";
import "./website.css";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";

function Tick({ color }: { color: string }) {
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: `${color}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </Box>
  );
}

/* Numbered point badge (used in the new product cards) */
function NumBadge({ n, color }: { n: number; color: string }) {
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: `${color}18`,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: "0.65rem",
        fontWeight: 800,
        fontFamily: "var(--website-font)",
        mt: "1px",
      }}
    >
      {n}
    </Box>
  );
}

/* ══ DATA ══ */
const features = [
  {
    title: "UPSC Pattern",
    desc: "All tests strictly follow UPSC exam pattern and difficulty level.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Unlimited Practice",
    desc: "Topic-wise & subject-wise questions with unlimited retakes.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: "Mock Exams",
    desc: "Real UPSC pattern mock tests.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: "Progress Tracking",
    desc: "Monitor your journey with detailed reports and trend analysis.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Detailed Analytics",
    desc: "Track accuracy, speed, strengths and topic performance.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <polyline points="2 20 22 20" />
      </svg>
    ),
  },
];

const products = [
  {
    color: "#16a34a",
    lightBg: "#f0fdf4",
    borderCol: "#bbf7d0",
    // Poll icon: MCQs (from /public/Icons/poll-icon.svg)
    icon: (
      <Box
        component="span"
        sx={{
          display: "block",
          width: 26,
          height: 26,
          backgroundColor: "#16a34a",
          WebkitMask: "url(/Icons/poll-icon.svg) center / contain no-repeat",
          mask: "url(/Icons/poll-icon.svg) center / contain no-repeat",
        }}
      />
    ),
    title: "EzeeExams - EE",
    sub: "Eases GS Prelims",
    intro:
      "Two applications, Mobile App and Web App, eases GS prelims preparation.",
    points: [
      {
        text: "Mobile app addresses syllabus coverage, by providing facts in an easy format, incrementally.",
        subs: [
          { text: "Facts per subject added incrementally" },
          { text: "New facts added every week" },
          { text: "Revise more, in the shortest possible time", bold: true },
        ],
      },
      {
        text: "Web app addresses prelims patterns practice mock tests, in the recent trends format.",
      },
      {
        text: "After registration, the mobile app link is sent to your registered email.",
      },
      {
        text: "Completely FREE for all registered users for one day.",
      },
    ],
    highlight: "60 mock tests practice before the 2027 prelims examination.",
    btn: "Buy Now",
    href: "/pricing",
  },
  {
    color: "#ea580c",
    lightBg: "#fff7ed",
    borderCol: "#fed7aa",
    // Edit document icon: descriptive answers (from /public/Icons/edit-document-icon.svg)
    icon: (
      <Box
        component="span"
        sx={{
          display: "block",
          width: 26,
          height: 26,
          backgroundColor: "#ea580c",
          WebkitMask:
            "url(/Icons/edit-document-icon.svg) center / contain no-repeat",
          mask: "url(/Icons/edit-document-icon.svg) center / contain no-repeat",
        }}
      />
    ),
    title: "MagicMains - MM",
    sub: "Eases GS Mains",
    intro:
      "MM is a mobile application addresses mains answer writing practice, by providing pyqs and mock questions in an answer booklet format- paper wise ,syllabus wise, subject wise and topic wise.",
    points: [
      { text: "Aspirants can download the answer booklets." },
      {
        text: "Write answers and share it with MagicMains team for evaluation and one to one feedback.",
      },
      {
        text: "After registration, the MagicMains mobile app link is sent to your registered email.",
      },
      {
        text: "Completely FREE for all registered users for one day.",
      },
    ],
    highlight: "20 mock tests practice before the 2027 mains examination.",
    btn: "Buy Now",
    href: "/pricing",
  },
];

/* ══ OLD (kept for reference, currently unused) ══ */
const featuredOffering = {
  title: "Mains cum Prelims",
  price: "₹11,111",
  priceUnit: "Valid for the 2027 season",
  intro:
    "Full Mains answer-writing practice — inclusive of Prelims Practice access.",
  feats: [
    // "Inclusive of Prelims Practice — no extra fee",
    // "Mains Practice with Prelims Mobile App, Prelims PYQ & Prelims Mock Test — all free, included",
    "Each answer paper is evaluated, analyzed & discussed one-to-one",
    "Before 31 Dec 2026: 12 tests per paper — conducted, evaluated & discussed with every enrolled student",
    "After the Prelims exam: 8 tests per paper — conducted, evaluated & discussed with every enrolled student",
  ],
  btn: "Enroll in Mains cum Prelims",
};

const offerings = [
  {
    color: "#ea580c",
    lightBg: "#fff7ed",
    borderCol: "#fed7aa",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ea580c"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <line x1="11" y1="18" x2="13" y2="18" />
      </svg>
    ),
    title: "Prelims Mobile App",
    sub: "For Quick Coverage",
    price: "₹999",
    priceUnit: "Valid up to Prelims exam, May 2027",
    note: "Available for all paid users",
    feats: [
      "Facts per subject added incrementally",
      "New facts added every week",
      // "Daily True / False quiz game",
      "Revise more, in the shortest possible time",
    ],
    btn: "Get the App",
  },
  {
    color: "#16a34a",
    lightBg: "#f0fdf4",
    borderCol: "#bbf7d0",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "Prelims Practice",
    sub: "Unlimited practice.",
    // Unlimited growth. Crack Prelims with confidence.",
    // pm: "₹1,111",
    // py: "₹11,111",
    price: "Free",
    priceUnit:
      "For silver & gold badge users of Prelims Mobile App · Valid for the 2027 season",
    // "/ month",
    note: "Free for Mains Practice enrolled students",
    feats: [
      // "Unlimited Subject & Topic Tests",
      "PYQ Practice and Access",
      // "Live Mock Exams",
      "Mock Exams Practice",
      // "Prelims Mobile App included free",
      "Performance Analytics & Progress Tracking",
    ],
    btn: "Explore Prelims Tests",
  },
];

const schedule = [
  { day: "Monday", topic: "Environment" },
  { day: "Tuesday", topic: "Geography" },
  { day: "Wednesday", topic: "Science & Tech" },
  { day: "Thursday", topic: "Polity" },
  { day: "Friday", topic: "Economy" },
  { day: "Saturday", topic: "History" },
  { day: "Sunday", topic: "Current Affairs" },
];

const dFeats = [
  "3650+ questions practice in a year",
  "100 mock tests before prelims",
  "UPSC pattern & standard",
  "Detailed performance analysis",
  "Subject-wise leaderboards",
];
const wFeats = [
  "All Saturday: Test Practice – Essay & Ethics papers",
  "All Sunday: Test Practice – Any two of the GS papers",
  "Get evaluated within 24 hours",
  "Detailed feedback & model answers",
  "Improve writing skills consistently",
];

/* ══ HOW IT WORKS: 6 steps (EzeeExams flow)
   Phone icons = Mobile App steps · Monitor icons = Web App steps ══ */
const steps = [
  {
    n: "1",
    title: "Register in EzeeExams",
    desc: "To access the mobile app",
    // Phone with a user (register)
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="1.5" width="14" height="21" rx="2.5" />
        <circle cx="12" cy="9" r="2.2" />
        <path d="M8.2 16c0-2 1.7-3.3 3.8-3.3s3.8 1.3 3.8 3.3" />
        <line x1="11" y1="19.5" x2="13" y2="19.5" />
      </svg>
    ),
  },
  {
    n: "2",
    title: "Practice PYQs",
    desc: "For coverage",
    // Phone with question lines
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="1.5" width="14" height="21" rx="2.5" />
        <line x1="8.5" y1="7.5" x2="15.5" y2="7.5" />
        <line x1="8.5" y1="11" x2="15.5" y2="11" />
        <line x1="8.5" y1="14.5" x2="13" y2="14.5" />
        <line x1="11" y1="19.5" x2="13" y2="19.5" />
      </svg>
    ),
  },
  {
    n: "3",
    title: "Register in Web App",
    desc: "Practice PYQ mocks",
    // Monitor with a user
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <circle cx="12" cy="8" r="2" />
        <path d="M8.5 14c0-1.9 1.6-3 3.5-3s3.5 1.1 3.5 3" />
      </svg>
    ),
  },
  {
    n: "4",
    title: "Practice Non-PYQs",
    desc: "For 2027 coverage in EE",
    // Phone with stacked layers
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="1.5" width="14" height="21" rx="2.5" />
        <polygon points="12 6 8 8 12 10 16 8 12 6" />
        <polyline points="8 11.5 12 13.5 16 11.5" />
        <polyline points="8 15 12 17 16 15" />
      </svg>
    ),
  },
  {
    n: "5",
    title: "Practice 2027 Mocks",
    desc: "Be exam-ready for Prelims 2027",
    // Monitor with a check mark
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <polyline points="8.5 10 11 12.5 15.5 7.5" />
      </svg>
    ),
  },
  {
    n: "6",
    title: "Revise Again & Again",
    desc: "Build speed & memory retention",
    // Repeat arrows
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
];
/* ══ HOW MAGICMAINS WORKS: 4 steps (reuses EzeeExams icons 1, 2, 4, 5) ══ */
const mmSteps = [
  {
    ...steps[0],
    n: "1",
    title: "Register in MagicMains",
    desc: "To access the mobile app",
  },
  {
    ...steps[1],
    n: "2",
    title: "Practice PYQs",
    desc: "For mains coverage",
  },
  {
    ...steps[3],
    n: "3",
    title: "Practice Non-PYQs",
    desc: "For 2027 coverage in MM",
  },
  {
    ...steps[4],
    n: "4",
    title: "Practice 2027 Mocks",
    desc: "Be exam-ready for Mains 2027",
  },
];

const W = "var(--website-font)";

function StepsRow({
  items,
  cols,
  maxWidth,
}: {
  items: typeof steps;
  cols: number;
  maxWidth?: number;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2,1fr)",
          sm: cols === 4 ? "repeat(2,1fr)" : "repeat(3,1fr)",
          lg: `repeat(${cols},1fr)`,
        },
        gap: { xs: 2.5, md: 1.5 },
        position: "relative",
        maxWidth: maxWidth ?? "none",
        mx: "auto",
      }}
    >
      {items.map((s, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            px: { xs: 0.5, lg: 0.8 },
          }}
        >
          {/* Connector line + arrow (desktop only) */}
          {i < items.length - 1 && (
            <Box
              sx={{
                display: { xs: "none", lg: "block" },
                position: "absolute",
                top: 26,
                left: "calc(50% + 34px)",
                width: "calc(100% - 36px)",
                height: "1.5px",
                background:
                  "linear-gradient(90deg, rgba(74,222,128,0.45), rgba(74,222,128,0.1))",
                zIndex: 0,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  right: -1,
                  top: -4,
                  width: 7,
                  height: 7,
                  borderTop: "1.5px solid rgba(74,222,128,0.45)",
                  borderRight: "1.5px solid rgba(74,222,128,0.45)",
                  transform: "rotate(45deg)",
                },
              }}
            />
          )}

          {/* Icon circle with step number badge */}
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(22,163,74,0.1)",
              border: "1.5px solid rgba(74,222,128,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4ade80",
              mb: 1.5,
              position: "relative",
              zIndex: 1,
              transition: "all 0.22s ease",
              "&:hover": {
                background: "#16a34a",
                color: "#fff",
                border: "1.5px solid #16a34a",
                transform: "scale(1.1)",
                boxShadow: "0 0 20px rgba(22,163,74,0.45)",
              },
            }}
          >
            {s.icon}
            <Box
              sx={{
                position: "absolute",
                top: -7,
                right: -7,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#16a34a",
                color: "#fff",
                fontSize: "0.58rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: W,
                boxShadow: "0 2px 8px rgba(22,163,74,0.6)",
              }}
            >
              {s.n}
            </Box>
          </Box>

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.8rem",
              color: "#e2e8f0",
              mb: 0.5,
              fontFamily: W,
              lineHeight: 1.3,
            }}
          >
            {s.title}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: "#94a3b8",
              lineHeight: 1.5,
              fontFamily: W,
            }}
          >
            {s.desc}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default function HomepageSections() {
  return (
    <>
      <PromoPopup />

      {/* ══════════════════════════════════════════════
          §1  WHY CHOOSE
      ══════════════════════════════════════════════ */}
      <Box
        component="section"
        sx={{ pt: "24px", pb: "24px", background: "#fff" }}
      >
        <Box
          sx={{ maxWidth: 1240, mx: "auto", px: { xs: "18px", sm: "24px" } }}
        >
          <Box sx={{ textAlign: "center", mb: 2.5 }}>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.55rem", md: "2rem" },
                fontWeight: 800,
                color: "#0f172a",
                fontFamily: W,
                lineHeight: 1.2,
              }}
            >
              Why Aspirants Choose{" "}
              <Box component="span" sx={{ color: "#16a34a" }}>
                PrelimsPass
              </Box>
              ?
            </Typography>
          </Box>

          {/* Centered flex-wrap: works for 5 cards at every screen size */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "14px",
            }}
          >
            {features.map((f, i) => (
              <Box
                key={i}
                sx={{
                  width: {
                    xs: "calc((100% - 14px) / 2)",
                    sm: "calc((100% - 28px) / 3)",
                    lg: "calc((100% - 56px) / 5)",
                  },
                  boxSizing: "border-box",
                  background: "#fff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "14px",
                  p: { xs: "14px 10px", md: "16px 12px" },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 0.8,
                  cursor: "default",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#16a34a",
                    boxShadow: "0 8px 28px rgba(22,163,74,0.13)",
                    transform: "translateY(-4px)",
                    "& .fbox": { background: "#16a34a", color: "#fff" },
                  },
                }}
              >
                <Box
                  className="fbox"
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: "rgba(22,163,74,0.09)",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  {f.icon}
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    color: "#111827",
                    fontFamily: W,
                    lineHeight: 1.3,
                  }}
                >
                  {f.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    color: "#6b7280",
                    lineHeight: 1.5,
                    fontFamily: W,
                  }}
                >
                  {f.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ══════════════════════════════════════════════
          §2  OUR OFFERINGS
      ══════════════════════════════════════════════ */}
      <Box
        component="section"
        sx={{ pt: "24px", pb: "24px", background: "#f8fafc" }}
      >
        <Box
          sx={{ maxWidth: 1240, mx: "auto", px: { xs: "18px", sm: "24px" } }}
        >
          <Box sx={{ textAlign: "center", mb: 2.5 }}>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.55rem", md: "2rem" },
                fontWeight: 800,
                color: "#0f172a",
                fontFamily: W,
                mb: 0.5,
              }}
            >
              Our Offerings
            </Typography>
            {/* <Typography
              sx={{ fontSize: "0.88rem", color: "#64748b", fontFamily: W }}
            >
              Everything you need for comprehensive UPSC preparation
            </Typography> */}
          </Box>

          {/* ─── NEW: EzeeExams / MagicMocks (2 cards) ─── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: { xs: 2, md: 2 },
              alignItems: "stretch",
            }}
          >
            {products.map((p, i) => (
              <Box
                key={i}
                sx={{
                  background: "#fff",
                  border: "2px solid #e5e7eb",
                  borderRadius: "18px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  transition: "all 0.22s ease",
                  "&:hover": {
                    borderColor: p.color,
                    transform: "translateY(-5px)",
                    boxShadow: `0 20px 48px ${p.color}22`,
                  },
                }}
              >
                {/* Tinted header */}
                <Box
                  sx={{
                    background: p.lightBg,
                    borderBottom: `1.5px solid ${p.borderCol}`,
                    p: "16px 20px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "14px",
                        background: "#fff",
                        border: `1.5px solid ${p.borderCol}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: `0 2px 10px ${p.color}18`,
                      }}
                    >
                      {p.icon}
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: "1.1rem",
                          color: p.color,
                          fontFamily: W,
                          lineHeight: 1.2,
                        }}
                      >
                        {p.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color: "#6b7280",
                          lineHeight: 1.5,
                          fontFamily: W,
                          mt: 0.2,
                        }}
                      >
                        {p.sub}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Body */}
                <Box
                  sx={{
                    p: "16px 20px 20px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#374151",
                      fontFamily: W,
                      lineHeight: 1.6,
                      mb: 1.6,
                    }}
                  >
                    {p.intro}
                  </Typography>

                  <Box sx={{ height: "1px", background: "#f1f5f9", mb: 1.5 }} />

                  {/* Numbered points (with optional sub-points) */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.2,
                      mb: 1.6,
                    }}
                  >
                    {p.points.map((pt, pi) => (
                      <Box key={pi}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                          }}
                        >
                          <NumBadge n={pi + 1} color={p.color} />
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
                              color: "#374151",
                              fontFamily: W,
                              lineHeight: 1.55,
                            }}
                          >
                            {pt.text}
                          </Typography>
                        </Box>

                        {/* Sub-points under this point */}
                        {"subs" in pt && pt.subs && (
                          <Box
                            sx={{
                              ml: 3.5,
                              mt: 0.8,
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.6,
                            }}
                          >
                            {pt.subs.map((s, si) => (
                              <Box
                                key={si}
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: p.color,
                                    flexShrink: 0,
                                    mt: "7px",
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: "0.76rem",
                                    color: s.bold ? "#111827" : "#4b5563",
                                    fontWeight: s.bold ? 700 : 400,
                                    fontFamily: W,
                                    lineHeight: 1.55,
                                  }}
                                >
                                  {s.text}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>

                 {/* Pushes the button to the bottom so both cards align */}
                  <Box sx={{ flex: 1 }} />

                {/* Highlight line (only EzeeExams has this) */}
                  {p.highlight && (
                    <Box
                      sx={{
                        mb: 1.6,
                        px: 1.2,
                        py: 0.8,
                        borderRadius: "8px",
                        background: `${p.color}0d`,
                        border: `1px dashed ${p.color}45`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          color: p.color,
                          fontFamily: W,
                          lineHeight: 1.45,
                        }}
                      >
                        {p.highlight}
                      </Typography>
                    </Box>
                  )}

                  <Button
                    component={Link}
                    href={p.href}
                    variant="outlined"
                    endIcon={
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    }
                    sx={{
                      borderColor: p.color,
                      color: p.color,
                      borderRadius: "10px",
                      fontWeight: 700,
                      textTransform: "none",
                      fontSize: "0.83rem",
                      py: 0.9,
                      fontFamily: W,
                      "&:hover": {
                        background: `${p.color}08`,
                        borderColor: p.color,
                      },
                    }}
                  >
                    {p.btn}
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          {/* ═══ OLD OFFERINGS — COMMENTED OUT ═══
          <Box
            sx={{
              mb: { xs: 2.5, md: 3 },
              borderRadius: "20px",
              overflow: "hidden",
              background: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)",
              border: "2px solid #0f766e",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 14,
                left: { xs: 20, md: 48 },
                px: 1.4,
                py: 0.5,
                borderRadius: "999px",
                background: "#e0f2f1",
                border: "1px solid #a7dcd7",
                zIndex: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  color: "#0f766e",
                  fontFamily: W,
                  letterSpacing: "0.03em",
                }}
              >
                Best Value · Season 2027
              </Typography>
            </Box>

            <Box
              sx={{
                p: {
                  xs: "38px 20px 22px",
                  md: "38px 48px 34px",
                },
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.3fr 1fr" },
                gap: { xs: 2.5, md: 4 },
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                    color: "#0f172a",
                    fontFamily: W,
                    mb: 0.6,
                  }}
                >
                  {featuredOffering.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#52749a",
                    fontFamily: W,
                    mb: 1.8,
                    lineHeight: 1.6,
                  }}
                >
                  {featuredOffering.intro}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {featuredOffering.feats.map((f, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    >
                      <Tick color="#0f766e" />

                      <Typography
                        sx={{
                          fontSize: "0.78rem",
                          color: "#173b62",
                          fontFamily: W,
                          lineHeight: 1.55,
                        }}
                      >
                        {f}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.6,
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    p: "18px 32px",
                    borderRadius: "16px",
                    background: "rgba(15,118,110,0.045)",
                    border: "1.5px solid #b8deda",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: "1.9rem",
                      color: "#0f766e",
                      fontFamily: W,
                      lineHeight: 1,
                    }}
                  >
                    {featuredOffering.price}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      color: "#52749a",
                      fontFamily: W,
                      mt: 0.5,
                    }}
                  >
                    {featuredOffering.priceUnit}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  endIcon={
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  }
                  sx={{
                    background: "#0f766e",
                    color: "#fff",
                    borderRadius: "10px",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "0.85rem",
                    py: 1,
                    fontFamily: W,
                    boxShadow: "0 8px 24px rgba(15,118,110,0.22)",
                    "&:hover": {
                      background: "#115e59",
                      boxShadow: "0 10px 30px rgba(15,118,110,0.28)",
                    },
                  }}
                >
                  {featuredOffering.btn}
                </Button>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: { xs: 2, md: 2 },
              alignItems: "stretch",
            }}
          >
            {offerings.map((o, i) => (
              <Box
                key={i}
                sx={{
                  background: "#fff",
                  border: "2px solid #e5e7eb",
                  borderRadius: "18px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  transition: "all 0.22s ease",
                  "&:hover": {
                    borderColor: o.color,
                    transform: "translateY(-5px)",
                    boxShadow: `0 20px 48px ${o.color}22`,
                  },
                }}
              >
                <Box
                  sx={{
                    background: o.lightBg,
                    borderBottom: `1.5px solid ${o.borderCol}`,
                    p: "16px 20px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "13px",
                        background: "#fff",
                        border: `1.5px solid ${o.borderCol}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: `0 2px 10px ${o.color}18`,
                      }}
                    >
                      {o.icon}
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: "1rem",
                          color: o.color,
                          fontFamily: W,
                          lineHeight: 1.2,
                        }}
                      >
                        {o.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.73rem",
                          color: "#6b7280",
                          lineHeight: 1.5,
                          fontFamily: W,
                          mt: 0.2,
                        }}
                      >
                        {o.sub}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: "16px 20px 20px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  {o.note && (
                    <Box
                      sx={{
                        mb: 1.2,
                        px: 1.2,
                        py: 0.6,
                        borderRadius: "8px",
                        background: `${o.color}0d`,
                        border: `1px dashed ${o.color}45`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          color: o.color,
                          fontFamily: W,
                          lineHeight: 1.4,
                        }}
                      >
                        {o.note}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", gap: 1.5, mb: 1.8 }}>
                    <Box
                      sx={{
                        flex: 1,
                        p: "8px 10px",
                        borderRadius: "11px",
                        background: `${o.color}0a`,
                        border: `1.5px solid ${o.color}25`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: "1.2rem",
                          color: o.color,
                          fontFamily: W,
                          lineHeight: 1,
                        }}
                      >
                        {o.price}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.65rem",
                          color: "#94a3b8",
                          fontFamily: W,
                          mt: 0.4,
                          textAlign: "center",
                          lineHeight: 1.4,
                        }}
                      >
                        {o.priceUnit}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ height: "1px", background: "#f1f5f9", mb: 1.5 }} />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.8,
                      flex: 1,
                      mb: 2,
                    }}
                  >
                    {o.feats.map((feat, fi) => (
                      <Box
                        key={fi}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Tick color={o.color} />
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            color: "#374151",
                            fontFamily: W,
                          }}
                        >
                          {feat}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant="outlined"
                    endIcon={
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    }
                    sx={{
                      borderColor: o.color,
                      color: o.color,
                      borderRadius: "10px",
                      fontWeight: 700,
                      textTransform: "none",
                      fontSize: "0.83rem",
                      py: 0.9,
                      fontFamily: W,
                      "&:hover": {
                        background: `${o.color}08`,
                        borderColor: o.color,
                      },
                    }}
                  >
                    {o.btn}
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
          ═══ END OLD OFFERINGS ═══ */}
        </Box>
      </Box>

      {/* ══════════════════════════════════════════════
          §3  HOW IT WORKS (below Our Offerings)
      ══════════════════════════════════════════════ */}
      <Box
        component="section"
        sx={{
          pt: "32px",
          pb: "36px",
          background: "#0f172a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Soft glow behind the steps */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(22,163,74,0.08) 0%,transparent 68%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            maxWidth: 1240,
            mx: "auto",
            px: { xs: "18px", sm: "24px" },
            position: "relative",
          }}
        >
          {/* ── EzeeExams flow ── */}
<Box sx={{ textAlign: "center", mb: { xs: 3, md: 3.5 } }}>
  <Typography
    component="h2"
    sx={{
      fontSize: { xs: "1.4rem", md: "1.8rem" },
      fontWeight: 800,
      color: "#fff",
      fontFamily: W,
    }}
  >
    How EzeeExams Works?
  </Typography>
  <Typography
    sx={{ fontSize: "0.82rem", color: "#94a3b8", fontFamily: W, mt: 0.6 }}
  >
    Your complete Prelims preparation in 6 simple steps
  </Typography>
</Box>

<StepsRow items={steps} cols={6} />

{/* Divider between the two flows */}
<Box
  sx={{
    height: "1px",
    background:
      "linear-gradient(90deg, transparent, rgba(148,163,184,0.25), transparent)",
    my: { xs: 4, md: 5 },
  }}
/>

  {/* ── MagicMains flow ── */}
  <Box sx={{ textAlign: "center", mb: { xs: 3, md: 3.5 } }}>
    <Typography
      component="h2"
      sx={{
        fontSize: { xs: "1.4rem", md: "1.8rem" },
        fontWeight: 800,
        color: "#fff",
        fontFamily: W,
      }}
    >
      How MagicMains Works?
    </Typography>
    <Typography
      sx={{ fontSize: "0.82rem", color: "#94a3b8", fontFamily: W, mt: 0.6 }}
    >
      Your Mains answer writing practice in 4 simple steps
    </Typography>
  </Box>

  <StepsRow items={mmSteps} cols={4} maxWidth={860} />


          {/* <Box sx={{ textAlign: "center", mt: { xs: 4, md: 4 } }}>
            <Button
              component={Link}
              href="#"
              variant="contained"
              endIcon={
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              }
              sx={{
                background: "linear-gradient(135deg,#16a34a,#15803d)",
                color: "#fff",
                px: 3.5,
                py: 1.1,
                borderRadius: "11px",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.88rem",
                fontFamily: W,
                boxShadow: "0 8px 28px rgba(22,163,74,0.4)",
                "&:hover": {
                  opacity: 0.9,
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 36px rgba(22,163,74,0.5)",
                },
                transition: "all 0.22s ease",
              }}
            >
              Start Your Journey Today
            </Button>
          </Box> */}
        </Box>
      </Box>

      {/* PYQ section */}

      <PyqSection />
    </>
  );
}