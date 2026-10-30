"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PyqSection from "@/app/components/landingpage/PyqSection";

/* ─────────────────────────── Tuning knobs ─────────────────────────── */

const GREEN = "#16a34a";
const GREEN_DARK = "#15803d";
const DARK_GREEN = "#14532d";
const GREEN_GRADIENT = `linear-gradient(165deg, ${DARK_GREEN} 0%, ${GREEN_DARK} 60%, ${GREEN} 100%)`;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const COLOR_T =
  "color 450ms ease, background 450ms ease, border-color 450ms ease";

// Font used in the "Why Aspirants Choose" section
const W = "var(--website-font)";

/* ───────────────────────────── Plan data ───────────────────────────── */

type Plan = {
  id: string;
  title: string;
  subtitle: string;
  stats?: string[]; // "10,000 facts | 60 mock tests" style row
  description?: string; // shown instead of stats when there are none
  features: string[];
  price: string;
  originalPrice?: string; // struck-through price
  offer?: string; // ribbon text, e.g. "Until Dec 31, 2026"
  href: string;
  headerIcon: ReactNode;
  headerIconShape: "square" | "circle";
  illustration: {
    main: ReactNode;
    badge: ReactNode;
    topLeft: ReactNode;
    topRight: ReactNode;
  };
};

const plans: Plan[] = [
  {
    id: "ezeeexams",
    title: "EzeeExams",
    subtitle: "Eases GS Prelims",
    stats: ["10,000 facts", "60 mock tests"],
    features: [
      "Detailed analysis & performance tracking",
      "Attempt online from any device",
      "Real UPSC pattern (+2 / -0.66)",
    ],
    price: "₹999",
    originalPrice: "₹9,999",
    offer: "Until Dec 31, 2026",
    href: "/register?plan=web",
    headerIcon: <LaptopMacRoundedIcon />,
    headerIconShape: "square",
    illustration: {
      main: <LaptopMacRoundedIcon />,
      badge: <BarChartRoundedIcon />,
      topLeft: <MenuBookRoundedIcon />,
      topRight: <GpsFixedRoundedIcon />,
    },
  },
  {
    id: "magicmocks",
    title: "MagicMains",
    subtitle: "Eases GS Mains",
    stats: ["Answer Script Evaluation", "1-to-1 Feedback"],
    features: [
      "14 years of GS Mains PYQs practice",
      "20 full-length GS Mains mock tests practice.",
    ],
    price: "₹9,999",
    href: "/register?plan=mains-mock",
    headerIcon: <GpsFixedRoundedIcon />,
    headerIconShape: "circle",
    illustration: {
      main: <DescriptionRoundedIcon />,
      badge: <PersonRoundedIcon />,
      topLeft: <EditNoteRoundedIcon />,
      topRight: <CheckCircleIcon />,
    },
  },
];

/* ══ DATA ══ */
const svgProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const features = [
  {
    title: "UPSC Pattern",
    desc: "All tests strictly follow UPSC exam pattern and difficulty level.",
    icon: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Unlimited Practice",
    desc: "Topic-wise & subject-wise questions with unlimited retakes.",
    icon: (
      <svg {...svgProps}>
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
      <svg {...svgProps}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: "Progress Tracking",
    desc: "Monitor your journey with detailed reports and trend analysis.",
    icon: (
      <svg {...svgProps}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Detailed Analytics",
    desc: "Track accuracy, speed, strengths and topic performance.",
    icon: (
      <svg {...svgProps}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <polyline points="2 20 22 20" />
      </svg>
    ),
  },
];

const subjects = [
  {
    label: "Environment",
    icon: (
      <svg {...svgProps}>
        <path d="M12 22V12" />
        <path d="M12 12C12 12 7 10 5 6c3 0 5.5 1.5 7 6z" />
        <path d="M12 12C12 12 17 10 19 6c-3 0-5.5 1.5-7 6z" />
        <path d="M5 22h14" />
      </svg>
    ),
  },
  {
    label: "Geography",
    icon: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    label: "Science & Tech",
    icon: (
      <svg {...svgProps}>
        <path d="M8 3v4l-2 1-2-1V3" />
        <path d="M6 8v13" />
        <path d="M14 3v4l2 1 2-1V3" />
        <path d="M18 8v13" />
        <path d="M6 21h12" />
      </svg>
    ),
  },
  {
    label: "Polity",
    icon: (
      <svg {...svgProps}>
        <line x1="12" y1="2" x2="12" y2="5" />
        <path d="M4 10H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2" />
        <rect x="6" y="5" width="12" height="5" rx="1" />
        <line x1="9" y1="15" x2="9" y2="18" />
        <line x1="12" y1="15" x2="12" y2="18" />
        <line x1="15" y1="15" x2="15" y2="18" />
      </svg>
    ),
  },
  {
    label: "Economics",
    icon: (
      <svg {...svgProps}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "History",
    icon: (
      <svg {...svgProps}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </svg>
    ),
  },
  {
    label: "Current Affairs",
    icon: (
      <svg {...svgProps}>
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8z" />
      </svg>
    ),
  },
];

/* ───────────────────────────── Illustration ───────────────────────────── */

// A static "scene" built from icons, so no image assets are needed
function Illustration({ data }: { data: Plan["illustration"] }) {
  const bubble = {
    position: "absolute" as const,
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#fff",
    color: GREEN,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(20,83,45,0.15)",
    "& svg": { fontSize: 18 },
  };

  return (
    <Box
      className="pp-illus"
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: { xs: 150, sm: 170 },
        transition: `transform 600ms ${EASE}`,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: "6% 4%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #d3f2de 0%, rgba(211,242,222,0) 70%)",
          transition: "opacity 450ms ease",
          ".pp-card:hover &": { opacity: 0.25 },
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          color: GREEN,
          transition: COLOR_T,
          ".pp-card:hover &": { color: "#bbf7d0" },
          "& svg": {
            fontSize: { xs: 84, sm: 96 },
            filter: "drop-shadow(0 14px 16px rgba(22,163,74,0.28))",
          },
        }}
      >
        {data.main}
      </Box>

      <Box aria-hidden sx={{ ...bubble, top: "6%", left: "8%" }}>
        {data.topLeft}
      </Box>
      <Box aria-hidden sx={{ ...bubble, top: "4%", right: "6%" }}>
        {data.topRight}
      </Box>

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          right: "4%",
          bottom: "8%",
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: `linear-gradient(145deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 24px rgba(20,83,45,0.35)",
          "& svg": { fontSize: 24 },
        }}
      >
        {data.badge}
      </Box>
    </Box>
  );
}

/* ───────────────────────────── Plan card ───────────────────────────── */

function PlanCard({ plan }: { plan: Plan }) {
  const isSquare = plan.headerIconShape === "square";

  return (
    <Card
      className="pp-card"
      sx={{
        position: "relative",
        overflow: "hidden",
        height: "100%",
        borderRadius: { xs: "22px", md: "28px" },
        border: "1px solid #d9eedf",
        background:
          "radial-gradient(circle at 0% 0%, #e6f7ec 0%, rgba(230,247,236,0) 48%), #fff",
        boxShadow: "0 10px 30px rgba(20,83,45,0.07)",
        transition: `transform 450ms ${EASE}, box-shadow 450ms ease, border-color 450ms ease`,

        // Highlight: card lifts and the green layer fades in
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 30px 60px rgba(20,83,45,0.35)",
          borderColor: GREEN,
        },
        "&:hover .pp-overlay": { opacity: 1 },
        "&:hover .pp-illus": { transform: "scale(1.05)" },

        // Text and elements switch to light colours on the green layer
        "&:hover .pp-title": { color: "#fff" },
        "&:hover .pp-sub": { color: "#bbf7d0" },
        "&:hover .pp-text": { color: "#fff" },
        "&:hover .pp-check": { color: "#bbf7d0" },
        "&:hover .pp-divider": { background: "rgba(255,255,255,0.4)" },
        "&:hover .pp-hicon": {
          background: "rgba(255,255,255,0.2)",
          color: "#fff",
          boxShadow: "none",
        },
        "&:hover .pp-pricebox": {
          background: "rgba(255,255,255,0.14)",
          borderColor: "rgba(253,230,138,0.7)",
        },
        "&:hover .pp-price": { color: "#fff" },
        "&:hover .pp-orig": { color: "rgba(255,255,255,0.8)" },
        "&:hover .pp-offer": { background: "#fde68a", color: "#78350f" },
        "&:hover .pp-btn": { background: "#d9f99d", color: DARK_GREEN },
        "&:hover .pp-btn:hover": { background: "#bef264" },
      }}
    >
      {/* Green layer that fades in on hover */}
      <Box
        aria-hidden
        className="pp-overlay"
        sx={{
          position: "absolute",
          inset: 0,
          background: GREEN_GRADIENT,
          opacity: 0,
          transition: "opacity 450ms ease",
          pointerEvents: "none",
        }}
      />

      <CardContent
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: { xs: 2.25, sm: 3 },
          "&:last-child": { pb: { xs: 2.25, sm: 3 } },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row", md: "column", lg: "row" },
            gap: { xs: 1, sm: 2 },
            flexGrow: 1,
          }}
        >
          {/* Left: header, stats, features */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Box
                className="pp-hicon"
                sx={{
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                  borderRadius: isSquare ? "18px" : "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isSquare
                    ? `linear-gradient(145deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`
                    : "#e3f5e9",
                  color: isSquare ? "#fff" : GREEN,
                  boxShadow: isSquare
                    ? "0 10px 20px rgba(22,163,74,0.3)"
                    : "none",
                  transition: COLOR_T,
                  "& svg": { fontSize: 30 },
                }}
              >
                {plan.headerIcon}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  className="pp-title"
                  fontWeight={800}
                  sx={{
                    fontSize: { xs: "1.4rem", sm: "1.6rem" },
                    lineHeight: 1.15,
                    color: "#0b1b2b",
                    transition: COLOR_T,
                  }}
                >
                  {plan.title}
                </Typography>
                <Typography
                  className="pp-sub"
                  fontWeight={700}
                  sx={{
                    color: GREEN,
                    fontSize: { xs: "0.95rem", sm: "1.05rem" },
                    transition: COLOR_T,
                  }}
                >
                  {plan.subtitle}
                </Typography>
              </Box>
            </Stack>

            {plan.stats ? (
              <Stack
                direction="row"
                alignItems="center"
                flexWrap="nowrap"
                columnGap={{ xs: 1.25, sm: 1.75 }}
                mb={2.25}
              >
                {plan.stats.map((s, i) => (
                  <Stack
                    key={s}
                    direction="row"
                    alignItems="center"
                    columnGap={{ xs: 1.25, sm: 1.75 }}
                  >
                    {i > 0 && (
                      <Box
                        className="pp-divider"
                        sx={{
                          width: "2px",
                          height: 24,
                          background: "#cfe3d5",
                          transition: COLOR_T,
                        }}
                      />
                    )}
                    <Typography
                      className="pp-text"
                      fontWeight={700}
                      sx={{
                        color: "#1f2937",
                        fontSize: { xs: "0.82rem", sm: "0.95rem" },
                        whiteSpace: "nowrap",
                        transition: COLOR_T,
                      }}
                    >
                      {s}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Typography
                className="pp-text"
                sx={{
                  color: "#4b5563",
                  fontSize: { xs: "0.92rem", sm: "1rem" },
                  lineHeight: 1.5,
                  mb: 2.25,
                  maxWidth: 260,
                  transition: COLOR_T,
                }}
              >
                {plan.description}
              </Typography>
            )}

            <Stack spacing={1.4}>
              {plan.features.map((f) => (
                <Stack
                  key={f}
                  direction="row"
                  spacing={1.25}
                  alignItems="center"
                  sx={{
                    transition: `transform 300ms ${EASE}`,
                    "&:hover": { transform: "translateX(6px)" },
                  }}
                >
                  <CheckCircleIcon
                    className="pp-check"
                    sx={{
                      color: GREEN,
                      fontSize: 21,
                      flexShrink: 0,
                      transition: COLOR_T,
                    }}
                  />
                  <Typography
                    className="pp-text"
                    sx={{
                      color: "#374151",
                      fontSize: { xs: "0.85rem", sm: "0.9rem" },
                      transition: COLOR_T,
                    }}
                  >
                    {f}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* Right: illustration */}
          <Box
            sx={{
              width: { xs: "100%", sm: 170, md: "100%", lg: 170 },
              flexShrink: 0,
              display: "flex",
              alignItems: "stretch",
            }}
          >
            <Illustration data={plan.illustration} />
          </Box>
        </Box>

        {/* Price + button */}
        <Box sx={{ mt: 2.5 }}>
          <Box
            className="pp-pricebox"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
              borderRadius: "18px",
              px: { xs: 2, sm: 3 },
              py: 1.2,
              mb: 1.75,
              minHeight: 80,
              background: "rgba(236,253,243,0.9)",
              border: "1px solid #dff3e5",
              transition: COLOR_T,
            }}
          >
            <Box>
              {plan.originalPrice && (
                <Typography
                  className="pp-orig"
                  fontWeight={700}
                  sx={{
                    display: "inline-block",
                    color: "#6b7280",
                    fontSize: { xs: "1.3rem", sm: "1.6rem" },
                    textDecoration: "line-through",
                    textDecorationColor: "#ef4444",
                    textDecorationThickness: "2px",
                    lineHeight: 1,
                    transition: COLOR_T,
                  }}
                >
                  {plan.originalPrice}
                </Typography>
              )}
              <Typography
                className="pp-price"
                fontWeight={800}
                sx={{
                  color: GREEN_DARK,
                  fontSize: { xs: "2.1rem", sm: "2.5rem" },
                  lineHeight: 1.1,
                  transition: COLOR_T,
                }}
              >
                {plan.price}
              </Typography>
            </Box>

            {plan.offer && (
              <Stack
                className="pp-offer"
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  background: DARK_GREEN,
                  color: "#fff",
                  px: 2,
                  py: 1,
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  transform: "rotate(-4deg)",
                  boxShadow: "0 8px 18px rgba(20,83,45,0.3)",
                  transition: COLOR_T,
                }}
              >
                <CalendarMonthRoundedIcon sx={{ fontSize: 20 }} />
                <span>{plan.offer}</span>
              </Stack>
            )}
          </Box>

          <Button
            className="pp-btn"
            component={Link}
            href={plan.href}
            fullWidth
            variant="contained"
            endIcon={
              <ArrowForwardRoundedIcon
                className="pp-arrow"
                sx={{ transition: `transform 300ms ${EASE}` }}
              />
            }
            sx={{
              background: `linear-gradient(90deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: "14px",
              py: 1.2,
              boxShadow: "none",
              transition: `${COLOR_T}, transform 300ms ${EASE}`,
              "&:hover": { boxShadow: "none", transform: "translateY(-2px)" },
              "&:hover .pp-arrow": { transform: "translateX(6px)" },
              "&:active": { transform: "translateY(0) scale(0.99)" },
            }}
          >
            Get Started
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

/* ───────────────────────────── Subjects bar ───────────────────────────── */

function SubjectsBar() {
  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "14px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)",
        border: "1px solid #f1f5f9",
        px: "14px",
        py: "12px",
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        overflow: "hidden",
      }}
    >
      {/* pinned label */}
      <Box
        sx={{
          flexShrink: 0,
          pr: "12px",
          mr: "12px",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.8rem",
            color: "#0f172a",
            lineHeight: 1.35,
            whiteSpace: "nowrap",
          }}
        >
          Practice Across
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.8rem",
            color: "#0f172a",
            lineHeight: 1.35,
            whiteSpace: "nowrap",
          }}
        >
          All UPSC Subjects
        </Typography>
      </Box>

      {/* scrollable subjects */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexWrap: "nowrap",
          alignItems: "center",
          justifyContent: { xs: "flex-start", lg: "space-around" },
          overflowX: "auto",
          gap: "2px",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {subjects.map((sub) => (
          <Box
            key={sub.label}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              cursor: "pointer",
              px: "10px",
              py: "5px",
              borderRadius: "8px",
              flexShrink: 0,
              transition: "all 0.2s ease",
              "&:hover": {
                background: "rgba(22,163,74,0.07)",
                "& .subject-icon": { color: "#16a34a" },
                "& .subject-label": { color: "#16a34a" },
              },
            }}
          >
            <Box
              className="subject-icon"
              sx={{
                color: "#60c083",
                transition: "color 0.2s ease",
                lineHeight: 0,
              }}
            >
              {sub.icon}
            </Box>
            <Typography
              className="subject-label"
              sx={{
                fontSize: "0.68rem",
                fontWeight: 600,
                color: "#64748b",
                whiteSpace: "nowrap",
                transition: "color 0.2s ease",
              }}
            >
              {sub.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* chevron hint (mobile only) */}
      <Box
        sx={{
          display: { xs: "flex", lg: "none" },
          flexShrink: 0,
          pl: "4px",
          color: "#94a3b8",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Box>
    </Box>
  );
}

/* ───────────────────────────── Page ───────────────────────────── */

export default function PricingPage() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background: "#f8fbf8",
        pt: { xs: 5, md: 7 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          maxWidth: { lg: 1240 },
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 3, md: 4 },
        }}
      >
        {/* Heading */}
        <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1.5}
            mb={1.5}
          >
            <Box
              sx={{
                width: { xs: 24, sm: 40 },
                height: "2px",
                background: GREEN,
              }}
            />
            <Typography
              fontWeight={700}
              sx={{
                color: GREEN_DARK,
                letterSpacing: 1.5,
                fontSize: { xs: "0.78rem", md: "0.95rem" },
              }}
            >
              CHOOSE YOUR PLAN
            </Typography>
            <Box
              sx={{
                width: { xs: 24, sm: 40 },
                height: "2px",
                background: GREEN,
              }}
            />
          </Stack>

          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              fontSize: { xs: "1.9rem", sm: "2.6rem", md: "3.2rem" },
              lineHeight: 1.15,
              color: "#0b1b2b",
            }}
          >
            Minimum Pricing. <br />
            <Box component="span" sx={{ color: GREEN }}>
              Maximum Preparation.
            </Box>
          </Typography>
        </Box>

        {/* Two equal cards: stacked below lg, 50/50 on desktop */}
        <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="stretch">
          {plans.map((plan) => (
            <Grid key={plan.id} size={{ xs: 12, lg: 6 }}>
              <PlanCard plan={plan} />
            </Grid>
          ))}
        </Grid>

        {/* Subjects bar: in normal flow, directly below the pricing cards */}
        <Box sx={{ mt: { xs: 3, md: 4 } }}>
          <SubjectsBar />
        </Box>
      </Container>

      {/* PYQ section (target of the floating PYQ button) */}
      <Box id="pyq-section" sx={{ scrollMarginTop: { xs: "80px", md: "96px" } }}>
        <PyqSection />
      </Box>

      {/* ── WHY CHOOSE ── */}
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
            {features.map((f) => (
              <Box
                key={f.title}
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
    </Box>
  );
}