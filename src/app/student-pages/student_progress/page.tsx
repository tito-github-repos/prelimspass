"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  LinearProgress,
  CircularProgress,
  Pagination,
  Chip,
  Stack,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  School,
  Cancel,
  PlayArrow,
  Assessment,
  LiveTv,
  Timer,
} from "@mui/icons-material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2"; // cSpell:ignore chartjs
import { useRouter } from "next/navigation";
import StudentReviewModal from "@/app/components/StudentReviewModal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler,
);

// ---- Shared design tokens (matched to the Exam History page) ----------
const TEXT_SECONDARY = "#64748b";
const TEXT_PRIMARY = "#1e293b";
const FALLBACK_BRAND_GREEN = "#16a34a"; // used only if --primary can't be read

const FILTER_GROUP_LABEL_SX = {
  fontSize: 12,
  fontWeight: 700,
  color: TEXT_SECONDARY,
  textTransform: "uppercase" as const,
  letterSpacing: 0.4,
  mb: 0.75,
};

const TOGGLE_GROUP_SX = {
  "& .MuiToggleButton-root": {
    textTransform: "none",
    fontSize: 13,
    fontWeight: 600,
    color: TEXT_SECONDARY,
    borderColor: "#e2e8f0",
    borderRadius: 0.25,
    px: 1.75,
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

// Per-type icon + color, matched to the Exam History table's badge pattern
const EXAM_TYPE_META: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  practice: {
    label: "Practice",
    color: "#2563eb",
    bg: "#eff6ff",
    icon: <PlayArrow sx={{ fontSize: 16 }} />,
  },
  mock: {
    label: "Mock",
    color: "#d97706",
    bg: "#fffbeb",
    icon: <Assessment sx={{ fontSize: 16 }} />,
  },
  live: {
    label: "Live",
    color: "#dc2626",
    bg: "#fef2f2",
    icon: <LiveTv sx={{ fontSize: 16 }} />,
  },
};

// Converts a hex color (e.g. "#16a34a") to an rgba() string for chart fills.
// Falls back to the brand green if the CSS variable isn't a plain hex value.
const hexToRgba = (hex: string, alpha: number) => {
  const clean = hex.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    return `rgba(22, 163, 74, ${alpha})`;
  }
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const StudentProgressPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [subjectPerformance, setSubjectPerformance] = useState<
    {
      subject_id: number;
      subject_name: string;
      accuracy: number;
      totalCorrect: number;
      totalAttempted: number;
    }[]
  >([]);
  const [strongestSubject, setStrongestSubject] = useState<{
    name: string;
    accuracy: number;
  } | null>(null);
  const [weakestSubject, setWeakestSubject] = useState<{
    name: string;
    accuracy: number;
  } | null>(null);

  const [stats, setStats] = useState({
    averageScore: 0,
    overallAccuracy: 0,
    examsTaken: 0,
    passed: 0,
    failed: 0,
  });

  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(
    null,
  );

  // Reads the app's actual --primary brand color once on mount so the chart
  // matches the rest of the UI instead of a hardcoded purple.
  const [brandColor, setBrandColor] = useState(FALLBACK_BRAND_GREEN);
  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim();
    if (value) setBrandColor(value);
  }, []);

  // Performance Trend Graph State
  const [graphData, setGraphData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: "Accuracy",
        data: [],
      },
    ],
  });
  const [examType, setExamType] = useState<string>("all");
  const [quickFilter, setQuickFilter] = useState<string>("7d");
  const [graphLoading, setGraphLoading] = useState<boolean>(false);
  const [examNames, setExamNames] = useState<Record<string, string>>({});

  // Applies the current brand color to whatever raw data is in graphData,
  // so styling stays in one place regardless of where graphData was set.
  const styledGraphData = useMemo(
    () => ({
      ...graphData,
      datasets: graphData.datasets.map((ds: any) => ({
        ...ds,
        borderColor: brandColor,
        backgroundColor: hexToRgba(brandColor, 0.12),
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: brandColor,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      })),
    }),
    [graphData, brandColor],
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: TEXT_SECONDARY, font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        grid: { color: "#f1f5f9" },
        ticks: {
          color: TEXT_SECONDARY,
          font: { size: 11 },
          callback: function (value: any) {
            return value + "%";
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          title: function (context: any) {
            const date = context[0].label;
            return date;
          },
          label: function (context: any) {
            const date = context.label;
            const examName = examNames[date];
            const accuracy = context.parsed.y;

            let label = "Accuracy: " + accuracy + "%";
            if (examName) {
              label += "\nExam: " + examName;
            }

            return label;
          },
        },
      },
    },
  };

  // Date Calculation Functions
  const calculateDateRange = (filter: string) => {
    const now = new Date();
    const to = new Date(now);

    let from = new Date(now);

    switch (filter) {
      case "7d":
        from.setDate(from.getDate() - 7);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "30d":
        from.setDate(from.getDate() - 30);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "all":
        from = new Date(2000, 0, 1);
        to.setHours(23, 59, 59, 999);
        break;
    }

    return {
      from: from.toISOString(),
      to: to.toISOString(),
    };
  };

  // API Fetch Function
  const fetchPerformanceData = async (type: string, filter?: string) => {
    setGraphLoading(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const dateRange = calculateDateRange(filter ?? quickFilter);
      const params = new URLSearchParams({
        examType: type,
        fromDate: dateRange.from,
        toDate: dateRange.to,
      });

      const response = await fetch(
        `/api/students/performance-trend-graph?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();

      if (result.success) {
        // Aggregate accuracy per date to avoid duplicate dates
        const dateToAccuracies: Record<string, number[]> = {};
        const dateToExamName: Record<string, string> = {};

        result.data.forEach((item: any) => {
          const date = new Date(item.date);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          const dateStr = `${day}-${month}-${year}`;

          if (!dateToAccuracies[dateStr]) {
            dateToAccuracies[dateStr] = [];
          }
          dateToAccuracies[dateStr].push(item.accuracy);
          dateToExamName[dateStr] = item.title; // Store exam name for the date
        });

        // Calculate average accuracy for each date
        const aggregatedData: { date: string; accuracy: number }[] =
          Object.entries(dateToAccuracies).map(([date, accuracies]) => {
            const averageAccuracy =
              accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
            return {
              date,
              accuracy: Number(averageAccuracy.toFixed(2)), // Round to 2 decimal places
            };
          });

        // Sort by date
        aggregatedData.sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split("-").map(Number);
          const [dayB, monthB, yearB] = b.date.split("-").map(Number);
          return (
            new Date(yearA, monthA - 1, dayA).getTime() -
            new Date(yearB, monthB - 1, dayB).getTime()
          );
        });

        const formattedData = {
          labels: aggregatedData.map((item) => item.date),
          datasets: [
            {
              label: "Accuracy",
              data: aggregatedData.map((item) => item.accuracy),
            },
          ],
        };
        setGraphData(formattedData);
        setExamNames(dateToExamName); // Set the exam names for tooltip
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setGraphLoading(false);
    }
  };

  // Filter Handlers
  const handleExamTypeChange = (type: string) => {
    setExamType(type);
    fetchPerformanceData(type);
  };

  const handleQuickFilterChange = (filter: string) => {
    setQuickFilter(filter);
    fetchPerformanceData(examType, filter);
  };

  const handleReset = () => {
    setExamType("all");
    setQuickFilter("7d");
    fetchPerformanceData("all", "7d");
  };

  // Initialize Graph Data
  useEffect(() => {
    fetchPerformanceData("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProgressColor = (percentage: number) => {
    const PASS_PERCENTAGE = 33;
    return percentage >= PASS_PERCENTAGE ? "#28a745" : "#dc3545";
  };

  const SUBJECTS = [
    "Environment",
    "Geography",
    "Science & Technology",
    "Polity",
    "Economics",
    "History",
    "Current Affairs",
  ];

  const SUBJECT_ALIAS_MAP: Record<string, string> = {
    "Modern History": "History",
    History: "History",

    "Science & Technology": "Science & Technology",
    "Current Affairs": "Current Affairs",
    Polity: "Polity",
    Economics: "Economics",
    Geography: "Geography",
    Environment: "Environment",
  };

  const normalizeSubject = (subject: string) => {
    return SUBJECT_ALIAS_MAP[subject] ?? subject;
  };

  const MARKS_PER_QUESTION = 2;

  const calculateSubjectPerformance = (attempts: any[]) => {
    const practiceExams = attempts.filter(
      (exam) => exam.examType === "practice",
    );

    const subjectMap: Record<string, { obtained: number; total: number }> = {};

    practiceExams.forEach((exam) => {
      const subject = normalizeSubject(exam.subject);
      const obtainedMarks = Number(exam.score);
      const totalMarks = exam.questions * MARKS_PER_QUESTION;

      if (!subjectMap[subject]) {
        subjectMap[subject] = { obtained: 0, total: 0 };
      }

      subjectMap[subject].obtained += obtainedMarks;
      subjectMap[subject].total += totalMarks;
    });

    // Return all subjects (even if no practice exam)
    return SUBJECTS.map((subject) => {
      const data = subjectMap[subject];

      const percentage =
        data && data.total > 0
          ? Number(((data.obtained / data.total) * 100).toFixed(2))
          : 0;

      return {
        subject,
        percentage,
      };
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")} min`;
  };

  const formatTimeTaken = (takenSeconds: number, totalMinutes: number) => {
    const totalSeconds = totalMinutes * 60;
    return `${formatTime(takenSeconds)} / ${formatTime(totalSeconds)}`;
  };

  const calculatePercentageFromScore = (
    score: number,
    totalQuestions: number,
  ) => {
    if (!totalQuestions || totalQuestions === 0) return 0;

    const totalMarks = totalQuestions * MARKS_PER_QUESTION;
    return Number(((score / totalMarks) * 100).toFixed(2));
  };

  // Fetch subject performance data from API
  const fetchSubjectPerformance = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        "/api/students/student-subject-performance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();

      if (result.success) {
        setSubjectPerformance(result.data.subjects);
        setStrongestSubject(result.data.strongestSubject);
        setWeakestSubject(result.data.weakestSubject);
      }
    } catch (error) {
      console.error("Error fetching subject performance:", error);
    }
  };

  useEffect(() => {
    fetchSubjectPerformance();
  }, []);

  useEffect(() => {
    if (attempts.length > 0) {
      // Filter attempts based on exam type
      let filteredAttempts = attempts;

      if (examType !== "all") {
        filteredAttempts = attempts.filter(
          (exam) => exam.examType === examType,
        );
        // For specific exam types, only include the latest attempt per exam
        const examToLatestAttempt: Record<number, any> = {};

        filteredAttempts.forEach((attempt) => {
          const examId = attempt.examId;

          if (
            !examToLatestAttempt[examId] ||
            attempt.attemptNumber > examToLatestAttempt[examId].attemptNumber
          ) {
            examToLatestAttempt[examId] = attempt;
          }
        });

        filteredAttempts = Object.values(examToLatestAttempt);
      }

      const totalExams = filteredAttempts.length;

      // Average Score in %
      const sumPercentage = filteredAttempts.reduce((sum, exam) => {
        const percentage = calculatePercentageFromScore(
          Number(exam.score),
          exam.questions,
        );
        return sum + percentage;
      }, 0);
      const avgScore =
        totalExams > 0 ? Number((sumPercentage / totalExams).toFixed(2)) : 0;

      // Overall Accuracy: Total Correct / Total Attempted (Correct + Wrong)
      const totalCorrect = filteredAttempts.reduce(
        (sum, exam) => sum + Number(exam.correctAnswers),
        0,
      );
      const totalWrong = filteredAttempts.reduce(
        (sum, exam) => sum + Number(exam.wrongAnswers),
        0,
      );
      const totalAttempted = totalCorrect + totalWrong;
      const overallAccuracy =
        totalAttempted > 0
          ? Number(((totalCorrect / totalAttempted) * 100).toFixed(2))
          : 0;

      // Passed / Failed exams (based on 33% pass rule)
      const passedExams = filteredAttempts.filter((exam) => {
        const percentage = calculatePercentageFromScore(
          Number(exam.score),
          exam.questions,
        );
        return percentage >= 33;
      }).length;
      const failedExams = totalExams - passedExams;

      setStats({
        averageScore: avgScore,
        overallAccuracy: overallAccuracy,
        examsTaken: totalExams,
        passed: passedExams,
        failed: failedExams,
      });
    }
  }, [attempts, examType]);

  const getLatestAttempts = (attempts: any[]) => {
    const examMap: Record<number, any> = {};

    attempts.forEach((attempt) => {
      const examId = attempt.examId;

      if (
        !examMap[examId] ||
        attempt.attemptNumber > examMap[examId].attemptNumber
      ) {
        examMap[examId] = attempt;
      }
    });

    return Object.values(examMap);
  };

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        const res = await fetch("/api/students/attempts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (json.success) {
          const latestAttempts = getLatestAttempts(json.data);
          setAttempts(latestAttempts);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("Failed to fetch attempts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  const paginatedAttempts = attempts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const totalPages = Math.ceil(attempts.length / rowsPerPage);

  const handleReview = (attemptId: number) => {
    setSelectedAttemptId(attemptId);
    setReviewOpen(true);
  };

  const isResultsAvailable = (exam: any): boolean => {
    if (exam.examType !== "live" || !exam.endTime) {
      return true;
    }

    const examEndTime = new Date(exam.endTime);
    const resultsAvailableTime = new Date(
      examEndTime.getTime() + 30 * 60 * 1000,
    );

    return new Date() >= resultsAvailableTime;
  };

  const getResultsAvailableTime = (exam: any): string => {
    if (exam.examType !== "live" || !exam.endTime) {
      return "";
    }

    const examEndTime = new Date(exam.endTime);
    const resultsAvailableTime = new Date(
      examEndTime.getTime() + 30 * 60 * 1000,
    );

    return resultsAvailableTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Stat card definitions (icon, accent color, light tint) — same visual
  // language as the Exam History table's type badges.
  const STAT_CARDS = [
    {
      icon: <TrendingUp fontSize="small" />,
      value: `${stats.averageScore}%`,
      label: "Average Score",
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      icon: <Assessment fontSize="small" />,
      value: `${stats.overallAccuracy}%`,
      label: "Overall Accuracy",
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      icon: <School fontSize="small" />,
      value: `${stats.examsTaken}`,
      label: "Exams Taken",
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      icon: <CheckCircle fontSize="small" />,
      value: `${stats.passed}`,
      label: "Passed Exams",
      color: "#16a34a",
      bg: "#f0fdf4",
    },
    {
      icon: <Cancel fontSize="small" />,
      value: `${stats.failed}`,
      label: "Failed Exams",
      color: "#dc2626",
      bg: "#fef2f2",
    },
  ];

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        minHeight: "100vh",
        transition: "all 0.3s ease",
        p: { xs: 1, sm: 1.25, md: 1.5 },
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: 22, sm: 26, md: 30 },
            color: "#2c3e50",
          }}
        >
          Progress Overview
        </Typography>
        <Typography
          sx={{
            color: TEXT_SECONDARY,
            fontSize: { xs: 13, sm: 14 },
            mt: 0.5,
          }}
        >
          Track your performance and improve every day.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 1.5, sm: 2, md: 2.5 },
          mb: { xs: 2, sm: 3, md: 4 },
          "& > *": {
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 8px)",
              md: "1 1 calc(20% - 20px)",
            },
            minWidth: { xs: "150px", sm: "180px", md: "150px" },
          },
        }}
      >
        {STAT_CARDS.map((stat) => (
          <Card
            key={stat.label}
            sx={{
              borderRadius: 0.5,
              border: "1px solid #f1f5f9",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
              "&:hover": { boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)" },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.75}>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: stat.bg,
                    color: stat.color,
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: 20, sm: 22, md: 24 },
                      color: TEXT_PRIMARY,
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography sx={{ color: TEXT_SECONDARY, fontSize: 13 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Performance Chart */}
      <Card
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          borderRadius: 0.5,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
          transition: "all 0.3s ease",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#2c3e50",
              mb: { xs: 2, sm: 2.5 },
              fontSize: { xs: 16, sm: 17, md: 19 },
            }}
          >
            Performance Trend
          </Typography>

          {/* Filters Container */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 3 }}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography sx={FILTER_GROUP_LABEL_SX}>Exam Type</Typography>
              <ToggleButtonGroup
                value={examType}
                exclusive
                onChange={(e, newType) =>
                  newType && handleExamTypeChange(newType)
                }
                sx={TOGGLE_GROUP_SX}
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="practice">Practice</ToggleButton>
                <ToggleButton value="mock">Mock</ToggleButton>
                <ToggleButton value="live">Live</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box>
              <Typography sx={FILTER_GROUP_LABEL_SX}></Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <ToggleButtonGroup
                  value={quickFilter}
                  exclusive
                  onChange={(e, newFilter) =>
                    newFilter && handleQuickFilterChange(newFilter)
                  }
                  sx={TOGGLE_GROUP_SX}
                >
                  <ToggleButton value="7d">7 Days</ToggleButton>
                  <ToggleButton value="30d">30 Days</ToggleButton>
                  <ToggleButton value="all">All</ToggleButton>
                </ToggleButtonGroup>

                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<RestartAltIcon />}
                  sx={RESET_BTN_SX}
                >
                  Reset
                </Button>
              </Stack>
            </Box>
          </Stack>

          {/* Graph */}
          <Box sx={{ height: { xs: 250, sm: 280, md: 300 }, mb: 3 }}>
            {graphLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress sx={{ color: "var(--primary)" }} />
              </Box>
            ) : graphData.labels.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography textAlign="center" color="text.secondary">
                  No exam data available for the selected range.
                </Typography>
              </Box>
            ) : (
              <Line data={styledGraphData} options={chartOptions} />
            )}
          </Box>

          {/* Explanation Text */}
          <Typography
            variant="body2"
            sx={{
              color: TEXT_SECONDARY,
              textAlign: "center",
            }}
          >
            This graph shows how your exam accuracy has changed over time based
            on completed exams.
          </Typography>
        </CardContent>
      </Card>

      {/* Subject Performance + Strengths & Focus — one card, split 75/25 with a vertical divider */}
      <Card
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          borderRadius: 0.5,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
          transition: "all 0.3s ease",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: { xs: 3, lg: 0 },
            }}
          >
            {/* Left: All Subjects — 75% on desktop */}
            <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 75%" }, minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#2c3e50",
                  mb: 0.5,
                  fontSize: { xs: 16, sm: 17, md: 19 },
                }}
              >
                Subject Performance
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: TEXT_SECONDARY, mb: { xs: 2, sm: 3 } }}
              >
                Based on all completed exams
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                  <CircularProgress sx={{ color: "var(--primary)" }} />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: { xs: 2, sm: 2.5, md: 3 },
                    "& > *": {
                      flex: {
                        xs: "1 1 100%",
                        sm: "1 1 calc(50% - 10px)",
                        md: "1 1 calc(33.333% - 20px)",
                      },
                      minWidth: { xs: "150px", sm: "200px", md: "150px" },
                    },
                  }}
                >
                  {subjectPerformance.map((item) => (
                    <Box
                      key={item.subject_id}
                      sx={{
                        p: 2,
                        bgcolor: "#f8f9fa",
                        borderRadius: 0.5,
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                          {item.subject_name}
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                          {item.accuracy}%
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={item.accuracy}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "#e9ecef",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getProgressColor(item.accuracy),
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Divider — vertical on desktop (splits the two columns),
                horizontal on mobile where they stack instead */}
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", lg: "block" }, mx: 3 }}
            />
            <Divider sx={{ display: { xs: "block", lg: "none" } }} />

            {/* Right: Strengths & Focus — 25% on desktop */}
            <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 25%" }, minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#2c3e50",
                  mb: { xs: 2, sm: 2.5 },
                  fontSize: { xs: 16, sm: 17, md: 19 },
                }}
              >
                Strengths &amp; Focus
              </Typography>

              {!strongestSubject && !weakestSubject ? (
                <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                  Complete a practice exam to see your strengths.
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {strongestSubject && (
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                      sx={{
                        bgcolor: "#f0fdf4",
                        border: "1px solid #dcfce7",
                        borderRadius: 0.75,
                        px: 1.75,
                        py: 1.5,
                      }}
                    >
                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: "#dcfce7",
                          color: "#16a34a",
                          width: 34,
                          height: 34,
                          borderRadius: 0.75,
                          flexShrink: 0,
                        }}
                      >
                        <TrendingUp sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#16a34a",
                            textTransform: "uppercase",
                            letterSpacing: 0.4,
                            mb: 0.25,
                          }}
                        >
                          Strongest Subject
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: "#14532d",
                          }}
                          noWrap
                        >
                          {strongestSubject.name}
                        </Typography>
                        {/* <Typography
                          sx={{ fontWeight: 700, fontSize: 13, color: "#16a34a" }}
                        >
                          {strongestSubject.accuracy}%
                        </Typography> */}
                      </Box>
                    </Stack>
                  )}

                  {weakestSubject && (
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                      sx={{
                        bgcolor: "#fef2f2",
                        border: "1px solid #fee2e2",
                        borderRadius: 0.75,
                        px: 1.75,
                        py: 1.5,
                      }}
                    >
                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: "#fee2e2",
                          color: "#dc2626",
                          width: 34,
                          height: 34,
                          borderRadius: 0.75,
                          flexShrink: 0,
                        }}
                      >
                        <TrendingDown sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#dc2626",
                            textTransform: "uppercase",
                            letterSpacing: 0.4,
                            mb: 0.25,
                          }}
                        >
                          Needs Focus
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: "#7f1d1d",
                          }}
                          noWrap
                        >
                          {weakestSubject.name}
                        </Typography>
                        {/* <Typography
                          sx={{ fontWeight: 700, fontSize: 13, color: "#dc2626" }}
                        >
                          {weakestSubject.accuracy}%
                        </Typography> */}
                      </Box>
                    </Stack>
                  )}
                </Stack>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Exam History */}
      <Card
        sx={{
          borderRadius: 0.5,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
          transition: "all 0.3s ease",
          py: { xs: 1.5, sm: 2.5, md: 3.125 },
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            color: "#2c3e50",
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: 16, sm: 17, md: 19 },
            px: { xs: 1.5, sm: 2.5, md: 3.125 },
          }}
        >
          Recent Exam History
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress sx={{ color: "var(--primary)" }} />
          </Box>
        ) : (
          <>
            <TableContainer
              sx={{
                overflowX: "auto",
                borderRadius: 0,
                border: "1px solid #e2e8f0",
                mx: { xs: 1.5, sm: 2.5, md: 3.125 },
                width: "auto",
              }}
            >
              <Table sx={{ minWidth: 720 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                    <TableCell sx={{ fontWeight: 700, color: "#2c3e50" }}>
                      Exam
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#2c3e50" }}>
                      Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#2c3e50" }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#2c3e50" }}>
                      Score
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#2c3e50" }}>
                      Time Taken
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#2c3e50" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#2c3e50" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAttempts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        No exam history found
                      </TableCell>
                    </TableRow>
                  )}

                  {paginatedAttempts.map((exam) => {
                    const resultsAvailable = isResultsAvailable(exam);
                    const resultsTime = getResultsAvailableTime(exam);
                    const meta =
                      EXAM_TYPE_META[exam.examType] ?? EXAM_TYPE_META.practice;
                    const scoreColor = resultsAvailable
                      ? getProgressColor(
                          calculatePercentageFromScore(
                            Number(exam.score),
                            exam.questions,
                          ),
                        )
                      : "#94a3b8";

                    return (
                      <TableRow hover key={exam.attemptId}>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: TEXT_PRIMARY }}
                          >
                            {exam.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={meta.label}
                            size="small"
                            icon={meta.icon as any}
                            sx={{
                              backgroundColor: meta.bg,
                              color: meta.color,
                              fontWeight: 700,
                              fontSize: 11,
                              border: `1px solid ${meta.color}33`,
                              "& .MuiChip-icon": { color: meta.color },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: 13.5 }}>
                          {exam.completedAt}
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{ fontWeight: 700, color: scoreColor }}
                          >
                            {resultsAvailable ? exam.score : "-"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Timer
                              sx={{ fontSize: 16, color: TEXT_SECONDARY }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: TEXT_SECONDARY }}
                            >
                              {formatTimeTaken(
                                exam.totalTimeSeconds,
                                exam.duration,
                              )}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              bgcolor: "#d4edda",
                              color: "#155724",
                              px: 1,
                              py: 0.5,
                              borderRadius: 2,
                              fontSize: "12px",
                              fontWeight: 600,
                              display: "inline-block",
                            }}
                          >
                            Completed
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Tooltip
                            title={
                              !resultsAvailable
                                ? `Results will be available at ${resultsTime}`
                                : ""
                            }
                          >
                            <span>
                              <Button
                                variant="outlined"
                                size="small"
                                disabled={!resultsAvailable}
                                onClick={() => handleReview(exam.attemptId)}
                                sx={{
                                  textTransform: "none",
                                  borderRadius: 0.25,
                                  fontWeight: 600,
                                  borderColor: "var(--primary)",
                                  color: "var(--primary)",
                                  "&:hover": {
                                    backgroundColor: "var(--primary-light)",
                                    borderColor: "var(--primary)",
                                  },
                                  "&.Mui-disabled": {
                                    borderColor: "#e2e8f0",
                                    color: "#cbd5e1",
                                  },
                                }}
                              >
                                Review
                              </Button>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                sx={{
                  "& .MuiPaginationItem-root": { color: TEXT_PRIMARY },
                  "& .Mui-selected": {
                    backgroundColor: "var(--primary) !important",
                    color: "#fff",
                  },
                }}
              />
            </Box>
          </>
        )}
      </Card>

      <StudentReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        attemptId={selectedAttemptId}
      />
    </Box>
  );
};

export default StudentProgressPage;
