"use client";
import { Box, Typography, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const W = "var(--website-font)";

/* ══ DATA ══ */
const ways = [
  {
    color: "#16a34a",
    lightBg: "#f0fdf4",
    borderCol: "#bbf7d0",
    Icon: MenuBookIcon,
    title: "Topic Wise",
    desc: "Practice questions from specific \n topics and sub-topics to \n strengthen your concepts.",
    sub: "Cover all important areas from \n Prelims & Mains syllabus",
    tags: [
      "Polity",
      "Economy",
      "Environment",
      "Geography",
      "History",
      "+ More",
    ],
    cta: "Explore Topics",
    href: "http://localhost:3000/login",
  },
  {
    color: "#2563eb",
    lightBg: "#eff6ff",
    borderCol: "#bfdbfe",
    Icon: FormatListBulletedRoundedIcon,
    title: "Answer Type Wise",
    desc: "Solve PYQs based on different \n answer types and improve \n accuracy & speed.",
    sub: "From factual to analytical, \n every type covered",
    tags: [
      "Single Word",
      "Match the Pairs",
      "Single Sentence",
      "A & R",
      "+ More",
    ],
    cta: "Explore Answer Types",
    href: "http://localhost:3000/login",
  },
  {
    color: "#7c3aed",
    lightBg: "#f5f3ff",
    borderCol: "#ddd6fe",
    Icon: BarChartRoundedIcon,
    title: "Difficulty Wise",
    desc: "Choose Easy, Medium or Hard \n and practice at your \n comfort level.",
    sub: "Build strong basics and \n move up steadily",
    tags: ["Easy", "Medium", "Hard"],
    cta: "Explore Difficulty Levels",
    href: "http://localhost:3000/login",
  },
];

export default function PyqSection() {
  const router = useRouter();

  return (
    <Box
      id="pyq-section"
      component="section"
      sx={{
        pt: "24px",
        pb: "24px",
        background: "linear-gradient(135deg,#f8fafc 0%,#eef2ff 100%)",
        scrollMarginTop: "80px",
      }}
    >
      <Box
        sx={{
          maxWidth: 1240,
          mx: "auto",
          px: { xs: "18px", sm: "24px" },
          p: { xs: "22px 18px", md: "30px" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 2.1fr" },
            gap: { xs: 3, md: 3 },
            alignItems: "center",
          }}
        >
          {/* ── Left: heading + copy ── */}
          <Box>
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                color: "#16a34a",
                fontFamily: W,
                mb: 1,
              }}
            >
              PREVIOUS YEAR QUESTIONS
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.5rem", md: "1.9rem" },
                fontWeight: 800,
                color: "#0f172a",
                fontFamily: W,
                lineHeight: 1.25,
                mb: 1.5,
              }}
            >
              Learn from the Past.
              <br />
              Ace the{" "}
              <Box component="span" sx={{ color: "#16a34a" }}>
                Future.
              </Box>
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 3,
                background: "#16a34a",
                borderRadius: 2,
                mb: 1.5,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.85rem",
                color: "#64748b",
                lineHeight: 1.7,
                fontFamily: W,
                mb: 2.5,
              }}
            >
              PYQs are your best companion to understand the UPSC exam inside
              out. Practice smart, focus on what matters, and stay ahead.
            </Typography>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                background: "linear-gradient(135deg,#16a34a,#15803d)",
                borderRadius: "12px",
                px: "14px",
                py: "10px",
                boxShadow: "0 8px 22px rgba(22,163,74,0.28)",
              }}
            >
              <VerifiedRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: W,
                  lineHeight: 1.3,
                }}
              >
                Completely FREE for all registered users
              </Typography>
            </Box>
          </Box>

          {/* ── Right: 3 way cards ── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: { xs: 4, sm: 2 },
              alignItems: "stretch",
            }}
          >
            {ways.map((w, i) => (
              <Box
                key={i}
                sx={{
                  position: "relative",
                  background: "#fff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "16px",
                  pt: "38px",
                  px: "16px",
                  pb: "18px",
                  mt: "34px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: w.color,
                    boxShadow: `0 10px 30px ${w.color}1f`,
                    transform: "translateY(-3px)",
                  },
                }}
              >
                {/* ringed circular icon */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "-34px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    background: w.lightBg,
                    border: `10px solid #ffffff`,
                    outline: `3px solid ${w.borderCol}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  }}
                >
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      background: w.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 6px 16px ${w.color}40`,
                    }}
                  >
                    <w.Icon sx={{ color: "#fff", fontSize: 24 }} />
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: w.color,
                    fontFamily: W,
                    my: 0.8,
                  }}
                >
                  {w.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.74rem",
                    color: "#4b5563",
                    lineHeight: 1.55,
                    fontFamily: W,
                    mb: 1.4,
                    whiteSpace: "pre-line",
                  }}
                >
                  {w.desc}
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: "1px",
                    background: "#f1f5f9",
                    mb: 1.4,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.74rem",
                    color: "#94a3b8",
                    fontFamily: W,
                    mb: 1.4,
                    whiteSpace: "pre-line",
                  }}
                >
                  {w.sub}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 0.6,
                    mb: 1.8,
                  }}
                >
                  {w.tags.map((t, ti) => (
                    <Chip
                      key={ti}
                      label={t}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.62rem",
                        fontWeight: 600,
                        fontFamily: W,
                        background: w.lightBg,
                        color: w.color,
                        border: `1px solid ${w.borderCol}`,
                        "& .MuiChip-label": { px: "8px" },
                      }}
                    />
                  ))}
                </Box>

                {/* ── NEW: CTA button ── */}
                <Box
                  component="button"
                  onClick={() => router.push(w.href)}
                  sx={{
                    mt: "auto",
                    width: "100%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    border: `1.5px solid ${w.borderCol}`,
                    background: w.lightBg,
                    color: w.color,
                    borderRadius: "10px",
                    px: "14px",
                    py: "9px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    fontFamily: W,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: w.color,
                      color: "#fff",
                      borderColor: w.color,
                      "& .arrow-icon": {
                        transform: "translateX(3px)",
                      },
                    },
                  }}
                >
                  {w.cta}
                  <ArrowForwardRoundedIcon
                    className="arrow-icon"
                    sx={{
                      fontSize: 16,
                      transition: "transform 0.2s ease",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}