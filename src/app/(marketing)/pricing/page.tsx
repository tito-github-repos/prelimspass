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

import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import AllInclusiveRoundedIcon from "@mui/icons-material/AllInclusiveRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StarIcon from "@mui/icons-material/Star";

const prelimsSchedule = [
  { day: "MON", subject: "Environment Questions", count: "100" },
  { day: "TUE", subject: "Geography Questions", count: "100" },
  { day: "WED", subject: "Sci & Tech Questions", count: "100" },
  { day: "THU", subject: "Polity Questions", count: "100" },
  { day: "FRI", subject: "Economics Questions", count: "100" },
  { day: "SAT", subject: "History Questions", count: "100" },
  { day: "SUN", subject: "CA Questions", count: "100" },
];

const mainsSchedule = [
  { day: "SAT", subject: "Essay and Ethics Practice" },
  { day: "SUN", subject: "Any Two GS Papers Practice" },
];

// Shared text sizes so every card stays consistent
const CARD_TITLE_SX = { fontSize: { xs: "1.35rem", md: "1.7rem" } };
const CARD_DESC_SX = { fontSize: { xs: "0.82rem", md: "0.9rem" } };
const LIST_TEXT_SX = { fontSize: { xs: "0.82rem", md: "0.9rem" } };
const PRICE_SX = { fontSize: { xs: "1.7rem", md: "2rem" } };
const PRICE_NOTE_SX = { fontSize: { xs: "0.82rem", md: "0.9rem" } };

export default function PricingPage() {
  return (
    <>
      <Box
        sx={{
          background: "#f8fbf8",
          minHeight: "100vh",
          pt: { xs: 5, md: 7 },
        }}
      >
        {/* ── Container ── */}
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box textAlign="center" mb={{ xs: 4, md: 5 }}>
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                lineHeight: 1.2,
                color: "#0b1b2b",
              }}
            >
              Simple Pricing.
              <br />
              <Box component="span">
                <Box component="span" sx={{ color: "#16a34a" }}>
                  Maximum
                </Box>{" "}
                Preparation.
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 2,
                maxWidth: "680px",
                mx: "auto",
                color: "#5b6470",
                fontSize: { xs: "0.88rem", md: "0.98rem" },
                lineHeight: 1.7,
                px: { xs: 1, md: 0 },
              }}
            >
              Choose a plan that fits your UPSC journey. Practice more, analyze
              better, and improve every day with PrelimsPass.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 3 }}>
            {/* ── FREE PLAN ── */}
            <Grid size={{ xs: 12, lg: 4 }} sx={{ mt: { lg: 4 } }}>
              <Card
                sx={{
                  borderRadius: { xs: "20px", md: "26px" },
                  height: "100%",
                  border: "2px solid #CBD5E1",
                  background: "#fff",
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 2.5, md: 3.5 },
                    mt: { xs: 1, md: 2 },
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box>
                    <Chip
                      label="FREE TRIAL"
                      sx={{
                        background: "#475569",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        borderRadius: "10px",
                        px: 1,
                      }}
                    />

                    <Typography
                      variant="h4"
                      fontWeight={800}
                      mt={2.5}
                      mb={1}
                      sx={{ ...CARD_TITLE_SX, color: "#111827" }}
                    >
                      Free Plan
                    </Typography>

                    <Typography color="#6B7280" mb={2.5} sx={CARD_DESC_SX}>
                      Free Access
                    </Typography>

                    <Box sx={{ borderBottom: "2px dotted #D1D5DB", mb: 2.5 }} />

                    <Stack spacing={1.75} textAlign="left">
                      {[
                        "Prelims PYQ Access and Practice",
                        "FREE for all registered users",
                        "Basic Dashboard Access",
                        "No Payment Required",
                        "Login / Register Required",
                      ].map((item) => (
                        <Stack
                          key={item}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <CheckCircleOutlinedIcon
                            sx={{
                              color: "#475569",
                              fontSize: 18,
                              flexShrink: 0,
                            }}
                          />
                          <Typography sx={{ ...LIST_TEXT_SX, color: "#374151" }}>
                            {item}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>

                  {/* Gift Section — grows to fill free space */}
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      px: 2,
                      py: { xs: 3, md: 2 },
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "18px",
                        background: "#F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        component="img"
                        src="/Icons/present-icon.svg"
                        alt="Gift Icon"
                        sx={{
                          width: 32,
                          height: 32,
                          filter:
                            "invert(35%) sepia(12%) saturate(778%) hue-rotate(176deg) brightness(92%) contrast(86%)",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "#111827",
                        mb: 0.5,
                      }}
                    >
                      Experience PrelimsPass
                    </Typography>

                    {/* <Typography sx={{ fontSize: "13px", color: "#6B7280" }}>
                      No risk, no cost
                    </Typography> */}
                  </Box>

                  <Button
                    fullWidth
                    component={Link}
                    href="/register?plan=free-trial"
                    variant="contained"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                      mt: { xs: 1, md: 2 },
                      py: { xs: 1.2, md: 1.5 },
                      borderRadius: "14px",
                      background: "#475569",
                      fontWeight: 700,
                      textTransform: "none",
                      fontSize: { xs: "0.9rem", md: "0.95rem" },
                      boxShadow: "none",
                      "&:hover": {
                        background: "#334155",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* ── MAINS PLAN ── */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Card
                sx={{
                  borderRadius: { xs: "20px", md: "26px" },
                  height: "100%",
                  border: "2px solid #534AB7",
                  position: "relative",
                  overflow: "visible",
                  pt: 3,
                }}
              >
                <Chip
                  label="BEST VALUE · SEASON 2027"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#534AB7",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    px: 1,
                    borderRadius: "0 0 14px 14px",
                    whiteSpace: "nowrap",
                  }}
                />

                <CardContent
                  sx={{
                    p: { xs: 2.5, md: 3.5 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "16px",
                      background: "#EEEDFE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src="/Icons/writing-icon.svg"
                      alt="Mains cum Prelims Icon"
                      sx={{
                        width: 30,
                        height: 30,
                        filter:
                          "invert(32%) sepia(78%) saturate(748%) hue-rotate(232deg) brightness(91%) contrast(92%)",
                      }}
                    />
                  </Box>

                  <Box textAlign="center" mb={2.5}>
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      mb={1.5}
                      sx={CARD_TITLE_SX}
                    >
                      {/* Mains Plan */}
                      Mains cum Prelims
                    </Typography>
                    <Typography color="text.secondary" sx={CARD_DESC_SX}>
                      {/* Weekly 4 Tests - Mains */}
                      Full Mains answer-writing practice — inclusive of Prelims
                      Practice access
                    </Typography>
                  </Box>

                  <Stack spacing={1.75} mb={3}>
                    {[
                      // "Essay and Ethics paper practice",
                      // "GS paper practice",
                      // "Answer writing evaluation",
                      // "Feedback within 24 hours",
                      // "Email-based test submission",
                      // "Performance review",
                      // "Mains Practice with Prelims Mobile App, Prelims PYQ & Prelims Mock Test — all free, included",
                      "Feedback within 24 hours",
                      "Each answer paper is evaluated, analyzed & discussed one-to-one",
                      "Before 31 Dec 2026: 12 tests per paper — conducted, evaluated & discussed with every enrolled student",
                      "After the Prelims exam: 8 tests per paper — conducted, evaluated & discussed with every enrolled student",
                    ].map((item) => (
                      <Stack
                        key={item}
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <CheckCircleOutlinedIcon
                          sx={{
                            color: "#534AB7",
                            fontSize: 18,
                            flexShrink: 0,
                            mt: "2px",
                          }}
                        />
                        <Typography sx={LIST_TEXT_SX}>{item}</Typography>
                      </Stack>
                    ))}
                  </Stack>

                  {/* 
                   <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={2}
                    sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                  >
                    Weekly Schedule
                  </Typography>

                  <Stack spacing={1}>
                    {mainsSchedule.map((item) => (
                      <Box
                        key={item.day}
                        sx={{ display: "flex", alignItems: "center", py: 0.5 }}
                      >
                        <Box
                          sx={{
                            width: { xs: 46, md: 56 },
                            height: 34,
                            borderRadius: "8px",
                            background: "#EEEDFE",
                            color: "#534AB7",
                            fontWeight: 700,
                            fontSize: "13px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {item.day}
                        </Box>
                        <Typography
                          sx={{
                            ml: { xs: 1.5, md: 2 },
                            fontSize: { xs: "13px", md: "15px" },
                            color: "#374151",
                            fontWeight: 500,
                          }}
                        >
                          {item.subject}
                        </Typography>
                      </Box>
                    ))}
                  </Stack> */}

                  {/* <Typography
                    variant="h6"
                    fontWeight={700}
                    mt={4}
                    mb={2}
                    sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                  >
                    How It Works
                  </Typography> */}

                  {/* <Stack spacing={2}>
                    {[
                      "Test papers sent to your registered email",
                      "Submit answer sheets to prelimspass@gmail.com",
                      "Answer sheets evaluated within 24 hours",
                    ].map((item) => (
                      <Stack
                        key={item}
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <CheckCircleOutlinedIcon
                          sx={{
                            color: "#534AB7",
                            fontSize: 20,
                            flexShrink: 0,
                            mt: "2px",
                          }}
                        />
                        <Typography
                          sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                        >
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack> */}

                  {/* PRICING */}
                  {/* <Grid container spacing={{ xs: 2, md: 2 }} mt={4}>
                    <Grid size={6}>
                      <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{ fontSize: { xs: "1.4rem", md: "2.125rem" } }}
                      >
                        ₹1,111
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}
                      >
                        Per Month
                      </Typography>
                      <Button
                        component={Link}
                        href="/register?plan=mains-monthly"
                        fullWidth
                        variant="outlined"
                        sx={{
                          mt: 2,
                          py: { xs: 1.2, md: 1.5 },
                          borderRadius: "14px",
                          borderColor: "#534AB7",
                          color: "#534AB7",
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: { xs: "0.85rem", md: "1rem" },
                        }}
                      >
                        Monthly
                      </Button>
                    </Grid>

                    <Grid size={6}>
                      <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{ fontSize: { xs: "1.4rem", md: "2.125rem" } }}
                      >
                        ₹11,111
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}
                      >
                        Per Year
                      </Typography>
                      <Button
                        component={Link}
                        href="/register?plan=mains-yearly"
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 2,
                          py: { xs: 1.2, md: 1.5 },
                          borderRadius: "14px",
                          background: "#534AB7",
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: { xs: "0.85rem", md: "1rem" },
                          "&:hover": {
                            background: "#403d82",
                          },
                        }}
                      >
                        Yearly
                      </Button>
                    </Grid>
                  </Grid> */}

                  {/* PRICING — pinned to the bottom of the card */}
                  <Box textAlign="center" sx={{ mt: "auto" }}>
                    <Typography variant="h3" fontWeight={800} sx={PRICE_SX}>
                      ₹11,111
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ ...PRICE_NOTE_SX, mb: 2 }}
                    >
                      Valid for the 2027 season
                    </Typography>

                    <Button
                      component={Link}
                      href="/register?plan=mains-cum-prelims"
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        py: { xs: 1.2, md: 1.5 },
                        borderRadius: "14px",
                        background: "#534AB7",
                        fontWeight: 700,
                        textTransform: "none",
                        boxShadow: "none",
                        fontSize: { xs: "0.9rem", md: "0.95rem" },
                        "&:hover": {
                          background: "#403d82",
                          boxShadow: "none",
                        },
                      }}
                    >
                      Enroll in Mains cum Prelims
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* ── PRELIMS PLAN ── */}
            <Grid size={{ xs: 12, lg: 4 }} sx={{ mt: { lg: 4 } }}>
              <Card
                sx={{
                  borderRadius: { xs: "20px", md: "26px" },
                  height: "100%",
                  border: "2px solid #16a34a",
                  position: "relative",
                  overflow: "visible",
                  pt: 3,
                }}
              >
                {/* <Chip
                  icon={
                    <StarIcon
                      sx={{ color: "white !important", fontSize: "18px" }}
                    />
                  }
                  label="MOST POPULAR"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#16a34a",
                    color: "white",
                    fontWeight: 700,
                    px: 1,
                    borderRadius: "0 0 14px 14px",
                    whiteSpace: "nowrap",
                  }}
                /> */}

                <CardContent
                  sx={{
                    p: { xs: 2.5, md: 3.5 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "16px",
                      background: "#ecfdf3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src="/Icons/task-checkmark-icon.svg"
                      alt="Prelims Icon"
                      sx={{
                        width: 30,
                        height: 30,
                        filter:
                          "invert(46%) sepia(85%) saturate(533%) hue-rotate(93deg) brightness(94%) contrast(92%)",
                      }}
                    />
                  </Box>

                  <Box textAlign="center" mb={2.5}>
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      mb={1.5}
                      sx={CARD_TITLE_SX}
                    >
                      Prelims Plan
                    </Typography>
                    <Typography color="text.secondary" sx={CARD_DESC_SX}>
                      Daily Test Practice questions — subject wise and topic
                      wise
                    </Typography>
                  </Box>

                  <Stack spacing={1.75} mb={3}>
                    {[
                      "Prelims PYQ Access and Practice",
                      "100 mock tests start from 3 Feb 2027",
                      "Unlimited retakes",
                      "Detailed analytics",
                      "Real UPSC pattern (+2 / -0.66)",
                      "Performance tracking",
                      // "Prelims Mobile App included free",
                    ].map((item) => (
                      <Stack
                        key={item}
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <CheckCircleOutlinedIcon
                          sx={{
                            color: "#16a34a",
                            fontSize: 18,
                            flexShrink: 0,
                            mt: "2px",
                          }}
                        />
                        <Typography sx={LIST_TEXT_SX}>{item}</Typography>
                      </Stack>
                    ))}
                  </Stack>

                  {/* 
                   <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={1.5}
                    sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                  >
                    Daily Schedule
                  </Typography>

                  <Stack spacing={0}>
                    {prelimsSchedule.map((item) => (
                      <Box
                        key={item.day}
                        sx={{ display: "flex", alignItems: "center", py: 0.5 }}
                      >
                        <Box
                          sx={{
                            width: { xs: 46, md: 56 },
                            height: 34,
                            borderRadius: "8px",
                            background: "#ebf6ee",
                            color: "#16a34a",
                            fontWeight: 700,
                            fontSize: "13px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {item.day}
                        </Box>

                        <Typography
                          sx={{
                            width: { xs: 34, md: 42 },
                            ml: { xs: 1, md: 2 },
                            fontSize: { xs: "13px", md: "15px" },
                            fontWeight: 700,
                            color: "#111827",
                            flexShrink: 0,
                          }}
                        >
                          {item.count}
                        </Typography>

                        <Typography
                          sx={{
                            ml: { xs: 1, md: 2 },
                            fontSize: { xs: "13px", md: "15px" },
                            color: "#374151",
                            fontWeight: 500,
                          }}
                        >
                          {item.subject}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Grid container spacing={{ xs: 2, md: 3 }} mt={4}>
                    <Grid size={6}>
                      <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{ fontSize: { xs: "1.4rem", md: "2.125rem" } }}
                      >
                        ₹1,111
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}
                      >
                        Per Month
                      </Typography>
                      <Button
                        component={Link}
                        href="/register?plan=prelims-monthly"
                        fullWidth
                        variant="outlined"
                        sx={{
                          mt: 2,
                          py: { xs: 1.2, md: 1.5 },
                          borderRadius: "14px",
                          borderColor: "#16a34a",
                          color: "#16a34a",
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: { xs: "0.85rem", md: "1rem" },
                        }}
                      >
                        Monthly
                      </Button>
                    </Grid>

                    <Grid size={6}>
                      <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{ fontSize: { xs: "1.4rem", md: "2.125rem" } }}
                      >
                        ₹11,111
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}
                      >
                        Per Year
                      </Typography>
                      <Button
                        component={Link}
                        href="/register?plan=prelims-yearly"
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 2,
                          py: { xs: 1.2, md: 1.5 },
                          borderRadius: "14px",
                          background: "#16a34a",
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: { xs: "0.85rem", md: "1rem" },
                          "&:hover": {
                            background: "#15803d",
                          },
                        }}
                      >
                        Yearly
                      </Button>
                    </Grid>
                  </Grid>
                   */}

                  {/* OLD PRICE + REGISTER BUTTON (Prelims Plan is now free) — kept for reference
                  <Box textAlign="center" sx={{ mt: "auto" }}>
                    <Typography variant="h3" fontWeight={800} sx={PRICE_SX}>
                      ₹1,111
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ ...PRICE_NOTE_SX, mb: 0.5 }}
                    >
                      Valid for the 2027 season
                      // Per Month
                    </Typography>
                    <Typography
                      sx={{ fontSize: "12px", color: "#6B7280", mb: 2 }}
                    >
                      Free with a Mains cum Prelims enrolment
                    </Typography>

                    <Button
                      component={Link}
                      href="/register?plan=prelims-monthly"
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        py: { xs: 1.2, md: 1.5 },
                        borderRadius: "14px",
                        background: "#16a34a",
                        fontWeight: 700,
                        textTransform: "none",
                        boxShadow: "none",
                        fontSize: { xs: "0.9rem", md: "0.95rem" },
                        "&:hover": {
                          background: "#15803d",
                          boxShadow: "none",
                        },
                      }}
                    >
                      Register for Prelims Plan
                    </Button>
                  </Box>
                  */}

                  {/* FREE ACCESS — pinned to the bottom of the card */}
                  <Box sx={{ mt: "auto" }}>
                    <Box textAlign="center" mb={2}>
                      <Typography
                        variant="h3"
                        fontWeight={800}
                        sx={{ ...PRICE_SX, color: "#16a34a" }}
                      >
                        FREE
                      </Typography>
                      <Typography color="text.secondary" sx={PRICE_NOTE_SX}>
                        No payment required
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        background: "#f0fdf4",
                        border: "1px dashed #86efac",
                        borderRadius: "14px",
                        p: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "0.82rem", md: "0.88rem" },
                          color: "#166534",
                          mb: 1.25,
                        }}
                      >
                        Free for:
                      </Typography>

                      <Stack spacing={1}>
                        {[
                          "Mains cum Prelims plan students",
                          "Silver & Gold badge users of the Prelims Mobile App",
                          
                        ].map((item) => (
                          <Stack
                            key={item}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <CheckCircleOutlinedIcon
                              sx={{
                                color: "#16a34a",
                                fontSize: 18,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: { xs: "0.82rem", md: "0.88rem" },
                                color: "#166534",
                                fontWeight: 600,
                              }}
                            >
                              {item}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* ── WHY CHOOSE ── */}
        <Box
          sx={{
            mt: { xs: 5, md: 6 },
            borderRadius: { xs: "32px 32px 0 0", md: "56px 56px 0 0" },
            border: "1px solid #dfeee3",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(244,250,246,0.95) 100%)",
            py: { xs: 3, md: 4 },
            boxShadow: "0 10px 40px rgba(22,163,74,0.05)",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            textAlign="center"
            sx={{
              color: "#111827",
              fontSize: { xs: "1.25rem", md: "1.6rem" },
            }}
          >
            Why Choose{" "}
            <Box component="span" sx={{ color: "#16a34a" }}>
              PrelimsPass
            </Box>
            ?
          </Typography>

          <Grid container sx={{ mt: { xs: 1, md: 0 } }}>
            {[
              {
                icon: <SecurityRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />,
                title: "Real",
                subtitle: "UPSC Standard",
              },
              {
                icon: <AllInclusiveRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />,
                title: "Unlimited",
                subtitle: "Practice",
              },
              {
                icon: <BarChartRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />,
                title: "Data-Driven",
                subtitle: "Analytics",
              },
              {
                icon: <AutorenewRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />,
                title: "24hr",
                subtitle: "Evaluation",
              },
              {
                icon: <CurrencyRupeeRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />,
                title: "Affordable",
                subtitle: "Pricing",
              },
              {
                icon: <Groups2RoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />,
                title: "Trusted by",
                subtitle: "Aspirants",
              },
            ].map((item, index) => (
              <Grid
                key={index}
                size={{ xs: 4, md: 2 }}
                sx={{
                  position: "relative",
                  textAlign: "center",
                  py: { xs: 2, md: 1.5 },
                  // Bottom border separating the two rows on mobile (3-col layout)
                  borderBottom: {
                    xs: index < 3 ? "1px solid #e5e7eb" : "none",
                    md: "none",
                  },
                }}
              >
                {/* Vertical divider */}
                {index !== 5 && (
                  <Box
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "1px",
                      height: "50px",
                      background: "#e5e7eb",
                      // On xs (3 cols): hide after every 3rd item
                      display: {
                        xs: (index + 1) % 3 === 0 ? "none" : "block",
                        md: "block",
                      },
                    }}
                  />
                )}

                {/* ICON */}
                <Box
                  sx={{
                    width: { xs: 46, md: 60 },
                    height: { xs: 46, md: 60 },
                    borderRadius: "50%",
                    background:
                      "linear-gradient(180deg, #f4fbf6 0%, #e9f7ee 100%)",
                    border: "1px solid #e3f1e7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: { xs: 1, md: 1.5 },
                    color: "#16a34a",
                  }}
                >
                  {item.icon}
                </Box>

                {/* TITLE */}
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "11.5px", md: "13px" },
                    color: "#111827",
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </Typography>

                {/* SUBTITLE */}
                <Typography
                  sx={{
                    fontSize: { xs: "10.5px", md: "13px" },
                    color: "#374151",
                    lineHeight: 1.3,
                    mt: 0.5,
                  }}
                >
                  {item.subtitle}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
}