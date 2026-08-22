"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  useTheme,
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import VerifiedIcon from "@mui/icons-material/Verified";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import SignalCellularAltOutlinedIcon from "@mui/icons-material/SignalCellularAltOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockIcon from "@mui/icons-material/Lock";
import { useStudentAuth } from "@/context/StudentAuthContext";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const CARD_BG = "#ffffff";
const TEXT_SECONDARY = "#64748b";
const TEXT_PRIMARY = "#1e293b";
const PRIMARY_PURPLE = "#2f13c9ff";
const SUCCESS_GREEN = "var(--primary)";

const EXAM_TYPE_COLORS: Record<string, string> = {
  practice: "#3b82f6",
  mock: "#f59e0b",
  live: "#ef4444",
};

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: string;
  iconColor?: string;
}

const StatCard = ({ icon, label, value, color, iconColor }: StatCardProps) => (
  <Card
    sx={{
      p: { xs: 1.75, sm: 2, md: 2.5 },
      borderRadius: 0.5,
      background: CARD_BG,
      color: TEXT_PRIMARY,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
      flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 240px" },
      display: "flex",
      alignItems: "center",
      transition: "all 0.3s ease",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1.25, sm: 1.5, md: 1.875 },
      }}
    >
      <Avatar
        sx={{
          width: { xs: 46, sm: 52, md: 60 },
          height: { xs: 46, sm: 52, md: 60 },
          bgcolor: color,
          color: iconColor || "#fff",
          fontSize: { xs: "18px", sm: "20px", md: "24px" },
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography
          sx={{
            fontSize: { xs: 18, sm: 20, md: 24 },
            fontWeight: 600,
            lineHeight: 1,
            mb: 0.5,
            color: TEXT_PRIMARY,
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{ color: "#7f8c8d", fontSize: { xs: 12, sm: 13, md: 14 } }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  </Card>
);

interface QuickAccessItem {
  icon: ReactNode;
  label: string;
  description: string;
  color: string;
  iconColor: string;
}

const QuickAccessCard = ({
  icon,
  label,
  description,
  color,
  iconColor,
}: QuickAccessItem) => (
  <Card
    sx={{
      p: { xs: 1.75, sm: 2, md: 2.5 },
      borderRadius: 0.5,
      background: CARD_BG,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
      flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 220px" },
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      gap: { xs: 1.25, md: 1.5 },
      transition: "all 0.3s ease",
    }}
  >
    <Avatar
      sx={{
        width: { xs: 38, sm: 40, md: 44 },
        height: { xs: 38, sm: 40, md: 44 },
        bgcolor: color,
        color: iconColor,
        flexShrink: 0,
      }}
    >
      {icon}
    </Avatar>
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 0.4, minWidth: 0 }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { xs: 14, sm: 15 },
          color: TEXT_PRIMARY,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{ fontSize: { xs: 12, sm: 13 }, color: "#7f8c8d", lineHeight: 1.4 }}
      >
        {description}
      </Typography>
    </Box>
  </Card>
);

const formatDateTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

interface ExamListRowProps {
  title: string;
  questions: string | number;
  duration: string | number;
  examType: "practice" | "mock" | "live";
  isPremium?: boolean;
  locked?: boolean;
  onStart?: () => void;
  onUpgrade?: () => void;
  isStarting?: boolean;
}

const ExamListRow = ({
  title,
  questions,
  duration,
  examType,
  isPremium,
  locked,
  onStart,
  onUpgrade,
  isStarting,
}: ExamListRowProps) => {
  const typeColor = EXAM_TYPE_COLORS[examType] || PRIMARY_PURPLE;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: { xs: 1, sm: 1.5, md: 2 },
        p: { xs: 1.25, sm: 1.75, md: 2 },
        borderRadius: 0.5,
        border: locked ? "1px solid #f5deb3" : "1px solid #eef0f2",
        background: locked
          ? "linear-gradient(135deg, #fffdf7 0%, #fff9ec 100%)"
          : "#fff",
        flexDirection: { xs: "column", sm: "row" },
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: locked ? "#e8c877" : "#dfe3e8",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1.25, md: 1.5 },
          minWidth: 0,
          flex: 1,
          width: "100%",
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            width: { xs: 36, sm: 40, md: 42 },
            height: { xs: 36, sm: 40, md: 42 },
            bgcolor: `${typeColor}1a`,
            color: typeColor,
            borderRadius: 1.5,
            flexShrink: 0,
          }}
        >
          <AssignmentIcon fontSize="small" />
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: 14, sm: 15 },
              color: TEXT_PRIMARY,
            }}
            noWrap
          >
            {title}
          </Typography>
          <Typography
            sx={{ fontSize: { xs: 12, sm: 13 }, color: TEXT_SECONDARY }}
          >
            {questions} Questions • {duration} min
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.25 },
          flexShrink: 0,
          width: { xs: "100%", sm: "auto" },
          justifyContent: { xs: "space-between", sm: "flex-end" },
        }}
      >
        {!locked && (
          <Chip
            label={isPremium ? "PREMIUM" : examType.toUpperCase()}
            size="small"
            sx={{
              backgroundColor: isPremium ? "#fef3c7" : `${typeColor}1a`,
              color: isPremium ? "#d97706" : typeColor,
              fontWeight: 700,
              fontSize: { xs: 10, sm: 11 },
            }}
          />
        )}
        <Button
          variant="contained"
          onClick={locked ? onUpgrade : onStart}
          disabled={isStarting}
          startIcon={
            locked ? (
              <WorkspacePremiumIcon sx={{ fontSize: 16 }} />
            ) : undefined
          }
          sx={{
            textTransform: "none",
            background: locked
              ? "linear-gradient(90deg, #f2b73f 0%, #d99a1b 100%)"
              : isPremium
                ? PRIMARY_PURPLE
                : SUCCESS_GREEN,
            color: "#fff",
            borderRadius: 2,
            fontWeight: 700,
            fontSize: { xs: 12, sm: 13 },
            px: { xs: 1.5, sm: 2 },
            py: { xs: 0.6, sm: 0.75 },
            boxShadow: locked ? "0 2px 8px rgba(217, 154, 27, 0.35)" : "none",
            whiteSpace: "nowrap",
            minWidth: { xs: 88, sm: 100 },
            "&:hover": {
              background: locked
                ? "linear-gradient(90deg, #eab030 0%, #c88c17 100%)"
                : isPremium
                  ? PRIMARY_PURPLE
                  : SUCCESS_GREEN,
              boxShadow: locked
                ? "0 4px 12px rgba(217, 154, 27, 0.45)"
                : "none",
              opacity: locked ? 1 : 0.9,
              transform: locked ? "translateY(-1px)" : "none",
            },
          }}
        >
          {isStarting ? (
            <CircularProgress size={16} sx={{ color: "#fff" }} />
          ) : locked ? (
            "Upgrade"
          ) : isPremium ? (
            "Enroll Now"
          ) : (
            "Start Now"
          )}
        </Button>
      </Box>
    </Box>
  );
};

interface ActivityListRowProps {
  title: string;
  questions: string | number;
  startDate?: string;
  timeRemaining?: string;
}

const ActivityListRow = ({
  title,
  questions,
  startDate,
  timeRemaining,
}: ActivityListRowProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: { xs: "flex-start", sm: "center" },
      justifyContent: "space-between",
      gap: { xs: 1, sm: 1.5, md: 2 },
      p: { xs: 1.25, sm: 1.75, md: 2 },
      borderRadius: 0.5,
      border: `1px solid #eef0f2`,
      background: "#fff",
      flexDirection: { xs: "column", sm: "row" },
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: "#dfe3e8",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1.25, md: 1.5 },
        minWidth: 0,
        flex: 1,
        width: "100%",
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: { xs: 36, sm: 40, md: 42 },
          height: { xs: 36, sm: 40, md: 42 },
          bgcolor: "#fef3c7",
          color: "#d97706",
          borderRadius: 1.5,
          flexShrink: 0,
        }}
      >
        <ScheduleIcon fontSize="small" />
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: 14, sm: 15 },
            color: TEXT_PRIMARY,
          }}
          noWrap
        >
          {title}
        </Typography>
        <Typography
          sx={{ fontSize: { xs: 12, sm: 13 }, color: TEXT_SECONDARY }}
          noWrap
        >
          {questions} Questions
          {startDate ? ` • Starts ${formatDateTime(startDate)}` : ""}
        </Typography>
      </Box>
    </Box>

    <Chip
      label={timeRemaining || "Available soon"}
      size="small"
      sx={{
        backgroundColor: "#fef3c7",
        color: "#d97706",
        fontWeight: 600,
        fontSize: { xs: 11, sm: 12 },
        flexShrink: 0,
        alignSelf: { xs: "flex-start", sm: "center" },
      }}
    />
  </Box>
);

const ViewAllLink = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <Box sx={{ display: "flex", justifyContent: "center", pt: 0.5 }}>
    <Button
      onClick={onClick}
      endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
      sx={{
        textTransform: "none",
        color: "#16a34a",
        fontWeight: 600,
        fontSize: { xs: 13, sm: 14 },
      }}
    >
      {label}
    </Button>
  </Box>
);

export default function StudentDashboard() {
  const router = useRouter();
  const theme = useTheme();
  const { isPaidUser } = useStudentAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [availableExams, setAvailableExams] = useState<any[]>([]);
  const [upcomingLiveExams, setUpcomingLiveExams] = useState<any[]>([]);
  const [completedExams, setCompletedExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Tracks which exam's "Start Now" button is mid-flight, so we can disable
  // just that button and show a spinner instead of a page-wide loading state.
  const [startingExamId, setStartingExamId] = useState<number | string | null>(
    null,
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTimeRemaining = (startDateString: string) => {
    if (!startDateString) return "Available soon";
    const now = new Date();
    const startDate = new Date(startDateString);
    const timeRemaining = startDate.getTime() - now.getTime();
    if (timeRemaining <= 0) return "Exam starting now";
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
    );
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const role = localStorage.getItem("role") || sessionStorage.getItem("role");

    if (!token || role !== "student") {
      router.push("/");
      return;
    }

    const fetchExams = async () => {
      try {
        const availableResponse = await fetch("/api/students/exams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const availableData = await availableResponse.json();
        if (availableData.success) {
          const practiceMockLiveExams = availableData.data.filter(
            (exam: any) =>
              exam.examType === "practice" ||
              exam.examType === "mock" ||
              (exam.examType === "live" && exam.state === "available"),
          );
          setAvailableExams(practiceMockLiveExams);

          const upcomingLive = availableData.data.filter(
            (exam: any) =>
              exam.examType === "live" && exam.state === "upcoming",
          );
          setUpcomingLiveExams(upcomingLive);
        }

        const completedResponse = await fetch(
          "/api/students/attempts?latest=true",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const completedData = await completedResponse.json();
        if (completedData.success) {
          setCompletedExams(completedData.data);
        }
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();

    const mediaQuery = globalThis.matchMedia(theme.breakpoints.down("md"));
    setIsMobile(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme.breakpoints, router]);

  const calculateOverallAccuracy = () => {
    let totalCorrect = 0;
    let totalQuestions = 0;
    completedExams.forEach((exam) => {
      const correct = Number(exam.correctAnswers || 0);
      const wrong = Number(exam.wrongAnswers || 0);
      const unanswered = Number(exam.unanswered || 0);
      totalCorrect += correct;
      totalQuestions += correct + wrong + unanswered;
    });
    if (totalQuestions === 0) return "0%";
    return `${Math.round((totalCorrect / totalQuestions) * 100)}%`;
  };

  const [username, setUsername] = useState<string>("Student");

  useEffect(() => {
    const storedUsername =
      localStorage.getItem("username") || sessionStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  // Creates a new attempt for this exam via the same endpoint the PYQ and
  // My Exams pages use, then redirects to the actual exam-taking flow.
  const startExam = async (examId: number, examType: string) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    setStartingExamId(examId);
    try {
      const response = await fetch("/api/students/start", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ examId }),
      });

      if (response.status === 401) {
        alert("Your session has expired. Please log in again.");
        setStartingExamId(null);
        router.push("/");
        return;
      }

      const raw = await response.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        console.error("Start-exam response was not JSON:", response.status, raw);
        alert(`Could not start the exam (server returned status ${response.status}).`);
        setStartingExamId(null);
        return;
      }

      if (!response.ok || !data?.success || data?.attemptId == null) {
        alert(data?.message || "Failed to start exam");
        setStartingExamId(null);
        return;
      }

      if (examType === "mock" || examType === "live") {
        try {
          const elem = document.documentElement;
          if (elem.requestFullscreen) await elem.requestFullscreen();
          else if ((elem as any).webkitRequestFullscreen) await (elem as any).webkitRequestFullscreen();
          else if ((elem as any).mozRequestFullScreen) await (elem as any).mozRequestFullScreen();
          else if ((elem as any).msRequestFullscreen) await (elem as any).msRequestFullscreen();
        } catch (error) {
          console.error("Fullscreen error:", error);
        }
      }

      router.push(
        `/student-pages/exam_taking?examId=${examId}&attemptId=${data.attemptId}`,
      );
    } catch (error) {
      console.error("Failed to start exam:", error);
      alert("Failed to start exam. Please check your connection and try again.");
      setStartingExamId(null);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1.5, sm: 2, md: 2.5 },
        color: TEXT_PRIMARY,
        minHeight: "100vh",
        p: { xs: 1, sm: 1.25, md: 1.5 },
      }}
    >
      {/* Welcome Header */}
      <Box sx={{ mb: { xs: 0.5, sm: 1 } }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: 20, sm: 24, md: 28 },
            color: "#1e293b",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          Welcome back, {username}!
          <span style={{ display: "inline-block" }}>👋</span>
        </Typography>
        <Typography
          sx={{
            color: TEXT_SECONDARY,
            fontSize: { xs: 13, sm: 14, md: 15 },
            mt: 0.5,
          }}
        >
          Keep learning, keep growing. Your UPSC success journey continues.
        </Typography>
      </Box>

      {/* Top Stats */}
      <Box sx={{ mb: { xs: 1, sm: 1.5, md: 2 } }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 1.25, sm: 1.75, md: 2.5 },
          }}
        >
          <StatCard
            icon={<AssignmentIcon />}
            label="Available Exams"
            value={availableExams.length}
            color={"#e6f4ea"}
            iconColor={"#137333"}
          />
          <StatCard
            icon={<CheckCircleIcon />}
            label="Completed Exams"
            value={completedExams.length}
            color={"#e8f0fe"}
            iconColor={"#1a73e8"}
          />
          <StatCard
            icon={<ScheduleIcon />}
            label="Upcoming Live Exams"
            value={upcomingLiveExams.length}
            color={"#fef7e0"}
            iconColor={"#e37400"}
          />
          <StatCard
            icon={<VerifiedIcon />}
            label="Overall Accuracy"
            value={calculateOverallAccuracy()}
            color={"#e6f4ea"}
            iconColor={"#137333"}
          />
        </Box>
      </Box>

      {/* Quick Access */}
      <Box sx={{ mb: { xs: 0.5, sm: 1 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            mb: { xs: 1.25, sm: 1.5 },
          }}
        >
          <Box
            sx={{
              width: "4px",
              height: "20px",
              borderRadius: "4px",
              backgroundColor: "var(--primary)",
            }}
          />
          <Typography
            sx={{
              fontWeight: 700,
              color: "#2c3e50",
              fontSize: { xs: 16, sm: 17, md: 18 },
            }}
          >
            Quick Access
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 1.25, sm: 1.75, md: 2.5 },
          }}
        >
          <QuickAccessCard
            icon={<MenuBookIcon />}
            label="Practice by Subject"
            description="All Subjects Covered for Comprehensive Preparation"
            color="#e8f0fe"
            iconColor="#1a73e8"
          />
          <QuickAccessCard
            icon={<FeedOutlinedIcon />}
            label="Practice by Topic"
            description="Topic-wise Questions for focused learning"
            color="#fef7e0"
            iconColor="#e37400"
          />
          <QuickAccessCard
            icon={<SignalCellularAltOutlinedIcon />}
            label="Practice by Difficulty"
            description="Easy, Medium, and Hard questions for all levels"
            color="#e6f4ea"
            iconColor="#137333"
          />
          <QuickAccessCard
            icon={<FormatListBulletedOutlinedIcon />}
            label="Practice by Answer Type"
            description="MCQs, Statement, Match & more"
            color="#fde8e8"
            iconColor="#dc2626"
          />
        </Box>
      </Box>

      {/* PYQ Banner */}
      <Card
        sx={{
          borderRadius: 0.5,
          overflow: "hidden",
          position: "relative",
          background: "linear-gradient(135deg, #1a6b3c 0%, #16a34a 100%)",
          color: "#fff",
          p: { xs: 2, sm: 2.5, md: 3 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 1.5, sm: 2, md: 3 },
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            minWidth: 0,
            order: { xs: 2, sm: 1 },
            textAlign: { xs: "center", sm: "left" },
            width: "100%",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: 18, sm: 20, md: 24 },
              }}
            >
              Previous Year Questions
            </Typography>
            <Typography
              sx={{
                opacity: 0.9,
                lineHeight: 1.6,
                fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
              }}
            >
              Access subject-wise previous year question papers and sharpen your
              preparation with real exam practice.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() =>
              router.push("/student-pages/previous_year_questions")
            }
            sx={{
              mt: { xs: 2, sm: 3 },
              alignSelf: { xs: "center", sm: "flex-start" },
              bgcolor: "var(--white)",
              color: "var(--primary)",
              fontWeight: 700,
              textTransform: "none",
              px: 3,
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: 13, sm: 14 },
              borderRadius: 0.5,
              transition: "all 0.3s ease",
              "&:hover": { bgcolor: "#f3f4f6", transform: "translateY(-2px)" },
            }}
          >
            Start Practice
          </Button>
        </Box>

        <Box
          sx={{
            order: { xs: 1, sm: 2 },
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: { xs: "120px", sm: "150px", md: "220px" },
          }}
        >
          <Box
            component="img"
            src="/Images/pyqs.webp"
            alt="Previous Year Questions"
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: { xs: "110px", sm: "140px", md: "200px" },
              objectFit: "contain",
            }}
          />
        </Box>
      </Card>

      {/* Available Exams + Upcoming Live Exams */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          gap: { xs: 1.5, sm: 2, md: 2.5 },
          mb: { xs: 2, sm: 3, md: 3.75 },
        }}
      >
        {/* Available Exams */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "1 1 50%" },
            minWidth: 0,
            display: "flex",
          }}
        >
          <Card
            sx={{
              background: CARD_BG,
              borderRadius: 0.5,
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
              p: { xs: 1.75, sm: 2.25, md: 3.125 },
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: { xs: 1.25, sm: 1.75, md: 2.5 },
                pb: { xs: 1, sm: 1.5, md: 1.875 },
                borderBottom: `2px solid #f0f0f0`,
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1, sm: 0 },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#2c3e50",
                  fontSize: { xs: 16, sm: 18, md: 20 },
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                Available Exams
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1, sm: 1.25 },
                flex: 1,
                justifyContent:
                  loading || availableExams.length > 0
                    ? "flex-start"
                    : "center",
                alignItems:
                  loading || availableExams.length > 0 ? "stretch" : "center",
                minHeight: { xs: 120, sm: 160 },
              }}
            >
              {loading ? (
                <Typography sx={{ fontSize: { xs: 13, sm: 14 } }}>
                  Loading exams...
                </Typography>
              ) : availableExams.length > 0 ? (
                <>
                  {availableExams.slice(0, 3).map((exam) => (
                    <ExamListRow
                      key={exam.id}
                      title={exam.title}
                      questions={exam.questions ?? 0}
                      duration={exam.duration ?? 0}
                      examType={exam.examType}
                      isPremium={exam.isPremium}
                      locked={exam.isLocked ?? !isPaidUser}
                      isStarting={startingExamId === exam.id}
                      onStart={() => startExam(exam.id, exam.examType)}
                      onUpgrade={() => router.push("/pricing")
                        // alert("Please upgrade to premium to access this exam.")
                      }
                    />
                  ))}
                  <ViewAllLink
                    label="View All Exams"
                    onClick={() => router.push("/student-pages/my_exams")}
                  />
                </>
              ) : (
                <Typography
                  sx={{
                    color: TEXT_SECONDARY,
                    textAlign: "center",
                    fontSize: { xs: 13, sm: 14 },
                  }}
                >
                  No available exams at the moment.
                </Typography>
              )}
            </Box>
          </Card>
        </Box>

        {/* Upcoming Live Exams */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "1 1 50%" },
            minWidth: 0,
            display: "flex",
          }}
        >
          <Card
            sx={{
              background: CARD_BG,
              borderRadius: 0.5,
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
              p: { xs: 1.75, sm: 2.25, md: 3.125 },
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: { xs: 1.25, sm: 1.75, md: 2.5 },
                pb: { xs: 1, sm: 1.5, md: 1.875 },
                borderBottom: `2px solid #f0f0f0`,
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1, sm: 0 },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#2c3e50",
                  fontSize: { xs: 16, sm: 18, md: 20 },
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                Upcoming Live Exams
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1, sm: 1.25 },
                flex: 1,
                justifyContent:
                  loading || upcomingLiveExams.length > 0
                    ? "flex-start"
                    : "center",
                alignItems:
                  loading || upcomingLiveExams.length > 0
                    ? "stretch"
                    : "center",
                minHeight: { xs: 120, sm: 160 },
              }}
            >
              {loading ? (
                <Typography sx={{ fontSize: { xs: 13, sm: 14 } }}>
                  Loading upcoming exams...
                </Typography>
              ) : upcomingLiveExams.length > 0 ? (
                <>
                  {upcomingLiveExams.slice(0, 3).map((exam: any) => (
                    <ActivityListRow
                      key={exam.id}
                      title={exam.title}
                      questions={exam.questions ?? 0}
                      startDate={exam.startDate}
                      timeRemaining={getTimeRemaining(exam.startDate)}
                    />
                  ))}
                  <ViewAllLink
                    label="View All Activity"
                    onClick={() => router.push("/student-pages/my_exams")}
                  />
                </>
              ) : (
                <Typography
                  sx={{
                    color: TEXT_SECONDARY,
                    textAlign: "center",
                    fontSize: { xs: 13, sm: 14 },
                  }}
                >
                  No upcoming live exams at the moment.
                </Typography>
              )}
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}