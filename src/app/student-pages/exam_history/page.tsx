"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Stack,
  Avatar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import QuizIcon from "@mui/icons-material/Quiz";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SensorsIcon from "@mui/icons-material/Sensors";
import AttemptHistoryModal from "@/app/components/AttemptHistoryModal";

const TEXT_SECONDARY = "#64748b";
const TEXT_PRIMARY = "#1e293b";
const PRIMARY_PURPLE = "var(--primary)";

// Shared corner radius + focus/hover color for filter-bar inputs, matched to
// the Apply/Reset buttons (borderRadius: 0.25) and themed with --primary.
const FILTER_INPUT_SX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0.25,
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

// Shared hover/selected styling for dropdown menus (Subject filter, rows-per-page).
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

const FILTER_GROUP_LABEL_SX = {
  fontSize: 12,
  fontWeight: 700,
  color: TEXT_SECONDARY,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  mb: 0.75,
};

// A filter group (Exam Type / Subjects / Date Range) takes the full card
// width up through "md" (where the bar is still stacked in a column), then
// shrinks to fit its content once the bar switches to a single row.
const FILTER_GROUP_SX = { width: { xs: "100%", md: "auto" } };

// Columns hidden on the smallest screens to keep the table usable without
// forcing horizontal scroll on a phone.
const HIDE_ON_XS_SX = { display: { xs: "none", sm: "table-cell" } };

// Fixed slot widths so Retake / View Results / Attempt History line up in
// the same horizontal position on every row, even when a button is hidden.
const ACTION_SLOT_WIDTH = { retake: 92, results: 112, history: 132 };

// Interface for exam attempt data from API
interface ExamAttempt {
  attemptId: number;
  examId: number;
  title: string;
  subject: string;
  duration: number;
  questions: number;
  points: string;
  examType: "practice" | "mock" | "live";
  score: string;
  completedAt: string;
  endTime: string; // ISO format date string
  totalTimeSeconds: number;
  canRetake: boolean;
  hasReachedRetakeLimit: boolean;
  attemptNumber: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  result: string;
}

// Per-type icon, accent color, and light background tint for the row icon
// badge and the type chip.
const TYPE_META: Record<
  ExamAttempt["examType"],
  { label: string; color: string; bg: string; icon: typeof QuizIcon }
> = {
  practice: {
    label: "Practice",
    color: "#2563eb",
    bg: "#eff6ff",
    icon: QuizIcon,
  },
  mock: {
    label: "Mock",
    color: "#d97706",
    bg: "#fffbeb",
    icon: AssignmentTurnedInIcon,
  },
  live: { label: "Live", color: "#dc2626", bg: "#fef2f2", icon: SensorsIcon },
};

export default function ExamHistoryPage() {
  const router = useRouter();

  const [completedExams, setCompletedExams] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [attemptHistoryOpen, setAttemptHistoryOpen] = useState(false);
  const [retakeLoadingExamId, setRetakeLoadingExamId] = useState<number | null>(
    null,
  );

  // Filter state
  const [typeFilter, setTypeFilter] = useState({
    practice: true,
    mock: true,
    live: true,
  });
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Applied filter state (only updates when "Apply Filters" is clicked)
  const [appliedTypeFilter, setAppliedTypeFilter] = useState(typeFilter);
  const [appliedSubjectFilter, setAppliedSubjectFilter] =
    useState(subjectFilter);
  const [appliedDateFrom, setAppliedDateFrom] = useState(dateFrom);
  const [appliedDateTo, setAppliedDateTo] = useState(dateTo);

  // Search + pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const role = localStorage.getItem("role") || sessionStorage.getItem("role");

    if (!token || role !== "student") {
      router.push("/");
      return;
    }

    const fetchAttempts = async () => {
      try {
        const response = await fetch("/api/students/attempts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setCompletedExams(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch attempts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [router]);

  const viewResults = (attemptId: number) => {
    router.push(`/student-pages/exam_res_rev?attemptId=${attemptId}`);
  };

  const takeExam = async (
    attemptId: number,
    examId: number,
    examType: string,
  ) => {
    setRetakeLoadingExamId(examId);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch("/api/students/retake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ attemptId }),
      });
      const data = await response.json();
      if (data.success) {
        sessionStorage.removeItem(`violation_${examId}`);
        sessionStorage.removeItem("autoSubmit");
        sessionStorage.removeItem(`exam_${examId}_userAnswers`);
        sessionStorage.removeItem(`exam_${examId}_questionTimes`);

        if (examType === "mock") {
          const enterFullscreen = async () => {
            try {
              const elem = document.documentElement;
              if (elem.requestFullscreen) {
                await elem.requestFullscreen();
              } else if ((elem as any).webkitRequestFullscreen) {
                await (elem as any).webkitRequestFullscreen();
              } else if ((elem as any).mozRequestFullScreen) {
                await (elem as any).mozRequestFullScreen();
              } else if ((elem as any).msRequestFullscreen) {
                await (elem as any).msRequestFullscreen();
              }
            } catch (error) {
              console.error("Fullscreen error:", error);
            }
          };
          await enterFullscreen();
        }

        router.push(
          `/student-pages/exam_taking?examId=${examId}&attemptId=${data.attemptId}`,
        );
      } else {
        alert(data.message || "Failed to create retake");
      }
    } catch (error) {
      console.error("Failed to retake exam:", error);
      alert("Failed to retake exam");
    } finally {
      setRetakeLoadingExamId(null);
    }
  };

  const openAttemptHistory = (exam: any) => {
    setSelectedExam(exam);
    setAttemptHistoryOpen(true);
  };

  const closeAttemptHistory = () => {
    setAttemptHistoryOpen(false);
    setSelectedExam(null);
  };

  // Check if results are available for a live exam (30 min after end time)
  const isResultsAvailable = (exam: ExamAttempt): boolean => {
    if (exam.examType !== "live" || !exam.endTime) {
      return true;
    }
    const examEndTime = new Date(exam.endTime);
    const resultsAvailableTime = new Date(
      examEndTime.getTime() + 30 * 60 * 1000,
    );
    return new Date() >= resultsAvailableTime;
  };

  const getResultsAvailableTime = (exam: ExamAttempt): string => {
    if (exam.examType !== "live" || !exam.endTime) return "";
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

  // Group attempts by exam id, keep only the latest attempt per exam
  const latestAttempts = useMemo(() => {
    const examsByExamId = completedExams.reduce(
      (groups, attempt) => {
        const { examId } = attempt;
        if (!groups[examId]) groups[examId] = [];
        groups[examId].push(attempt);
        return groups;
      },
      {} as Record<number, ExamAttempt[]>,
    );

    return Object.values(examsByExamId).map((examAttempts) =>
      examAttempts.reduce((latest, current) =>
        current.attemptNumber > latest.attemptNumber ? current : latest,
      ),
    );
  }, [completedExams]);

  const subjectOptions = useMemo(() => {
    const set = new Set(latestAttempts.map((e) => e.subject));
    return Array.from(set);
  }, [latestAttempts]);

  const filteredExams = useMemo(() => {
    return latestAttempts.filter((exam) => {
      if (!appliedTypeFilter[exam.examType]) return false;
      if (
        appliedSubjectFilter !== "all" &&
        exam.subject !== appliedSubjectFilter
      )
        return false;

      if (appliedDateFrom || appliedDateTo) {
        // completedAt expected in dd-mm-yyyy format
        const parts = exam.completedAt.split("-");
        if (parts.length === 3) {
          const examDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          if (appliedDateFrom && examDate < new Date(appliedDateFrom))
            return false;
          if (appliedDateTo && examDate > new Date(appliedDateTo)) return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        if (
          !exam.title.toLowerCase().includes(q) &&
          !exam.subject.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    latestAttempts,
    appliedTypeFilter,
    appliedSubjectFilter,
    appliedDateFrom,
    appliedDateTo,
    searchQuery,
  ]);

  const paginatedExams = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredExams.slice(start, start + rowsPerPage);
  }, [filteredExams, page, rowsPerPage]);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const handleApplyFilters = () => {
    setAppliedTypeFilter(typeFilter);
    setAppliedSubjectFilter(subjectFilter);
    setAppliedDateFrom(dateFrom);
    setAppliedDateTo(dateTo);
    setPage(0);
  };

  const handleResetFilters = () => {
    const reset = { practice: true, mock: true, live: true };
    setTypeFilter(reset);
    setSubjectFilter("all");
    setDateFrom("");
    setDateTo("");
    setAppliedTypeFilter(reset);
    setAppliedSubjectFilter("all");
    setAppliedDateFrom("");
    setAppliedDateTo("");
    setPage(0);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, sm: 2.5, md: 3 },
        color: TEXT_PRIMARY,
        minHeight: "100vh",
        p: { xs: 1, sm: 1.25, md: 1.5 },
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "left" }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: 22, sm: 26, md: 30 },
            color: "#2c3e50",
          }}
        >
          Exam History
        </Typography>
        <Typography
          sx={{
            color: TEXT_SECONDARY,
            fontSize: { xs: 13, sm: 14 },
            mt: 0.5,
          }}
        >
          Review your past performance and track your progress over time.
        </Typography>
      </Box>

      {/* Filter Exams - horizontal on desktop, stacked on smaller screens */}
      <Card
        sx={{
          borderRadius: 0.5,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
          p: { xs: 2, sm: 2.5, md: 3.125 },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <FilterAltOutlinedIcon
            sx={{ color: "var(--primary)" }}
            fontSize="small"
          />
          <Typography
            sx={{
              fontWeight: 700,
              color: "#2c3e50",
              fontSize: { xs: 16, sm: 17 },
            }}
          >
            Filter Exams
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2, md: 3 }}
          alignItems={{ xs: "stretch", md: "flex-end" }}
          flexWrap="wrap"
          useFlexGap
        >
          {/* Exam Type checkboxes */}
          <Box sx={FILTER_GROUP_SX}>
            <Typography sx={FILTER_GROUP_LABEL_SX}>Exam Type</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={typeFilter.practice}
                    onChange={(e) =>
                      setTypeFilter((prev) => ({
                        ...prev,
                        practice: e.target.checked,
                      }))
                    }
                    sx={{
                      color: "var(--primary)",
                      "&.Mui-checked": { color: "var(--primary)" },
                    }}
                  />
                }
                label="Practice"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={typeFilter.mock}
                    onChange={(e) =>
                      setTypeFilter((prev) => ({
                        ...prev,
                        mock: e.target.checked,
                      }))
                    }
                    sx={{
                      color: "var(--primary)",
                      "&.Mui-checked": { color: "var(--primary)" },
                    }}
                  />
                }
                label="Mock"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={typeFilter.live}
                    onChange={(e) =>
                      setTypeFilter((prev) => ({
                        ...prev,
                        live: e.target.checked,
                      }))
                    }
                    sx={{
                      color: "var(--primary)",
                      "&.Mui-checked": { color: "var(--primary)" },
                    }}
                  />
                }
                label="Live"
              />
            </Stack>
          </Box>

          {/* Subject dropdown */}
          <Box sx={FILTER_GROUP_SX}>
            <Typography sx={FILTER_GROUP_LABEL_SX}>Subjects</Typography>
            <FormControl
              size="small"
              sx={{
                width: { xs: "100%", sm: 260, md: 180 },
                ...FILTER_INPUT_SX,
              }}
            >
              <Select
                displayEmpty
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                MenuProps={{ PaperProps: { sx: MENU_ITEM_SX } }}
              >
                <MenuItem value="all">All Subjects</MenuItem>
                {subjectOptions.map((subj) => (
                  <MenuItem key={subj} value={subj}>
                    {subj}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Date range */}
          <Box sx={FILTER_GROUP_SX}>
            <Typography sx={FILTER_GROUP_LABEL_SX}>Date Range</Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ width: "100%" }}
            >
              <TextField
                label="From"
                type="date"
                size="small"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: dateTo || today }}
                sx={{ width: { xs: "100%", sm: 160 }, ...FILTER_INPUT_SX }}
              />
              <TextField
                label="To"
                type="date"
                size="small"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: dateFrom || undefined, max: today }}
                sx={{ width: { xs: "100%", sm: 160 }, ...FILTER_INPUT_SX }}
              />
            </Stack>
          </Box>

          {/* Actions */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ width: { xs: "100%", md: "auto" }, ml: { md: "auto" } }}
          >
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              sx={{
                borderRadius: 0.25,
                textTransform: "none",
                backgroundColor: "var(--primary)",
                boxShadow: "none",
                fontWeight: 600,
                width: { xs: "100%", sm: "auto" },
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              Apply Filters
            </Button>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              startIcon={<RestartAltIcon />}
              sx={{
                borderRadius: 0.25,
                textTransform: "none",
                borderColor: "var(--primary)",
                color: "var(--primary)",
                fontWeight: 600,
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                },
              }}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* All Exams table */}
      <Card
        sx={{
          borderRadius: 0.5,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
          py: { xs: 1.5, sm: 2.5, md: 3.125 },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 2.5, px: { xs: 1.5, sm: 2.5, md: 3.125 } }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: "#2c3e50",
              fontSize: { xs: 18, sm: 19, md: 20 },
            }}
          >
            All Exams ({filteredExams.length})
          </Typography>

          <TextField
            size="small"
            placeholder="Search exam name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: TEXT_SECONDARY }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: "100%", sm: 260 }, ...FILTER_INPUT_SX }}
          />
        </Stack>

        <TableContainer sx={{ borderRadius: 0, border: "1px solid #e0e0e0" }}>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                <TableCell
                  sx={{ fontWeight: 700, color: "#2c3e50" }}
                ></TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#2c3e50" }}>
                  Exam Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#2c3e50" }}>
                  Type
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: "#2c3e50", ...HIDE_ON_XS_SX }}
                >
                  Duration
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: "#2c3e50", ...HIDE_ON_XS_SX }}
                >
                  Questions
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#2c3e50" }}>
                  Completed
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#2c3e50" }}>
                  Score
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: "#2c3e50", ...HIDE_ON_XS_SX }}
                >
                  Attempt
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#2c3e50" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    Loading exams...
                  </TableCell>
                </TableRow>
              ) : paginatedExams.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ py: 4, color: TEXT_SECONDARY }}
                  >
                    No exams found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedExams.map((exam) => {
                  const resultsAvailable = isResultsAvailable(exam);
                  const resultsAvailableTimeString =
                    getResultsAvailableTime(exam);
                  const showRetake =
                    exam.canRetake ||
                    (exam.hasReachedRetakeLimit && exam.examType === "mock");
                  const showAttemptHistory = exam.examType !== "live";
                  const meta = TYPE_META[exam.examType];
                  const TypeIcon = meta.icon;

                  return (
                    <TableRow key={exam.examId} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center">
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: meta.bg,
                              color: meta.color,
                              borderRadius: 0.5,
                            }}
                          >
                            <TypeIcon fontSize="small" />
                          </Avatar>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: 14,
                              color: TEXT_PRIMARY,
                            }}
                          >
                            {exam.title}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 12.5, color: TEXT_SECONDARY }}
                          >
                            {exam.subject}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={meta.label}
                          size="small"
                          sx={{
                            backgroundColor: meta.bg,
                            color: meta.color,
                            fontWeight: 700,
                            fontSize: 11,
                            border: `1px solid ${meta.color}33`,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13.5, ...HIDE_ON_XS_SX }}>
                        {exam.duration} min
                      </TableCell>
                      <TableCell sx={{ fontSize: 13.5, ...HIDE_ON_XS_SX }}>
                        {exam.questions}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13.5 }}>
                        {exam.completedAt}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13.5 }}>
                        <Tooltip
                          title={
                            !resultsAvailable
                              ? `Score available at ${resultsAvailableTimeString}`
                              : ""
                          }
                          placement="top"
                        >
                          <span>
                            {resultsAvailable
                              ? `${exam.score}/${exam.points}`
                              : "-"}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ fontSize: 13.5, ...HIDE_ON_XS_SX }}>
                        {exam.attemptNumber}
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ flexWrap: "nowrap" }}
                        >
                          {showRetake && (
                            <Tooltip
                              title={
                                exam.hasReachedRetakeLimit &&
                                exam.examType === "mock"
                                  ? "Retake limit reached. Mock exams can only be retaken 2 times."
                                  : ""
                              }
                              placement="top"
                            >
                              <span>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  disabled={
                                    exam.hasReachedRetakeLimit ||
                                    retakeLoadingExamId === exam.examId
                                  }
                                  onClick={() =>
                                    takeExam(
                                      exam.attemptId,
                                      exam.examId,
                                      exam.examType,
                                    )
                                  }
                                  sx={{
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                    borderColor: "#d97706",
                                    color: "#d97706",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    "&:hover": {
                                      backgroundColor: "#fffbeb",
                                      borderColor: "#d97706",
                                    },
                                    "&.Mui-disabled": {
                                      borderColor: "#e2e8f0",
                                      color: "#cbd5e1",
                                    },
                                  }}
                                >
                                  {retakeLoadingExamId === exam.examId
                                    ? "Loading..."
                                    : "Retake"}
                                </Button>
                              </span>
                            </Tooltip>
                          )}

                          <Tooltip
                            title={
                              !resultsAvailable
                                ? `Results available at ${resultsAvailableTimeString}`
                                : ""
                            }
                            placement="top"
                          >
                            <span>
                              <Button
                                size="small"
                                variant="contained"
                                disabled={!resultsAvailable}
                                onClick={() => viewResults(exam.attemptId)}
                                sx={{
                                  textTransform: "none",
                                  whiteSpace: "nowrap",
                                  backgroundColor: !resultsAvailable
                                    ? "#ccc"
                                    : "var(--primary)",
                                  color: "#fff",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  boxShadow: "none",
                                  "&:hover": {
                                    backgroundColor: !resultsAvailable
                                      ? "#ccc"
                                      : "var(--primary)",
                                    opacity: 0.9,
                                    boxShadow: "none",
                                  },
                                  "&.Mui-disabled": {
                                    backgroundColor: "#e2e8f0",
                                    color: "#94a3b8",
                                  },
                                }}
                              >
                                View Results
                              </Button>
                            </span>
                          </Tooltip>

                          {showAttemptHistory && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => openAttemptHistory(exam)}
                              sx={{
                                textTransform: "none",
                                whiteSpace: "nowrap",
                                borderColor: "#2563eb",
                                color: "#2563eb",
                                fontSize: 12,
                                fontWeight: 600,
                                "&:hover": {
                                  backgroundColor: "#eff6ff",
                                  borderColor: "#2563eb",
                                },
                              }}
                            >
                              Attempt History
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredExams.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: MENU_ITEM_SX,
              },
            },
          }}
          sx={{
            "& .MuiTablePagination-toolbar": {
              flexWrap: "wrap",
              rowGap: 1,
              px: { xs: 1.5, sm: 2.5, md: 3.125 },
              justifyContent: { xs: "center", sm: "flex-end" },
            },
            "& .MuiTablePagination-spacer": {
              display: { xs: "none", sm: "block" },
            },
            "& .MuiTablePagination-select": {
              color: "var(--primary)",
              fontWeight: 600,
            },
            "& .MuiTablePagination-selectIcon": {
              color: "var(--primary)",
            },
            "& .MuiTablePagination-actions": {
              width: { xs: "100%", sm: "auto" },
              display: "flex",
              justifyContent: "center",
              mt: { xs: 0.5, sm: 0 },
            },
            "& .MuiTablePagination-actions button": {
              color: "var(--primary)",
            },
            "& .MuiTablePagination-actions button.Mui-disabled": {
              color: "#cbd5e1",
            },
          }}
        />
      </Card>

      {/* Attempt History Modal */}
      <AttemptHistoryModal
        open={attemptHistoryOpen}
        examName={selectedExam?.title || ""}
        examId={selectedExam?.examId || 0}
        onClose={closeAttemptHistory}
      />
    </Box>
  );
}
