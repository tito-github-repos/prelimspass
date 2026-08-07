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

const features = [
  {
    icon: (
      <Box
        component="img"
        src="/Icons/innovative-brain-icon.svg"
        alt="Brain Icon"
        sx={{
          width: 22,
          height: 22,
          filter:
            "invert(35%) sepia(12%) saturate(778%) hue-rotate(176deg) brightness(92%) contrast(86%)",
        }}
      />
    ),
    label: "Improve Mental Agility",
    sub: "Strengthen your brain with targeted exercises",
  },
  {
    icon: <TrackChangesOutlinedIcon />,
    label: "Sharpen Focus",
    sub: "Build better concentration and accuracy",
  },
  {
    icon: <LightbulbOutlinedIcon />,
    label: "Practice Smart",
    sub: "Daily practice worksheets to boost your skills",
  },
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
                    {/* Subject list */}
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Stack spacing={1}>
                        {/* CSAT */}
                        <Box
                          sx={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "14px",
                            bgcolor: "#fff",
                            px: { xs: 1.5, md: 1.5 },
                            py: { xs: 1.2, md: 1 },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            sx={{ flex: 1, minWidth: 0 }}
                          >
                            <Box
                              sx={{
                                width: { xs: 36, md: 42 },
                                height: { xs: 36, md: 42 },
                                borderRadius: "50%",
                                bgcolor: "#ecfdf3",
                                color: "#16a34a",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <QuizOutlinedIcon
                                sx={{ fontSize: { xs: 16, md: 20 } }}
                              />
                            </Box>
                            <Typography
                              fontWeight={500}
                              sx={{
                                fontSize: {
                                  xs: "0.82rem",
                                  sm: "0.92rem",
                                  md: "1rem",
                                },
                              }}
                            >
                              PRELIMS{" "}
                              <Box component="span" fontWeight={900}>
                                CSAT
                              </Box>{" "}
                              PAPER
                            </Typography>
                          </Stack>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              color: "#16a34a",
                              fontSize: { xs: "1rem", md: "1.3rem" },
                              flexShrink: 0,
                            }}
                          >
                            ₹1111
                          </Typography>
                        </Box>

                        {/* GS */}
                        <Box
                          sx={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "14px",
                            bgcolor: "#fff",
                            px: { xs: 1.5, md: 1.5 },
                            py: { xs: 1.2, md: 1 },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            sx={{ flex: 1, minWidth: 0 }}
                          >
                            <Box
                              sx={{
                                width: { xs: 36, md: 42 },
                                height: { xs: 36, md: 42 },
                                borderRadius: "50%",
                                bgcolor: "#ecfdf3",
                                color: "#16a34a",
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
                                  xs: "0.82rem",
                                  sm: "0.92rem",
                                  md: "1rem",
                                },
                              }}
                            >
                              PRELIMS{" "}
                              <Box component="span" fontWeight={900}>
                                GS
                              </Box>{" "}
                              PAPER
                            </Typography>
                          </Stack>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              color: "#16a34a",
                              fontSize: { xs: "1rem", md: "1.3rem" },
                              flexShrink: 0,
                            }}
                          >
                            ₹1111
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Session badge */}
                      <Box
                        sx={{
                          mt: 2,
                          borderRadius: "12px",
                          bgcolor: "#ecfdf3",
                          border: "1px solid #d1fae5",
                          p: { xs: 1.2, md: 1.8 },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <AccessTimeOutlinedIcon
                          sx={{
                            color: "#16a34a",
                            fontSize: { xs: 17, md: 20 },
                          }}
                        />
                        <Typography
                          fontWeight={700}
                          color="#16a34a"
                          sx={{ fontSize: { xs: "0.82rem", md: "1rem" } }}
                        >
                          One-time session — 1 Hour
                        </Typography>
                      </Box>

                      {/* CTA */}
                      <Button
                        fullWidth
                        size="large"
                        endIcon={<ArrowForwardRoundedIcon />}
                        sx={{
                          mt: 1.5,
                          py: { xs: 1.3, md: 1.6 },
                          borderRadius: "14px",
                          background: "#16a34a",
                          color: "#fff",
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          "&:hover": { background: "#15803d" },
                        }}
                      >
                        Book Consultation
                      </Button>
                    </Grid>

                    {/* How It Helps */}
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Box
                        sx={{
                          borderRadius: "18px",
                          background:
                            "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)",
                          border: "1px solid #dcfce7",
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
                              border: "1px solid #16a34a",
                              color: "#16a34a",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <TipsAndUpdatesOutlinedIcon
                              sx={{ fontSize: { xs: 20, md: 24 } }}
                            />
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight={800}
                            color="#166534"
                            sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                          >
                            How It Helps
                          </Typography>
                        </Stack>

                        <Stack spacing={1.8}>
                          {[
                            "Understand exam pattern & question trends",
                            "Improve speed, accuracy & time management",
                            "Personalized preparation roadmap",
                            "Focused strategy for weak areas",
                            "Expert mentorship & doubt clarification",
                          ].map((item) => (
                            <Stack
                              key={item}
                              direction="row"
                              spacing={1.5}
                              alignItems="flex-start"
                            >
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
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>

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
                  src="/Images/mains1.png"
                  alt="Mains Desktop Banner"
                  sx={{
                    width: "100%",
                    height: { md: 230 },
                    display: { xs: "none", md: "block" },
                  }}
                />

                {/* Mobile Image */}
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

                {/* ── CARD BODY ── */}
                <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                  <Grid container spacing={{ xs: 2, md: 3 }}>
                    {/* Subject list */}
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Stack spacing={0.75}>
                        {[
                          {
                            label: "MAINS COMPULSORY ENGLISH PAPER",
                            boldWords: ["COMPULSORY", "ENGLISH"],
                          },
                          {
                            label: "MAINS COMPULSORY TAMIL PAPER",
                            boldWords: ["COMPULSORY", "TAMIL"],
                          },
                          { label: "MAINS ESSAY PAPER", boldWords: ["ESSAY"] },
                          {
                            label: "MAINS ETHICS PAPER",
                            boldWords: ["ETHICS"],
                          },
                          { label: "MAINS GS-1 PAPER", boldWords: ["GS-1"] },
                          { label: "MAINS GS-2 PAPER", boldWords: ["GS-2"] },
                          { label: "MAINS GS-3 PAPER", boldWords: ["GS-3"] },
                          {
                            label:
                              "MAINS HOW TO CHOOSE OPTIONAL PAPER & FACULTY",
                            boldWords: [""],
                          },
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
                              ₹1111
                            </Typography>
                          </Box>
                        ))}
                      </Stack>

                      {/* Session badge */}
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

                      {/* CTA */}
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

                    {/* What You Get */}
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
                            "Ethics & essay framework building",
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
            </Grid>
          </Grid>
        </Container>

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

                {/* Mobile-only image — shown between description and features on small screens */}
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
                    // {/* Replace src with your actual image path e.g. /images/mental-calisthenics-book.png */}
                    src="/Images/mental.png"
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
                        gap: 1.5,
                        p: { xs: 1.5, md: 2 },
                        borderRadius: "14px",
                        border: "1px solid #e5e7eb",
                        bgcolor: "#fff",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                        },
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
                        <Typography
                          sx={{
                            fontSize: { xs: "0.78rem", md: "0.85rem" },
                            color: "#6b7280",
                            mt: 0.3,
                          }}
                        >
                          {f.sub}
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

              {/* ── RIGHT: book image — desktop only ── */}
              {/* Replace src with your actual image path e.g. /images/mental-calisthenics-book.png */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="img"
                  src="/Images/mental.png"
                  alt="Mental Calisthenics Practice Book"
                  sx={{
                    width: "100%",
                    maxWidth: 400,
                    height: "400px",
                    maxHeight: 460,
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
