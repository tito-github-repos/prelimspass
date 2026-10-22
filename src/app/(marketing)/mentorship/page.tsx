"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";

// const features = [
//   {
//     icon: <TrackChangesOutlinedIcon />,
//     label: "Lens Focus",
//     sub: "Build better concentration and accuracy",
//   },
//   {
//     icon: <LightbulbOutlinedIcon />,
//     label: "Practice Smart",
//     sub: "Daily practice worksheets to boost your skills",
//   },
//   {
//     icon: (
//       <Box
//         component="img"
//         src="/Icons/innovative-brain-icon.svg"
//         alt="Brain Icon"
//         sx={{
//           width: 22,
//           height: 22,
//           filter:
//             "invert(35%) sepia(12%) saturate(778%) hue-rotate(176deg) brightness(92%) contrast(86%)",
//         }}
//       />
//     ),
//     label: "Improve Mental Agility",
//     sub: "Strengthen your brain with targeted exercises",
//   },
// ];

const features = [
  {
    icon: <TrackChangesOutlinedIcon />,
    label: "Lens Focus",
  },
  {
    icon: <PsychologyOutlinedIcon />,
    label: "Elephant Memory",
  },
  {
    icon: <BoltOutlinedIcon />,
    label: "Razor Sharp",
  },
];

const agendaItems = [
  {
    title: "Strategies, Tactics & Techniques",
    sub: "For GS and CSAT.",
  },
  {
    title: "Customised Preparation Planner",
    sub: "Built around the aspirant's available time, strengths and weaknesses.",
  },
  {
    title: "Silver Streak Achievers only",
    sub: "A free benefit for PP users who reach Silver Streak status.",
  },
];

const howItHelps = [
  "Understand exam pattern & question trends",
  "Improve speed, accuracy & time management",
  "Personalized preparation roadmap",
  "Focused strategy for weak areas",
  "Expert mentorship & doubt clarification",
];

// DRAFT copy for Prelims: confirm with the client
const whatYouGet = [
  "Personalized strategy for GS and CSAT",
  "Customised preparation planner",
  "Review of your current preparation",
  "Tips to handle tricky questions & negative marking",
  "Doubt clarification & expert insights",
];

const streakTiers = [
  { code: "SS-25", reward: "CSAT Online Classes" },
  { code: "SS-50", reward: "Prelims One-to-One Consulting" },
  { code: "SS-100", reward: "Mains One-to-One Consulting" },
];

const streakSchedule = [
  { days: "Monday – Thursday", note: "CSAT classes for SS-25 achievers" },
  { days: "Friday – Sunday", note: "Sessions for SS-50 and SS-100 achievers" },
];

function BannerImage({
  src,
  alt,
  height = { xs: 160, sm: 200, md: 240 },
}: {
  src: string;
  alt: string;
  height?: object;
}) {
  return (
    <Box
      sx={{
        width: "100%",
        height,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          display: "block",
        }}
      />
      {/* subtle bottom gradient so header text stays readable */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.22) 100%)",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}

/* Shared card for "How It Helps" and "What You Get" */
function CheckListCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <Box
      sx={{
        borderRadius: "18px",
        background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)",
        border: "1px solid #dcfce7",
        p: { xs: 2, md: 3 },
        height: "100%",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
        <Box
          sx={{
            width: { xs: 40, md: 50 },
            height: { xs: 40, md: 50 },
            borderRadius: "12px",
            border: "1px solid #16a34a",
            color: "#16a34a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="h6"
          fontWeight={800}
          color="#166534"
          sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
        >
          {title}
        </Typography>
      </Stack>

      <Stack spacing={1.8}>
        {items.map((item) => (
          <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
            <CheckCircleRoundedIcon
              sx={{
                color: "#16a34a",
                mt: "2px",
                fontSize: { xs: 17, md: 20 },
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                color: "#374151",
                lineHeight: 1.65,
                fontSize: { xs: "0.83rem", md: "0.96rem" },
              }}
            >
              {item}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

export default function PricingPage() {
  return (
    <>
      <Box
        sx={{
          background: "#f8fbf8",
          minHeight: "100vh",
          pt: { xs: 7, md: 10 },
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* HERO */}
          <Box textAlign="center" mb={{ xs: 4, md: 8 }}>
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{
                fontSize: { xs: "1.55rem", sm: "2.2rem", md: "3.5rem" },
                lineHeight: 1.2,
                color: "#0b1b2b",
              }}
            >
              Indian Civil Services Exams 2027 –
              <br />
              <Box component="span" sx={{ color: "#16a34a" }}>
                Consulting Services
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 2,
                maxWidth: "760px",
                mx: "auto",
                color: "#5b6470",
                fontSize: { xs: "0.88rem", sm: "1rem", md: "1.1rem" },
                lineHeight: 1.8,
                px: { xs: 1, md: 0 },
              }}
            >
              Get personalised one-to-one guidance from experienced mentors.
              Choose the subject you want to focus on and book your session.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2.5, md: 4 }}>
            {/* ═══════════════ PRELIMS CARD ═══════════════ */}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  borderRadius: { xs: "16px", md: "28px" },
                  overflow: "hidden",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                }}
              >
                {/* ── BANNER IMAGE ── */}

                {/* Desktop Image */}
                <Box
                  component="img"
                  src="/Images/prelims1.png"
                  alt="Prelims Desktop Banner"
                  sx={{
                    width: "100%",
                    height: { md: 230 },
                    display: { xs: "none", md: "block" },
                  }}
                />

                {/* Mobile Image */}
                <Box
                  component="img"
                  src="/Images/prelims2.png"
                  alt="Prelims Mobile Banner"
                  sx={{
                    width: "100%",
                    height: { xs: 150, sm: 190 },
                    objectFit: "cover",
                    display: { xs: "block", md: "none" },
                  }}
                />

                {/* ── CARD HEADER ── */}
                <Box
                  sx={{
                    px: { xs: 2, md: 4 },
                    py: { xs: 2, md: 3 },
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: { xs: 1.5, md: 2 },
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 40, md: 58 },
                      height: { xs: 40, md: 58 },
                      borderRadius: "50%",
                      bgcolor: "#16a34a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MenuBookOutlinedIcon
                      sx={{ fontSize: { xs: 20, md: 30 }, color: "#fff" }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.3rem", md: "2rem" },
                        lineHeight: 1.2,
                        color: "#0b1b2b",
                      }}
                    >
                      One-to-One Consultation — Prelims
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.4,
                        fontSize: { xs: "0.78rem", md: "0.95rem" },
                        color: "#6b7280",
                      }}
                    >
                      Personalized guidance for UPSC Prelims preparation
                    </Typography>
                  </Box>
                </Box>

                {/* ── CARD BODY ── */}
                <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                  <Grid container spacing={{ xs: 2, md: 3 }}>
                    {/* ── CONSULTATION AGENDA ── */}
                    <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 1, md: 0 } }}>
                      <Box
                        sx={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "18px",
                          bgcolor: "#fff",
                          p: { xs: 2, md: 3 },
                          height: "100%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: "0.72rem", md: "0.8rem" },
                            fontWeight: 800,
                            letterSpacing: "0.14em",
                            color: "#15803d",
                            pb: 1.5,
                            borderBottom: "1px solid #f0f2f4",
                          }}
                        >
                          CONSULTATION AGENDA
                        </Typography>

                        {agendaItems.map((item, i, arr) => (
                          <Stack
                            key={item.title}
                            direction="row"
                            spacing={{ xs: 1.5, md: 2 }}
                            alignItems="center"
                            sx={{
                              py: { xs: 1.5, md: 1.8 },
                              borderBottom:
                                i < arr.length - 1
                                  ? "1px solid #f0f2f4"
                                  : "none",
                            }}
                          >
                            <Box
                              sx={{
                                width: { xs: 34, md: 40 },
                                height: { xs: 34, md: 40 },
                                borderRadius: "10px",
                                bgcolor: "#16a34a",
                                color: "#fff",
                                fontWeight: 800,
                                fontSize: { xs: "0.9rem", md: "1rem" },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {i + 1}
                            </Box>
                            <Box>
                              <Typography
                                fontWeight={700}
                                sx={{
                                  fontSize: { xs: "0.92rem", md: "1.1rem" },
                                  color: "#0b1b2b",
                                  lineHeight: 1.3,
                                }}
                              >
                                {item.title}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: { xs: "0.8rem", md: "0.95rem" },
                                  color: "#6b7280",
                                  lineHeight: 1.5,
                                }}
                              >
                                {item.sub}
                              </Typography>
                            </Box>
                          </Stack>
                        ))}
                      </Box>
                    </Grid>

                    {/* ── HOW IT HELPS ── */}
                    <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 2, md: 0 } }}>
                      <CheckListCard
                        title="How It Helps"
                        icon={
                          <TipsAndUpdatesOutlinedIcon
                            sx={{ fontSize: { xs: 20, md: 24 } }}
                          />
                        }
                        items={howItHelps}
                      />
                    </Grid>

                    {/* ── WHAT IS SILVER STREAK? ── */}
                    <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 4, md: 0 } }}>
                      <Box
                        sx={{
                          bgcolor: "#fff",
                          p: { xs: 2, md: 2 },
                        }}
                      >
                        <Typography
                          component="h3"
                          fontWeight={800}
                          sx={{
                            fontSize: { xs: "1.2rem", md: "1.7rem" },
                            color: "#0b1b2b",
                            lineHeight: 1.25,
                          }}
                        >
                          What is Silver Streak?
                        </Typography>
                        {/* TODO: confirm "SAMI App" with the client */}
                        <Typography
                          sx={{
                            mt: 0.8,
                            fontSize: { xs: "0.85rem", md: "1rem" },
                            color: "#6b7280",
                            lineHeight: 1.6,
                          }}
                        >
                          Silver Streak is for SAMI App users - PP Mobile App
                          users, who use the app daily for 25, 50 or 100 days.
                          Achiever get this additional benefits from PP.
                        </Typography>

                        {/* Tiers */}
                        <Box
                          sx={{
                            mt: { xs: 2, md: 3 },
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "1fr",
                              md: "repeat(3, 1fr)",
                            },
                            gap: { xs: 1.5, md: 2 },
                          }}
                        >
                          {streakTiers.map((t) => (
                            <Box
                              key={t.code}
                              sx={{
                                borderRadius: "16px",
                                bgcolor: "#f3f8f4",
                                p: { xs: 2, md: 2.5 },
                              }}
                            >
                              <Typography
                                fontWeight={800}
                                sx={{
                                  color: "#15803d",
                                  fontSize: { xs: "0.95rem", md: "1.1rem" },
                                }}
                              >
                                {t.code}
                              </Typography>
                              <Typography
                                fontWeight={600}
                                sx={{
                                  mt: 0.3,
                                  color: "#0b1b2b",
                                  fontSize: { xs: "0.9rem", md: "1.02rem" },
                                }}
                              >
                                {t.reward}
                              </Typography>
                              <Chip
                                label="FREE"
                                size="small"
                                sx={{
                                  mt: 1.5,
                                  bgcolor: "#16a34a",
                                  color: "#fff",
                                  fontWeight: 800,
                                  letterSpacing: "0.04em",
                                  height: 26,
                                }}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid>

                    {/* ── WHAT YOU GET ── */}
                    <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 3, md: 0 } }}>
                      <CheckListCard
                        title="What You Get"
                        icon={
                          <AutoAwesomeOutlinedIcon
                            sx={{ fontSize: { xs: 20, md: 24 } }}
                          />
                        }
                        items={whatYouGet}
                      />
                    </Grid>

                    {/* ── SILVER STREAK TIMING & DAYS (one row) ── */}
                    <Grid size={{ xs: 12 }} sx={{ order: { xs: 5, md: 0 } }}>
                        
                        <Box
                          sx={{
                                                        display: "grid",
                            gridTemplateColumns: {
                              xs: "1fr",
                              md: "1fr 1.6fr 1.6fr",
                            },
                            gap: { xs: 1.5, md: 2 },
                          }}
                        >
                          <Box
                            sx={{
                              borderRadius: "16px",
                              bgcolor: "#0a3d2e",
                              color: "#fff",
                              px: { xs: 2, md: 2.5 },
                              py: { xs: 1.8, md: 2 },
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: { xs: "0.75rem", md: "0.82rem" },
                                opacity: 0.9,
                              }}
                            >
                              SILVER STREAK SESSIONS
                            </Typography>
                            <Typography
                              fontWeight={800}
                              sx={{
                                fontSize: { xs: "1.5rem", md: "1.5rem" },
                                lineHeight: 1.2,
                              }}
                            >
                              5 AM – 6 AM
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.8rem", md: "0.88rem" },
                                opacity: 0.9,
                              }}
                            >
                              Daily
                            </Typography>
                          </Box>

                          {streakSchedule.map((s) => (
                            <Box
                              key={s.days}
                              sx={{
                                borderRadius: "16px",
                                border: "1px solid #e5e7eb",
                                bgcolor: "#fff",
                                px: { xs: 2, md: 2.5 },
                                py: { xs: 1.8, md: 2 },
                              }}
                            >
                              <Typography
                                fontWeight={700}
                                sx={{
                                  color: "#0b1b2b",
                                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                                }}
                              >
                                {s.days}
                              </Typography>
                              <Typography
                                sx={{
                                  mt: 0.3,
                                  color: "#6b7280",
                                  fontSize: { xs: "0.82rem", md: "0.92rem" },
                                }}
                              >
                                {s.note}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                    </Grid>

                    {/* ── SESSION + CTA BAR ── */}
                    <Grid size={{ xs: 12 }} sx={{ order: { xs: 6, md: 0 } }}>
                      <Box
                        sx={{
                          borderRadius: "18px",
                          bgcolor: "#ecfdf3",
                          border: "1px solid #d1fae5",
                          px: { xs: 2, md: 3 },
                          py: { xs: 2, md: 2.2 },
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "stretch", sm: "center" },
                          justifyContent: "space-between",
                          gap: { xs: 1.5, sm: 2 },
                        }}
                      >
                        <Box>
                          <Typography
                            fontWeight={700}
                            sx={{
                              color: "#166534",
                              fontSize: { xs: "1rem", md: "1.3rem" },
                              lineHeight: 1.3,
                            }}
                          >
                            One-time session — 1 Hour
                          </Typography>
                          <Typography
                            sx={{
                              color: "#6b7280",
                              fontSize: { xs: "0.8rem", md: "0.95rem" },
                            }}
                          >
                            Available to Silver Streak achievers
                          </Typography>
                        </Box>

                        {/* TODO: add link / onClick for booking */}
                        <Button
                          endIcon={<ArrowForwardRoundedIcon />}
                          sx={{
                            px: { xs: 3, md: 4 },
                            py: { xs: 1.3, md: 1.5 },
                            borderRadius: "12px",
                            background: "#16a34a",
                            color: "#fff",
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: { xs: "0.9rem", md: "1.05rem" },
                            whiteSpace: "nowrap",
                            "&:hover": { background: "#15803d" },
                          }}
                        >
                          Book Consultation
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>

            {/* ═══════════════ MAINS CARD (commented out for now) ═══════════════ */}
            {/* <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  borderRadius: { xs: "16px", md: "28px" },
                  overflow: "hidden",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Box
                  component="img"
                  src="/Images/mains1.png"
                  alt="Mains Desktop Banner"
                  sx={{
                    width: "100%",
                    height: { md: 230 },
                    display: { xs: "none", md: "block" },
                  }}
                />

                <Box
                  component="img"
                  src="/Images/mains2.png"
                  alt="Mains Mobile Banner"
                  sx={{
                    width: "100%",
                    height: { xs: 150, sm: 190 },
                    objectFit: "cover",
                    display: { xs: "block", md: "none" },
                  }}
                />

                <Box
                  sx={{
                    px: { xs: 2, md: 4 },
                    py: { xs: 2, md: 3 },
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: { xs: 1.5, md: 2 },
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 40, md: 70 },
                      height: { xs: 40, md: 70 },
                      borderRadius: "50%",
                      bgcolor: "#534AB7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <SchoolOutlinedIcon
                      sx={{ fontSize: { xs: 20, md: 40 }, color: "#fff" }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.3rem", md: "2rem" },
                        lineHeight: 1.2,
                        color: "#0b1b2b",
                      }}
                    >
                      One-to-One Consultation — Mains
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.4,
                        fontSize: { xs: "0.78rem", md: "0.95rem" },
                        color: "#6b7280",
                      }}
                    >
                      Personalized mentorship for UPSC Mains preparation
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                  <Grid container spacing={{ xs: 2, md: 3 }}>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Stack spacing={0.75}>
                        {[
                          {
                            label:
                              "MAINS HOW TO CHOOSE OPTIONAL PAPER & FACULTY",
                            boldWords: [""],
                          },
                          {
                            label: "MAINS COMPULSORY ENGLISH PAPER",
                            boldWords: ["COMPULSORY", "ENGLISH"],
                          },
                          {
                            label: "MAINS COMPULSORY TAMIL PAPER",
                            boldWords: ["COMPULSORY", "TAMIL"],
                          },
                          {
                            label: "MAINS ETHICS PAPER",
                            boldWords: ["ETHICS"],
                          },
                          { label: "MAINS ESSAY PAPER", boldWords: ["ESSAY"] },
                          { label: "MAINS GS-1 PAPER", boldWords: ["GS-1"] },
                          { label: "MAINS GS-2 PAPER", boldWords: ["GS-2"] },
                          { label: "MAINS GS-3 PAPER", boldWords: ["GS-3"] },
                        ].map(({ label, boldWords }) => (
                          <Box
                            key={label}
                            sx={{
                              border: "1px solid #e5e7eb",
                              borderRadius: "14px",
                              bgcolor: "#fff",
                              px: { xs: 1.5, md: 1.5 },
                              py: { xs: 1, md: 0.85 },
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 1,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={{ xs: 1.2, md: 1.5 }}
                              alignItems="center"
                              sx={{ flex: 1, minWidth: 0 }}
                            >
                              <Box
                                sx={{
                                  width: { xs: 34, md: 42 },
                                  height: { xs: 34, md: 42 },
                                  borderRadius: "50%",
                                  bgcolor: "#EEEDFE",
                                  color: "#534AB7",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <MenuBookOutlinedIcon
                                  sx={{ fontSize: { xs: 16, md: 20 } }}
                                />
                              </Box>

                              <Typography
                                fontWeight={500}
                                sx={{
                                  fontSize: {
                                    xs: "0.75rem",
                                    sm: "0.85rem",
                                    md: "0.95rem",
                                  },
                                  lineHeight: 1.4,
                                  wordBreak: "break-word",
                                }}
                              >
                                {label.split(" ").map((word, index) => (
                                  <Box
                                    key={index}
                                    component="span"
                                    sx={{
                                      fontWeight: boldWords.includes(word)
                                        ? 800
                                        : 500,
                                    }}
                                  >
                                    {word + " "}
                                  </Box>
                                ))}
                              </Typography>
                            </Stack>

                            <Typography
                              sx={{
                                fontWeight: 800,
                                color: "#534AB7",
                                fontSize: { xs: "0.9rem", md: "1.1rem" },
                                ml: { xs: 0.5, md: 1 },
                                flexShrink: 0,
                              }}
                            >
                              ₹999
                            </Typography>
                          </Box>
                        ))}
                      </Stack>

                      <Box
                        sx={{
                          mt: 2,
                          borderRadius: "12px",
                          bgcolor: "#EEEDFE",
                          border: "1px solid #d4d0f8",
                          p: { xs: 1.2, md: 1.8 },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <AccessTimeOutlinedIcon
                          sx={{
                            color: "#534AB7",
                            fontSize: { xs: 17, md: 20 },
                          }}
                        />
                        <Typography
                          fontWeight={700}
                          color="#534AB7"
                          sx={{ fontSize: { xs: "0.82rem", md: "1rem" } }}
                        >
                          One-time session — 1 Hour
                        </Typography>
                      </Box>

                      <Button
                        fullWidth
                        size="large"
                        endIcon={<ArrowForwardRoundedIcon />}
                        sx={{
                          mt: 1.5,
                          py: { xs: 1.3, md: 1.6 },
                          borderRadius: "14px",
                          background: "#534AB7",
                          color: "#fff",
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          "&:hover": { background: "#403d82" },
                        }}
                      >
                        Book Consultation
                      </Button>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                      <Box
                        sx={{
                          borderRadius: "18px",
                          background:
                            "linear-gradient(180deg, #EEEDFE 0%, #ffffff 100%)",
                          border: "1px solid #d4d0f8",
                          p: { xs: 2, md: 3 },
                          height: "100%",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          mb={2.5}
                        >
                          <Box
                            sx={{
                              width: { xs: 40, md: 50 },
                              height: { xs: 40, md: 50 },
                              borderRadius: "12px",
                              border: "1px solid #534AB7",
                              color: "#534AB7",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <AutoAwesomeOutlinedIcon
                              sx={{ fontSize: { xs: 20, md: 24 } }}
                            />
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight={800}
                            color="#534AB7"
                            sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                          >
                            What You Get
                          </Typography>
                        </Stack>

                        <Stack spacing={1.8}>
                          {[
                            "Personalized answer writing guidance",
                            "Paper-specific strategy & structure",
                            "Improve content presentation",
                            "Ethics & Essay framework building",
                            "Evaluation tips from mentors",
                            "Doubt clarification & expert insights",
                          ].map((item) => (
                            <Stack
                              key={item}
                              direction="row"
                              spacing={1.5}
                              alignItems="flex-start"
                            >
                              <CheckCircleRoundedIcon
                                sx={{
                                  color: "#534AB7",
                                  mt: "2px",
                                  fontSize: { xs: 17, md: 20 },
                                  flexShrink: 0,
                                }}
                              />
                              <Typography
                                sx={{
                                  color: "#374151",
                                  lineHeight: 1.65,
                                  fontSize: { xs: "0.83rem", md: "0.96rem" },
                                }}
                              >
                                {item}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid> */}
          </Grid>
        </Container>

        {/* ═══════════════ MENTAL CALISTHENICS ═══════════════ */}
        <Box
          sx={{
            mt: { xs: 5, md: 10 },
            border: "1px solid #dfeee3",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(244,250,246,0.95) 100%)",
            py: { xs: 4, md: 6 },
            overflow: "hidden",
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
            {/* 2-column grid: content left | image right */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 400px" },
                gap: { xs: 3, md: 6 },
                alignItems: "center",
              }}
            >
              {/* ── LEFT: all text content ── */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 2, md: 3 },
                }}
              >
                {/* Icon + Heading */}
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={{ xs: 1.5, md: 2 }}
                >
                  <Box
                    sx={{
                      width: { xs: 44, md: 70 },
                      height: { xs: 44, md: 70 },
                      borderRadius: "50%",
                      bgcolor: "#F1F5F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      component="img"
                      src="/Icons/innovative-brain-icon.svg"
                      alt="Brain Icon"
                      sx={{
                        width: { xs: 22, md: 40 },
                        height: { xs: 22, md: 40 },
                        filter:
                          "invert(35%) sepia(12%) saturate(778%) hue-rotate(176deg) brightness(92%) contrast(86%)",
                      }}
                    />
                  </Box>

                  <Typography
                    fontWeight={800}
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.3rem", md: "2rem" },
                      lineHeight: 1.2,
                      color: "#0b1b2b",
                    }}
                  >
                    Mental Calisthenics Practice Book
                  </Typography>
                </Stack>

                {/* Description */}
                <Typography
                  sx={{
                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                    color: "#6b7280",
                    lineHeight: 1.8,
                  }}
                >
                  Enhance your focus, think quickly, and become an efficient
                  problem solver with our specially curated exercises.
                </Typography>

                {/* Mobile-only image */}
                <Box
                  sx={{
                    display: { xs: "block", md: "none" },
                    borderRadius: "16px",
                    overflow: "hidden",
                    width: "100%",
                    maxHeight: 200,
                  }}
                >
                  <Box
                    component="img"
                    src="/Images/Mental_1.png"
                    alt="Mental Calisthenics Practice Book"
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                </Box>

                {/* Feature cards */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      md: "1fr 1fr 1fr",
                    },
                    gap: { xs: 1.5, md: 2 },
                  }}
                >
                  {features.map((f) => (
                    <Box
                      key={f.label}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 38, md: 42 },
                          height: { xs: 38, md: 42 },
                          borderRadius: "50%",
                          bgcolor: "#F1F5F9",
                          color: "#475569",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {f.icon}
                      </Box>

                      <Box>
                        <Typography
                          fontWeight={700}
                          sx={{ fontSize: { xs: "0.85rem", md: "0.95rem" } }}
                        >
                          {f.label}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* CTA Button */}
                <Box>
                  <Button
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                      px: { xs: 3, md: 4 },
                      py: { xs: 1.3, md: 1.6 },
                      borderRadius: "12px",
                      background: "#475569",
                      color: "#fff",
                      fontWeight: 700,
                      textTransform: "none",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      width: { xs: "100%", sm: "auto" },
                      "&:hover": { background: "#334155" },
                    }}
                  >
                    Explore Mental Calisthenics
                  </Button>
                </Box>
              </Box>

              {/* ── RIGHT: book image, desktop only ── */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="img"
                  src="/Images/Mental_1.png"
                  alt="Mental Calisthenics Practice Book"
                  sx={{
                    width: "100%",
                    maxWidth: 400,
                    height: "400px",
                    maxHeight: 360,
                    objectFit: "cover",
                    borderRadius: "20px",
                    display: "block",
                  }}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}