"use client";

import type { ReactNode } from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Avatar,
  CircularProgress,
  InputBase,
  Chip,
  Pagination,
} from "@mui/material";
import { useRouter } from "next/navigation";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PublicIcon from "@mui/icons-material/Public";

/* ---------------------------------- */
/* Design tokens                       */
/* ---------------------------------- */
const MAIN_BG = "#f5f7fa";
const CARD_BG = "#ffffff";
const CARD_BORDER = "#e6e9ee";
const TEXT_PRIMARY = "#1e293b";
const TEXT_SECONDARY = "#7f8c8d";
const PRIMARY_GREEN = "#1a7a3c";
const PRIMARY_GREEN_DARK = "#146130";
const BUTTON_GRADIENT = "linear-gradient(90deg, #1fa84c 0%, #0f7a35 100%)";
const BUTTON_GRADIENT_HOVER =
  "linear-gradient(90deg, #189544 0%, #0c6a2d 100%)";

const TYPE_STYLES: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  practice: { bg: "#e6f4ea", color: "#1a7a3c", label: "Practice" },
  mock: { bg: "#fff4e0", color: "#b8720a", label: "Mock" },
  live: { bg: "#eef0ff", color: "#5b5bf0", label: "Live" },
};

// "Not Attempted" is intentionally muted/quiet; "Completed" is the strongest, greenest state.
const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  "Not Attempted": { bg: "#f4f5f6", color: "#a1a8b0" },
  "In Progress": { bg: "#e8f0fe", color: "#1a56db" },
  Completed: { bg: "#e2f6e9", color: "#0f7a35" },
  Upcoming: { bg: "#fff4e0", color: "#b8720a" },
  Live: { bg: "#fdecec", color: "#e53e3e" },
  Ended: { bg: "#f4f5f6", color: "#a1a8b0" },
};

/* ---------------------------------- */
/* Small building blocks               */
/* ---------------------------------- */
interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => (
  <Card
    sx={{
      p: 2,
      borderRadius: 2,
      background: CARD_BG,
      border: `1px solid ${CARD_BORDER}`,
      boxShadow: "0 1px 3px rgba(16, 24, 40, 0.04)",
      flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 10px)", md: "1 1 220px" },
      display: "flex",
      alignItems: "center",
      gap: 1.5,
    }}
  >
    <Avatar
      variant="rounded"
      sx={{
        width: 42,
        height: 42,
        borderRadius: 1.5,
        bgcolor: color,
        color: "#fff",
      }}
    >
      {icon}
    </Avatar>
    <Box>
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 700,
          lineHeight: 1.15,
          color: TEXT_PRIMARY,
        }}
      >
        {value}
      </Typography>
      <Typography sx={{ color: TEXT_SECONDARY, fontSize: 12.5 }}>
        {label}
      </Typography>
    </Box>
  </Card>
);

const typeChip = (examType: string) => {
  const style = TYPE_STYLES[examType] ?? TYPE_STYLES.practice;
  return (
    <Chip
      label={style.label}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        fontWeight: 700,
        fontSize: 12,
        height: 24,
      }}
    />
  );
};

const statusChip = (status: string) => {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES["Not Attempted"];
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        fontWeight: 600,
        fontSize: 12,
        height: 24,
      }}
    />
  );
};

/* ---------------------------------- */
/* Helpers                             */
/* ---------------------------------- */
const formatDateTime = (dateString?: string) => {
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

const isStartEnabled = (
  startDateString: string,
  endDateString: string,
  examType: string,
) => {
  if (examType !== "live") return true;
  const now = new Date();
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  return now >= startDate && now <= endDate;
};

// Derive a display status + action label for a row.
// Falls back gracefully if the API doesn't yet return attempt/status info.
const getRowStatus = (exam: any) => {
  if (exam.status) return exam.status as string; // trust backend if it sends one

  if (exam.examType === "live") {
    const now = new Date();
    const start = exam.startDate ? new Date(exam.startDate) : null;
    const end = exam.endDate ? new Date(exam.endDate) : null;
    if (start && now < start) return "Upcoming";
    if (start && end && now >= start && now <= end) return "Live";
    if (end && now > end) return "Ended";
    return "Upcoming";
  }

  return "Not Attempted";
};

const getActionLabel = (status: string, examType: string) => {
  switch (status) {
    case "Completed":
      return "View Results";
    case "In Progress":
      return "Continue";
    case "Upcoming":
      return "Register Now";
    case "Live":
      return "Start Now";
    case "Ended":
      return "Not Available";
    default:
      return "Start Now";
  }
};

const ROWS_PER_PAGE = 8;

/* ---------------------------------- */
/* Page                                */
/* ---------------------------------- */
export default function MyExamsPage() {
  const router = useRouter();
  const [availableExams, setAvailableExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingExamId, setStartingExamId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "practice" | "mock" | "live"
  >("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

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
        const response = await fetch("/api/students/exams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setAvailableExams(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [router]);

  const startExam = async (examId: number, examType: string) => {
    setStartingExamId(examId);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch("/api/students/start", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ examId }),
      });

      const data = await response.json();
      if (data.success) {
        if (examType === "mock" || examType === "live") {
          try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) await elem.requestFullscreen();
            else if ((elem as any).webkitRequestFullscreen)
              await (elem as any).webkitRequestFullscreen();
            else if ((elem as any).mozRequestFullScreen)
              await (elem as any).mozRequestFullScreen();
            else if ((elem as any).msRequestFullscreen)
              await (elem as any).msRequestFullscreen();
          } catch (error) {
            console.error("Fullscreen error:", error);
          }
        }

        router.push(
          `/student-pages/exam_taking?examId=${examId}&attemptId=${data.attemptId}`,
        );
      } else {
        alert(data.message || "Failed to start exam");
        setStartingExamId(null);
      }
    } catch (error) {
      console.error("Failed to start exam:", error);
      alert("Failed to start exam");
      setStartingExamId(null);
    }
  };

  const tabs: { key: typeof activeTab; label: string; icon: ReactNode }[] = [
    {
      key: "all",
      label: "All Exams",
      icon: <DescriptionOutlinedIcon fontSize="small" />,
    },
    {
      key: "practice",
      label: "Practice Tests",
      icon: <AssignmentIcon fontSize="small" />,
    },
    { key: "mock", label: "Mock Tests", icon: <TuneIcon fontSize="small" /> },
    {
      key: "live",
      label: "Live Tests",
      icon: <ScheduleIcon fontSize="small" />,
    },
  ];

  // Top-of-page summary stats: total exams available plus a breakdown by
  // type (practice / mock / live), mirroring the reference design's cards.
  const practiceExams = availableExams.filter(
    (exam) => exam.examType === "practice",
  );
  const mockExams = availableExams.filter((exam) => exam.examType === "mock");
  const liveExams = availableExams.filter((exam) => exam.examType === "live");

  // Filter by active tab + search text
  const filteredExams = useMemo(() => {
    let list = availableExams;
    if (activeTab !== "all")
      list = list.filter((e) => e.examType === activeTab);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.subject?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [availableExams, activeTab, search]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredExams.length / ROWS_PER_PAGE),
  );
  const pagedExams = filteredExams.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [activeTab, search]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, sm: 2.5, md: 3 },
        color: TEXT_PRIMARY,
        background: MAIN_BG,
        minHeight: "100vh",
        p: { xs: 1.5, sm: 2.5, md: 2 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 22, sm: 24, md: 28 },
              fontWeight: 700,
              color: TEXT_PRIMARY,
            }}
          >
            My Exams
          </Typography>
          <Typography
            sx={{
              color: TEXT_SECONDARY,
              fontSize: { xs: 13, sm: 14 },
              mt: 0.5,
            }}
          >
            Practice, evaluate and improve with our wide range of tests.
          </Typography>
        </Box>

        <Card
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            width: { xs: "100%", md: "auto" },
            gap: { xs: 1.25, sm: 2 },
            p: { xs: 1.75, sm: 1.5 },
            pl: { sm: 2 },
            pr: { sm: 2 },
            borderRadius: 1,
            background: "linear-gradient(135deg, #e9f7ee 0%, #eef7f0 100%)",
            border: `1px solid ${CARD_BORDER}`,
            boxShadow: "none",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <WorkspacePremiumIcon
              sx={{ color: PRIMARY_GREEN, flexShrink: 0 }}
            />
            <Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: 14, color: TEXT_PRIMARY }}
              >
                Go Premium for Unlimited Access
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: TEXT_SECONDARY }}>
                Unlock all mock tests, live tests and detailed analytics.
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            fullWidth={false}
            sx={{
              background: BUTTON_GRADIENT,
              "&:hover": { background: BUTTON_GRADIENT_HOVER },
              textTransform: "none",
              borderRadius: 1,
              fontWeight: 700,
              boxShadow: "none",
              whiteSpace: "nowrap",
              width: { xs: "100%", sm: "auto" },
              flexShrink: 0,
            }}
          >
            Upgrade Now
          </Button>
        </Card>
      </Box>

      {/* Stat cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 1.25, sm: 1.5, md: 2 },
        }}
      >
        <StatCard
          icon={<DescriptionOutlinedIcon />}
          label="Tests Available"
          value={availableExams.length}
          color="#6a11cb"
        />
        <StatCard
          icon={<AssignmentIcon />}
          label="Practice Exams"
          value={practiceExams.length}
          color="#3b82f6"
        />
        <StatCard
          icon={<TuneIcon />}
          label="Mock Exams"
          value={mockExams.length}
          color="#f59e0b"
        />
        <StatCard
          icon={<ScheduleIcon />}
          label="Live Exams"
          value={liveExams.length}
          color="#ef4444"
        />
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 4, md: 6 },
          borderBottom: `1px solid ${CARD_BORDER}`,
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => (
          <Box
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              pb: 1.5,
              cursor: "pointer",
              color: activeTab === tab.key ? PRIMARY_GREEN : TEXT_SECONDARY,
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: 14.5,
              whiteSpace: "nowrap",
              borderBottom:
                activeTab === tab.key
                  ? `2.5px solid ${PRIMARY_GREEN}`
                  : "2.5px solid transparent",
              transition: "color 0.2s ease",
              "&:hover": {
                color: activeTab === tab.key ? PRIMARY_GREEN : TEXT_PRIMARY,
              },
            }}
          >
            {tab.icon}
            {tab.label}
          </Box>
        ))}
      </Box>

      {/* All Exams table */}
      <Card
        sx={{
          background: CARD_BG,
          borderRadius: 1,
          border: `1px solid ${CARD_BORDER}`,
          boxShadow: "0 1px 3px rgba(16, 24, 40, 0.04)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            gap: 1.5,
            p: { xs: 2, md: 2.5 },
            borderBottom: `1px solid ${CARD_BORDER}`,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 18,
              color: TEXT_PRIMARY,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            All Exams
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: `1px solid ${CARD_BORDER}`,
              borderRadius: 1,
              px: 1.5,
              py: 0.75,
              width: { xs: "100%", sm: "auto" },
              minWidth: { sm: 240 },
              bgcolor: "#fafbfc",
            }}
          >
            <SearchIcon fontSize="small" sx={{ color: TEXT_SECONDARY }} />
            <InputBase
              placeholder="Search exams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ fontSize: 14, flex: 1 }}
            />
          </Box>
        </Box>

        {/* Table header */}
        <Box
          sx={{
            display: { xs: "none", md: "grid" },
            gridTemplateColumns: "2.4fr 1fr 1fr 1fr 1.2fr 1.3fr",
            px: 2.5,
            py: 1.5,
            bgcolor: "#fafbfc",
            borderBottom: `1px solid ${CARD_BORDER}`,
          }}
        >
          {[
            "Exam Name",
            "Type",
            "Questions",
            "Duration",
            "Status",
            "Action",
          ].map((h) => (
            <Typography
              key={h}
              sx={{
                fontSize: 12.5,
                fontWeight: 700,
                color: TEXT_SECONDARY,
                textTransform: "uppercase",
              }}
            >
              {h}
            </Typography>
          ))}
        </Box>

        {/* Rows */}
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress size={28} />
          </Box>
        ) : pagedExams.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography sx={{ color: TEXT_SECONDARY }}>
              No exams found.
            </Typography>
          </Box>
        ) : (
          pagedExams.map((exam) => {
            const status = getRowStatus(exam);
            const actionLabel = getActionLabel(status, exam.examType);
            const enabled =
              status !== "Ended" &&
              isStartEnabled(exam.startDate, exam.endDate, exam.examType);

            return (
              <Box
                key={exam.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "2.4fr 1fr 1fr 1fr 1.2fr 1.3fr",
                  },
                  alignItems: { xs: "flex-start", md: "center" },
                  gap: { xs: 1.25, md: 0 },
                  px: { xs: 2, md: 2.5 },
                  py: { xs: 2, md: 2 },
                  borderBottom: `1px solid ${CARD_BORDER}`,
                  "&:last-of-type": { borderBottom: "none" },
                  "&:hover": { bgcolor: "#fafbfc" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    width: "100%",
                  }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                      bgcolor: TYPE_STYLES[exam.examType]?.bg ?? "#f1f3f5",
                      color:
                        TYPE_STYLES[exam.examType]?.color ?? TEXT_SECONDARY,
                    }}
                  >
                    {exam.examType === "live" ? (
                      <PublicIcon fontSize="small" />
                    ) : (
                      <DescriptionOutlinedIcon fontSize="small" />
                    )}
                  </Avatar>
                  <Box sx={{ minWidth: 0, maxWidth: 230, width: "100%" }}>
                    <Typography
                      title={exam.title}
                      sx={{
                        fontWeight: 700,
                        fontSize: 14.5,
                        color: TEXT_PRIMARY,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        lineHeight: 1.3,
                      }}
                    >
                      {exam.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        color: TEXT_SECONDARY,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {exam.subject}
                    </Typography>
                    {exam.examType === "live" && exam.startDate && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.5,
                          color: TEXT_SECONDARY,
                        }}
                      >
                        <CalendarTodayIcon
                          sx={{ fontSize: 13, flexShrink: 0 }}
                        />
                        <Typography sx={{ fontSize: 12 }}>
                          {formatDateTime(exam.startDate)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Mobile: chips + meta shown inline with labels since the table header is hidden */}
                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {typeChip(exam.examType)}
                  {statusChip(status)}
                  <Typography sx={{ fontSize: 13, color: TEXT_SECONDARY }}>
                    {exam.questions ?? 0} Questions
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: TEXT_SECONDARY }}>
                    {exam.examType === "live"
                      ? "2 Hours"
                      : `${exam.duration ?? 0} min`}
                  </Typography>
                </Box>

                {/* Desktop: individual grid columns */}
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  {typeChip(exam.examType)}
                </Box>
                <Typography
                  sx={{
                    display: { xs: "none", md: "block" },
                    fontSize: 14,
                    color: TEXT_PRIMARY,
                  }}
                >
                  {exam.questions ?? 0} Questions
                </Typography>
                <Typography
                  sx={{
                    display: { xs: "none", md: "block" },
                    fontSize: 14,
                    color: TEXT_PRIMARY,
                  }}
                >
                  {exam.examType === "live"
                    ? "2 Hours"
                    : `${exam.duration ?? 0} min`}
                </Typography>
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  {statusChip(status)}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!enabled || startingExamId === exam.id}
                    onClick={() => startExam(exam.id, exam.examType)}
                    endIcon={
                      startingExamId === exam.id ? null : actionLabel ===
                          "Start Now" || actionLabel === "Continue" ? (
                        <ArrowForwardIcon fontSize="small" />
                      ) : null
                    }
                    sx={{
                      textTransform: "none",
                      borderRadius: 1,
                      fontWeight: 700,
                      fontSize: 13.5,
                      boxShadow: "none",
                      background: enabled ? BUTTON_GRADIENT : "#c8ccd2",
                      "&:hover": {
                        background: enabled ? BUTTON_GRADIENT_HOVER : "#c8ccd2",
                      },
                      width: { xs: "100%", md: 130 },
                    }}
                  >
                    {startingExamId === exam.id ? (
                      <CircularProgress size={18} sx={{ color: "#fff" }} />
                    ) : (
                      actionLabel
                    )}
                  </Button>
                </Box>
              </Box>
            );
          })
        )}

        {/* Pagination */}
        {!loading && filteredExams.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-end" },
              p: { xs: 1.75, sm: 2.5 },
            }}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              color="standard"
              size="small"
              siblingCount={0}
              sx={{
                "& .Mui-selected": {
                  bgcolor: `${PRIMARY_GREEN} !important`,
                  color: "#fff !important",
                },
              }}
            />
          </Box>
        )}
      </Card>
    </Box>
  );
}
