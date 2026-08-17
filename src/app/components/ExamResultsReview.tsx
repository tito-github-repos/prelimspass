"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  EmojiEvents as EmojiEventsIcon,
  HelpOutline as HelpOutlineIcon,
  GpsFixed as GpsFixedIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";

// ---- Shared design tokens (matched to the rest of the app) ----
const TEXT_PRIMARY = "#1e293b";
const TEXT_SECONDARY = "#64748b";

const PRIMARY_BTN_SX = {
  borderRadius: 0.25,
  textTransform: "none" as const,
  backgroundColor: "var(--primary)",
  boxShadow: "none",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "var(--primary)",
    opacity: 0.92,
    boxShadow: "none",
  },
};

const RESET_BTN_SX = {
  borderRadius: 0.25,
  textTransform: "none" as const,
  borderColor: "var(--primary)",
  color: "var(--primary)",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "var(--primary-light)",
    borderColor: "var(--primary)",
  },
};

const FIELD_SX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0.5,
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--primary-light)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--primary)",
      borderWidth: "1px",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--primary)",
  },
};

const MENU_ITEM_SX = {
  "& .MuiMenuItem-root:hover": {
    backgroundColor: "var(--primary-light)",
    color: "var(--primary)",
  },
  "& .MuiMenuItem-root.Mui-selected": {
    backgroundColor: "var(--primary-light)",
    color: "var(--primary)",
  },
  "& .MuiMenuItem-root.Mui-selected:hover": {
    backgroundColor: "var(--primary-light)",
    color: "var(--primary)",
  },
};

const TOGGLE_GROUP_SX = {
  "& .MuiToggleButton-root": {
    textTransform: "none",
    fontSize: 12,
    fontWeight: 600,
    color: TEXT_SECONDARY,
    borderColor: "#e2e8f0",
    px: 1.5,
    "&.Mui-selected": {
      backgroundColor: "var(--primary)",
      color: "#fff",
      "&:hover": {
        backgroundColor: "var(--primary)",
        opacity: 0.9,
      },
    },
    "&:hover": {
      backgroundColor: "var(--primary-light)",
    },
  },
};

// Result chip tint — same pattern as the Attempt History / Exam Review
// modals, instead of MUI's default theme success/error colors.
const RESULT_META: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pass: { label: "Pass", color: "#16a34a", bg: "#f0fdf4" },
  fail: { label: "Fail", color: "#dc2626", bg: "#fef2f2" },
};

// Per-question status tint (correct / incorrect / unanswered).
const STATUS_META: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  correct: { label: "Correct", color: "#16a34a", bg: "#f0fdf4" },
  incorrect: { label: "Incorrect", color: "#dc2626", bg: "#fef2f2" },
  unanswered: { label: "Unanswered", color: "#d97706", bg: "#fffbeb" },
};

// A small icon badge used next to Accuracy / Result / Time Taken, so those
// three read the same as the icon-avatar stat cards above them instead of
// relying on emoji alone.
const InfoIconBadge = ({
  icon,
  color,
  bg,
}: {
  icon: React.ReactNode;
  color: string;
  bg: string;
}) => (
  <Avatar
    variant="rounded"
    sx={{
      bgcolor: bg,
      color: color,
      width: 32,
      height: 32,
      borderRadius: 1,
    }}
  >
    {icon}
  </Avatar>
);

// Helper function to format time
const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} sec`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }
  return `${minutes} min ${remainingSeconds} sec`;
};

const ScoreCircle = ({ score }: { score: number }) => {
  const percentage = score;
  const getScoreColor = (val: number): string => {
    if (val >= 60) return "#16a34a";
    if (val >= 40) return "#d97706";
    return "#dc2626";
  };
  const color = getScoreColor(percentage);

  return (
    <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
      <CircularProgress
        variant="determinate"
        value={percentage}
        size={150}
        thickness={8}
        sx={{
          color: color,
          backgroundColor: "transparent",
          borderRadius: "50%",
          boxShadow: "inset 0 0 0 8px #e9ecef",
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: color }}>
          {percentage}%
        </Typography>
      </Box>
    </Box>
  );
};

export default function ExamResultsReview() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const attemptId = searchParams.get("attemptId");

  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "correct" | "incorrect" | "unanswered"
  >("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");

  // Function to exit fullscreen
  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if ((document as any).webkitFullscreenElement) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozFullScreenElement) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msFullscreenElement) {
      (document as any).msExitFullscreen();
    }
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      exitFullscreen();
      router.push("/student-pages/exam_history");
    };

    window.addEventListener("popstate", handlePopState);
    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  const handleGoToHistory = () => {
    exitFullscreen();
    router.push("/student-pages/exam_history");
  };

  useEffect(() => {
    if (!attemptId) {
      setError("No attempt ID provided");
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/students/result?attemptId=${attemptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        if (data.success) {
          setResultData(data.data);
        } else {
          setError(data.message || "Failed to load results");
        }
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setError("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "var(--primary)" }} />
      </Box>
    );
  }

  if (error || !resultData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>{error || "Results not found"}</Typography>
      </Box>
    );
  }

  const { attempt, exam, questions } = resultData;

  // Check if it's a live exam and if results should be hidden
  const isLiveExam = exam.exam_type === "live";
  const examEndTime = new Date(exam.scheduled_end);
  const resultsAvailableTime = new Date(examEndTime.getTime() + 30 * 60 * 1000); // 30 minutes after scheduled end time
  const isResultsAvailable = new Date() >= resultsAvailableTime;

  // Format the results available time
  const formattedResultsTime = resultsAvailableTime.toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
  );

  // Show message if live exam and results not available yet
  if (isLiveExam && !isResultsAvailable) {
    return (
      <Box
        sx={{
          flex: 1,
          padding: {
            xs: "60px 8px 16px",
            sm: "70px 16px 24px",
            md: "16px 24px 32px",
            lg: "24px 32px 40px",
          },
          maxWidth: "100%",
          overflowX: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Paper
          sx={{
            padding: { xs: 3, sm: 4, md: 5 },
            borderRadius: 0.5,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                backgroundColor: "var(--primary-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AccessTimeIcon
                sx={{
                  fontSize: 50,
                  color: "var(--primary)",
                }}
              />
            </Box>
          </Box>

          <Typography
            sx={{
              color: "#2c3e50",
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              mb: 2,
            }}
          >
            Exam Completed Successfully! 🎉
          </Typography>

          <Typography
            sx={{
              color: TEXT_SECONDARY,
              fontSize: { xs: "1rem", sm: "1.125rem" },
              lineHeight: 1.6,
              mb: 4,
            }}
          >
            You have successfully completed the live exam. Your results will be
            available at <strong>{formattedResultsTime}</strong>. You can view
            them in the Exam History. Thank you.
          </Typography>

          <Button
            variant="contained"
            onClick={handleGoToHistory}
            sx={{
              ...PRIMARY_BTN_SX,
              padding: { xs: "12px 32px", sm: "14px 40px" },
              fontSize: { xs: "1rem", sm: "1.125rem" },
              borderRadius: 0.5,
            }}
          >
            Go to Exam History
          </Button>
        </Paper>
      </Box>
    );
  }

  const score = attempt.score || 0;
  const totalQuestions = exam.question_count || 0;
  const correctCount = attempt.correct_answers || 0;
  const wrongCount = attempt.wrong_answers || 0;
  const unansweredCount = attempt.unanswered || 0;
  const accuracy = attempt.accuracy || 0;
  const totalTimeTaken = attempt.total_time_seconds || 0;
  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Bug fix: this used to compare `attempt.result === "pass"` without
  // lowercasing, so a capitalized "Pass" from the API would render as a
  // red "Fail" chip. Normalize the same way the other pages/modals do.
  const resultMeta =
    RESULT_META[(attempt.result || "fail").toLowerCase()] ?? RESULT_META.fail;
  const isPass = (attempt.result || "fail").toLowerCase() === "pass";

  // Time-based filter logic
  const getTimeFilterRange = (
    timeFilter: string,
  ): { min: number; max: number } | null => {
    switch (timeFilter) {
      case "less30":
        return { min: 0, max: 30 };
      case "30to60":
        return { min: 30, max: 60 };
      case "1to2":
        return { min: 60, max: 120 };
      case "more2":
        return { min: 120, max: Infinity };
      default:
        return null;
    }
  };

  const filteredQuestions = questions
    .filter((q: any) => filter === "all" || q.status === filter)
    .filter((q: any) => {
      if (timeFilter === "all") return true;
      const range = getTimeFilterRange(timeFilter);
      if (!range) return true;
      return q.timeTaken >= range.min && q.timeTaken < range.max;
    })
    .sort((a: any, b: any) => b.timeTaken - a.timeTaken);

  const handlePrint = () => {
    globalThis.window.print();
  };

  // Stat card definitions for the 4-up grid — same icon-avatar pattern used
  // on the Progress page's stat cards, instead of plain emoji labels.
  const STAT_CARDS = [
    {
      icon: <EmojiEventsIcon fontSize="small" />,
      value: score,
      label: "Score",
      color: "#16a34a",
      bg: "#f0fdf4",
    },
    {
      icon: <CheckCircleIcon fontSize="small" />,
      value: correctCount,
      label: "Correct",
      color: "#16a34a",
      bg: "#f0fdf4",
    },
    {
      icon: <CancelIcon fontSize="small" />,
      value: wrongCount,
      label: "Wrong",
      color: "#dc2626",
      bg: "#fef2f2",
    },
    {
      icon: <HelpOutlineIcon fontSize="small" />,
      value: unansweredCount,
      label: "Unanswered",
      color: "#d97706",
      bg: "#fffbeb",
    },
  ];

  return (
    <Box
      sx={{
        flex: 1,
        padding: {
          xs: "60px 8px 16px",
          sm: "70px 16px 24px",
          md: "16px 24px 32px",
          lg: "24px 32px 40px",
        },
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 2, sm: 3 },
          paddingBottom: { xs: 1, sm: 1.5 },
          borderBottom: "1px solid #f1f5f9",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.5, sm: 2, md: 0 },
        }}
      >
        <Typography
          sx={{
            color: "#2c3e50",
            fontWeight: 700,
            textAlign: { xs: "center", sm: "left" },
            fontSize: {
              xs: "1.1rem",
              sm: "1.25rem",
              md: "1.5rem",
              lg: "1.875rem",
            },
            lineHeight: 1.2,
          }}
        >
          Exam Results: {exam.exam_title}
        </Typography>
        <Button
          variant="contained"
          onClick={handleGoToHistory}
          sx={{
            ...PRIMARY_BTN_SX,
            width: { xs: "100%", sm: "auto" },
            mb: { xs: 0.5, sm: 0 },
          }}
        >
          Back to Exam History
        </Button>
      </Box>

      {/* Results Summary */}
      <Paper
        sx={{
          padding: { xs: 2, sm: 2.5, md: 3 },
          mb: { xs: 2, sm: 3 },
          borderRadius: 0.5,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.25,
            mb: { xs: 2, sm: 3 },
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: "var(--primary-light)",
              color: "var(--primary)",
              width: 36,
              height: 36,
              borderRadius: 1,
            }}
          >
            <BarChartIcon fontSize="small" />
          </Avatar>
          <Typography
            variant="h5"
            sx={{
              color: "#2c3e50",
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
            }}
          >
            Result Summary
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <ScoreCircle score={percentage} />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={2}>
              {STAT_CARDS.map((stat) => (
                <Grid key={stat.label} size={{ xs: 6, sm: 3 }}>
                  <Card
                    sx={{
                      borderRadius: 0.75,
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", padding: 2 }}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: stat.bg,
                          color: stat.color,
                          width: 36,
                          height: 36,
                          mx: "auto",
                          mb: 1,
                          borderRadius: 1,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          color: TEXT_SECONDARY,
                          mb: 0.5,
                        }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: stat.color,
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  minWidth: "200px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <InfoIconBadge
                  icon={<GpsFixedIcon fontSize="small" />}
                  color="#2563eb"
                  bg="#eff6ff"
                />
                <Box>
                  <Typography
                    sx={{ fontSize: "0.8rem", color: TEXT_SECONDARY }}
                  >
                    Accuracy
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "#2c3e50",
                    }}
                  >
                    {accuracy}%
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: "200px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <InfoIconBadge
                  icon={
                    isPass ? (
                      <CheckCircleIcon fontSize="small" />
                    ) : (
                      <CancelIcon fontSize="small" />
                    )
                  }
                  color={resultMeta.color}
                  bg={resultMeta.bg}
                />
                <Box>
                  <Typography
                    sx={{ fontSize: "0.8rem", color: TEXT_SECONDARY }}
                  >
                    Result
                  </Typography>
                  <Chip
                    label={resultMeta.label}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      backgroundColor: resultMeta.bg,
                      color: resultMeta.color,
                      border: `1px solid ${resultMeta.color}33`,
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: "200px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <InfoIconBadge
                  icon={<AccessTimeIcon fontSize="small" />}
                  color={TEXT_SECONDARY}
                  bg="#f1f5f9"
                />
                <Box>
                  <Typography
                    sx={{ fontSize: "0.8rem", color: TEXT_SECONDARY }}
                  >
                    Total Time Taken
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "#2c3e50",
                    }}
                  >
                    {Math.floor(totalTimeTaken / 60)}m {totalTimeTaken % 60}s
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography
          sx={{
            color: TEXT_SECONDARY,
            textAlign: "center",
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          Completed on {new Date(attempt.end_time).toLocaleDateString()} • Time
          Spent: {Math.floor(totalTimeTaken / 60)} minutes {totalTimeTaken % 60}{" "}
          seconds
          {exam.time_limit_minutes > 0 && (
            <Box component="span" sx={{ ml: 1 }}>
              out of {exam.time_limit_minutes} minutes
            </Box>
          )}
        </Typography>
      </Paper>

      {/* Questions Review */}
      <Paper
        sx={{
          padding: { xs: 2, sm: 2.5, md: 3 },
          borderRadius: 0.5,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 1.5, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1.5, sm: 2, md: 0 },
          }}
        >
          <Typography
            sx={{
              color: "#2c3e50",
              fontWeight: 700,
              paddingBottom: { xs: 0.75, sm: 1 },
              fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.375rem" },
            }}
          >
            Question Review ({filteredQuestions.length} of {questions.length})
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 0.75, sm: 1 },
              width: { xs: "100%", sm: "auto" },
              alignItems: { xs: "stretch", sm: "center" },
            }}
          >
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(e, newFilter) => newFilter && setFilter(newFilter)}
              size="small"
              sx={{
                ...TOGGLE_GROUP_SX,
                flex: { xs: 1, sm: "none" },
                width: { xs: "100%", sm: "auto" },
                "& .MuiToggleButton-root": {
                  ...TOGGLE_GROUP_SX["& .MuiToggleButton-root"],
                  flex: { xs: 1, sm: "none" },
                },
              }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="correct">Correct</ToggleButton>
              <ToggleButton value="incorrect">Incorrect</ToggleButton>
              <ToggleButton value="unanswered">Unanswered</ToggleButton>
            </ToggleButtonGroup>

            <FormControl
              size="small"
              sx={{
                minWidth: { xs: "100%", sm: 140 },
                mt: { xs: 1, sm: 0 },
                ...FIELD_SX,
              }}
            >
              <InputLabel
                id="time-filter-label"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              >
                Time-Based
              </InputLabel>
              <Select
                labelId="time-filter-label"
                value={timeFilter}
                label="Time-Based"
                onChange={(e) => setTimeFilter(e.target.value)}
                MenuProps={{ PaperProps: { sx: MENU_ITEM_SX } }}
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                }}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="less30">Less than 30 sec</MenuItem>
                <MenuItem value="30to60">30-60 sec</MenuItem>
                <MenuItem value="1to2">1-2 min</MenuItem>
                <MenuItem value="more2">More than 2 min</MenuItem>
              </Select>
            </FormControl>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: { xs: 1, sm: 0 },
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              {/* Bug fix: this used to render a startIcon PLUS a second,
                  xs-only PrintIcon inside the button — two overlapping
                  print icons on mobile. Now there's exactly one icon,
                  always, with the "Print" label appearing next to it
                  only at sm+. */}
              <Button
                variant="outlined"
                onClick={handlePrint}
                sx={{
                  ...RESET_BTN_SX,
                  fontSize: { xs: 11, sm: 12 },
                  minWidth: { xs: "auto", sm: 120 },
                }}
              >
                <PrintIcon fontSize="small" sx={{ mr: { xs: 0, sm: 1 } }} />
                <Box sx={{ display: { xs: "none", sm: "inline" } }}>Print</Box>
              </Button>
            </Box>
          </Box>
        </Box>

        {filteredQuestions.map((question: any) => {
          const statusMeta =
            STATUS_META[question.status] ?? STATUS_META.unanswered;

          return (
            <Card
              key={question.id}
              sx={{
                mb: 2,
                borderRadius: 0.75,
                overflow: "hidden",
                border: "1px solid #f1f5f9",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Box
                sx={{
                  padding: { xs: 1, sm: 1.5 },
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 0 },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: TEXT_PRIMARY,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  Question {question.questionOrder}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeIcon
                      sx={{ fontSize: 16, color: TEXT_SECONDARY }}
                    />
                    <Typography
                      sx={{ fontSize: "0.875rem", color: TEXT_SECONDARY }}
                    >
                      {formatTime(question.timeTaken)}
                    </Typography>
                  </Box>
                  <Chip
                    label={statusMeta.label}
                    size="small"
                    sx={{
                      backgroundColor: statusMeta.bg,
                      color: statusMeta.color,
                      fontWeight: 700,
                      fontSize: 11,
                      border: `1px solid ${statusMeta.color}33`,
                    }}
                  />
                </Box>
              </Box>
              <CardContent sx={{ padding: { xs: 1.5, sm: 2 } }}>
                <Typography
                  sx={{
                    mb: 2,
                    lineHeight: 1.5,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    whiteSpace: "pre-wrap",
                    fontWeight: 600,
                    color: TEXT_PRIMARY,
                  }}
                >
                  {question.text}
                </Typography>

                <List sx={{ p: 0 }}>
                  {question.options.map((option: any, optIndex: number) => {
                    // Bug fix: the original had a third "selected" branch here
                    // that could never execute — if option.correct is true,
                    // the first check already returns; if option.selected is
                    // true and option.correct is false, the second check
                    // already returns. There's no remaining case for it to
                    // catch, so it was dead code. Reduced to the two real states.
                    const isCorrect = option.correct;
                    const isWrongSelected = option.selected && !option.correct;

                    const bg = isCorrect
                      ? "#f0fdf4"
                      : isWrongSelected
                        ? "#fef2f2"
                        : "transparent";
                    const borderColor = isCorrect
                      ? "#bbf7d0"
                      : isWrongSelected
                        ? "#fecaca"
                        : "#e2e8f0";
                    const letterBg = isCorrect
                      ? "#dcfce7"
                      : isWrongSelected
                        ? "#fee2e2"
                        : "#f1f5f9";
                    const letterColor = isCorrect
                      ? "#16a34a"
                      : isWrongSelected
                        ? "#dc2626"
                        : TEXT_SECONDARY;

                    return (
                      <ListItem
                        key={`option-${question.id}-${optIndex}`}
                        sx={{
                          padding: "12px 15px",
                          border: `1px solid ${borderColor}`,
                          borderRadius: 0.75,
                          mb: 1,
                          backgroundColor: bg,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 1.5,
                            fontWeight: 700,
                            fontSize: 13,
                            flexShrink: 0,
                            backgroundColor: letterBg,
                            color: letterColor,
                          }}
                        >
                          {String.fromCodePoint(65 + optIndex)}
                        </Box>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                whiteSpace: "pre-wrap",
                                color: TEXT_PRIMARY,
                              }}
                            >
                              {option.text}
                            </Typography>
                          }
                        />
                        {/* Bug fix: the original rendered a checkmark for
                            option.correct AND a second checkmark for
                            option.selected && option.correct, showing two
                            overlapping icons on a correctly-selected answer.
                            Each option now renders exactly one icon. */}
                        {isCorrect && (
                          <CheckCircleIcon sx={{ color: "#16a34a", ml: 1 }} />
                        )}
                        {isWrongSelected && (
                          <CancelIcon sx={{ color: "#dc2626", ml: 1 }} />
                        )}
                      </ListItem>
                    );
                  })}
                </List>

                <Box
                  sx={{
                    mt: 2,
                    padding: 1.5,
                    borderRadius: 0.75,
                    borderLeft: "4px solid #2563eb",
                    backgroundColor: "#eff6ff",
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 700, mb: 0.5, color: "#2563eb" }}
                  >
                    Explanation:
                  </Typography>
                  <Typography
                    sx={{
                      color: "#1d4ed8",
                      fontWeight: 500,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {question.explanation || "Explanation not available"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}

        {/* Navigation */}
        <Box
          sx={{
            textAlign: "center",
            mt: 3,
            display: "flex",
            justifyContent: "center",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={handleGoToHistory}
            sx={{
              ...PRIMARY_BTN_SX,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Back to Exam History
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
