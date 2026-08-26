"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  Skeleton,
  IconButton,
  Pagination,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PublicIcon from "@mui/icons-material/Public";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import { FaHistory, FaFlask, FaChartLine, FaLeaf } from "react-icons/fa";

/* ----------------------------------------------------------------------- */
/*  Theme tokens - matched to the reference design                          */
/* ----------------------------------------------------------------------- */
const PAGE_BG = "#f6f8fa";
const CARD_BG = "#ffffff";
const BORDER = "#e5e9ee";
const TEXT_PRIMARY = "#182230";
const TEXT_SECONDARY = "#66727e";
const PRIMARY_GREEN = "#178a53";
const PRIMARY_GREEN_DARK = "#0f6e40";
const PRIMARY_GREEN_LIGHT = "#e8f6ee";

/* ----------------------------------------------------------------------- */
/*  Subject icon/color styling                                              */
/* ----------------------------------------------------------------------- */
// Keyed by the EXACT subject string as stored in pyq_exam_meta.subject (and
// therefore returned by /api/students/exams/pyq/filters) - not by an
// abbreviated tab label. Subjects/topics/difficulties/answer-types are all
// sourced live from that table now (see fetch effects below), so this map
// only controls presentation (icon + color); it no longer needs to double
// as a lookup key for a second, separately-maintained static data set.
// Any subject the API returns that isn't listed here just falls back to
// DEFAULT_SUBJECT_META instead of being hidden.
const SUBJECT_META: Record<string, { icon: React.ReactNode; color: string }> = {
  Environment: { icon: <FaLeaf size={18} />, color: "#1a8a45" },
  Geography: { icon: <PublicIcon sx={{ fontSize: 18 }} />, color: "#1877d1" },
  "Science & Technology": {
    icon: <SchoolIcon sx={{ fontSize: 18 }} />,
    color: "#7c3aed",
  },
  Polity: {
    icon: <AccountBalanceIcon sx={{ fontSize: 18 }} />,
    color: "#c9372c",
  },
  Economics: { icon: <FaChartLine size={16} />, color: "#b9791a" },
  "Current Affairs": { icon: <FaFlask size={16} />, color: "#0e7490" },
  History: { icon: <FaHistory size={16} />, color: "#a16207" },
  // NEW - General Knowledge previously had no entry here, so it always fell
  // back to DEFAULT_SUBJECT_META (the plain gray ClassOutlinedIcon). Key
  // matches the post-normalizeSubjectKey value (i.e. after the "PYQ-"
  // prefix, if any, is stripped) - see normalizeSubjectKey() below.
  "General Knowledge": {
    icon: <QuizOutlinedIcon sx={{ fontSize: 18 }} />,
    color: "#0891b2",
  },
};
const DEFAULT_SUBJECT_META = {
  icon: <ClassOutlinedIcon sx={{ fontSize: 18 }} />,
  color: TEXT_SECONDARY,
};

// The values actually stored in pyq_exam_meta.subject come back with a
// "PYQ-" prefix (e.g. "PYQ-Environment"), which doesn't match SUBJECT_META's
// keys and made every subject fall back to the generic icon. This strips
// that prefix ONLY for icon/label lookup and display - it must NOT be
// applied to the value used for API calls (dbSubjects / selectedSubject
// stay as the exact raw DB string), since /filters?subject=X has to match
// pyq_exam_meta.subject byte-for-byte.
//
// Some rows also use a naming variant that doesn't match the curated map's
// key ("Indian Polity" vs "Polity"), or - in one case - a straight typo
// that's already sitting in the DB ("Histroy" instead of "History"). This
// alias table canonicalizes those AFTER the prefix strip, purely for
// icon/label purposes.
//
// The "Histroy" entry is a stopgap for existing data - the durable fix is
// still to correct pyq_exam_meta.subject at the source (wherever the PYQ
// exam creation flow writes it), so future rows don't need a new alias
// added here every time a subject is typed slightly differently.
const SUBJECT_ALIASES: Record<string, string> = {
  "Indian Polity": "Polity",
  Histroy: "History", // fixes the misspelled DB row until it's corrected at the source
};

function normalizeSubjectKey(raw: string): string {
  const stripped = raw.replace(/^pyq[\s-]*/i, "").trim();
  return SUBJECT_ALIASES[stripped] || stripped;
}

// Purely cosmetic: shortens a (normalized) subject string for display on
// the tab/sidebar heading only. The raw DB string (dbSubjects /
// selectedSubject) is still what's used for API calls - this can be
// extended freely without touching any matching logic.
const DISPLAY_LABEL_OVERRIDES: Record<string, string> = {
  "Science & Technology": "Science & Tech.",
};
function getSubjectLabel(subjectName: string): string {
  const normalized = normalizeSubjectKey(subjectName);
  return DISPLAY_LABEL_OVERRIDES[normalized] || normalized;
}

const FILTER_TABS: { key: FilterType; label: string }[] = [
  { key: "topic", label: "Topic Wise" },
  { key: "answerType", label: "Answer Type Wise" },
  { key: "difficulty", label: "Difficulty Wise" },
];

type FilterType = "topic" | "difficulty" | "answerType";

interface Exam {
  id: number;
  title: string;
  examCategory: string;
  year: string;
  duration: string;
  totalQuestions: number;
  totalMarks: number;
  difficulty: string;
  setNumber?: number;
  // The id of the CURRENT student's most recent attempt at THIS exam,
  // resolved from the /pyq API response for that exam. null/undefined
  // means never attempted. See resolveLatestAttemptId() for how this is
  // derived - it supports either a single attempt-id field on the exam
  // record, or a full `attempts` array (picks the newest by timestamp).
  apiAttemptId?: number | string | null;
}

const PAGE_SIZE = 5;
// How many sidebar options (topics / answer types / difficulty levels) to show
// before collapsing the rest behind "View All".
const VISIBLE_OPTIONS_COUNT = 5;

/* ----------------------------------------------------------------------- */
/*  Attempt-id resolution                                                   */
/* ----------------------------------------------------------------------- */
// Backends model "a student's attempts at an exam" in different shapes.
// This function is defensive about that instead of assuming one exact
// field name, which was the root cause of attempts silently not being
// picked up after a page reload. It supports two shapes:
//
//  A) A pre-resolved single field on the exam record itself, e.g.
//     { last_attempt_id: 55 } / { latest_attempt_id: 55 } / etc.
//
//  B) A full attempts array per exam, e.g.
//     { attempts: [{ id: 12, created_at: "..." }, { id: 55, created_at: "..." }] }
//     In this case we explicitly sort by timestamp and take the newest -
//     we never assume the array is already in order.
//
// If your API returns something that doesn't match either shape, tell me
// the actual JSON for one exam and I'll wire this to match exactly instead
// of guessing.
function resolveLatestAttemptId(examRaw: any): number | string | null {
  const attemptsArray: any[] | undefined =
    examRaw.attempts ?? examRaw.exam_attempts ?? examRaw.student_attempts;

  if (Array.isArray(attemptsArray) && attemptsArray.length > 0) {
    const withTimestamps = attemptsArray.map((a) => ({
      id: a.id ?? a.attempt_id ?? a.attemptId,
      ts: new Date(
        a.created_at ??
          a.createdAt ??
          a.attempted_at ??
          a.started_at ??
          a.updated_at ??
          0,
      ).getTime(),
    }));
    withTimestamps.sort((a, b) => b.ts - a.ts);
    const newest = withTimestamps[0];
    if (newest?.id != null) return newest.id;
  }

  return (
    examRaw.last_attempt_id ??
    examRaw.latest_attempt_id ??
    examRaw.latestAttemptId ??
    examRaw.attempt_id ??
    examRaw.attemptId ??
    null
  );
}

/* ----------------------------------------------------------------------- */
/*  Auth helpers                                                            */
/* ----------------------------------------------------------------------- */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export default function PreviousYearQuestionsPage() {
  const router = useRouter();

  const [examsLoading, setExamsLoading] = useState(false);
  const [startingExamId, setStartingExamId] = useState<number | null>(null);

  // ---- Subjects: fetched from /api/students/exams/pyq/filters (no
  // subject param) instead of a hardcoded array, so a subject only ever
  // appears here if it actually has a live PYQ exam behind it. ----
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [dbSubjects, setDbSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const [activeFilter, setActiveFilter] = useState<FilterType>("topic");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  // ---- Topic / difficulty / answer-type options for the current subject -
  // fetched from the same /filters endpoint (with ?subject=) whenever
  // selectedSubject changes. Replaces the old static TOPICS_BY_SUBJECT /
  // DIFFICULTY_LEVELS / ANSWER_TYPES maps. ----
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [topicsForSubject, setTopicsForSubject] = useState<string[]>([]);
  const [difficultiesForSubject, setDifficultiesForSubject] = useState<
    string[]
  >([]);
  const [answerTypesForSubject, setAnswerTypesForSubject] = useState<string[]>(
    [],
  );

  const [exams, setExams] = useState<Exam[]>([]);
  const [page, setPage] = useState(1);

  // Controls whether the sidebar list (topics / answer types / difficulty)
  // shows everything or is collapsed to the first VISIBLE_OPTIONS_COUNT items.
  const [showAllOptions, setShowAllOptions] = useState(false);

  // Optional per-topic exam counts, e.g. { "Ecology & Ecosystem": 245 }.
  // Populate this from your own metadata endpoint if you have one -
  // the sidebar simply hides the count badge when it isn't available.
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});

  // Session-level cache of exams started just now, keyed by examId. This
  // exists only so the button flips to "Retake" / "View Result" instantly
  // after clicking Start Exam, without waiting for the topic list to be
  // re-fetched. The real, persistent source of truth is each exam's own
  // apiAttemptId returned by /api/students/exams/pyq - this cache just fills
  // the gap between "attempt just created" and "list re-fetched from server".
  //
  // IMPORTANT: this is scoped to the CURRENT auth token. Previously the
  // localStorage key had no student identity attached to it at all, which
  // meant on a shared browser (or after logging out and a different
  // student logging in) the new student would see the previous student's
  // attempted/retake state, and the View Result icon could point at
  // someone else's attemptId. We now store the token alongside the map and
  // wipe it if the token doesn't match on load.
  const [attemptedMap, setAttemptedMap] = useState<
    Record<number, { attemptId: number | string }>
  >({});
  const ATTEMPTED_MAP_STORAGE_KEY = "pyq_attempted_map_v2";

  useEffect(() => {
    try {
      const token = getAuthToken();
      const stored = localStorage.getItem(ATTEMPTED_MAP_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token === token && parsed?.map) {
          setAttemptedMap(parsed.map);
        } else {
          // Different (or no) student than whoever last wrote this cache -
          // discard it rather than risk leaking their attempt state.
          localStorage.removeItem(ATTEMPTED_MAP_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to read attempted-exam cache:", error);
    }
  }, []);

  const persistAttemptedMap = (
    map: Record<number, { attemptId: number | string }>,
  ) => {
    try {
      const token = getAuthToken();
      localStorage.setItem(
        ATTEMPTED_MAP_STORAGE_KEY,
        JSON.stringify({ token, map }),
      );
    } catch (error) {
      console.error("Failed to persist attempted-exam cache:", error);
    }
  };

  // Resolves the attempt id to use for a given exam: prefer the just-started
  // session cache (freshest), fall back to whatever the /pyq API already
  // reported for that exam. Returns null/undefined if never attempted.
  const getAttemptId = (exam: Exam): number | string | null | undefined =>
    attemptedMap[exam.id]?.attemptId ?? exam.apiAttemptId;

  const optionsForFilter =
    activeFilter === "topic"
      ? topicsForSubject
      : activeFilter === "difficulty"
        ? difficultiesForSubject
        : answerTypesForSubject;

  const hasMoreOptions = optionsForFilter.length > VISIBLE_OPTIONS_COUNT;
  const displayedOptions = showAllOptions
    ? optionsForFilter
    : optionsForFilter.slice(0, VISIBLE_OPTIONS_COUNT);
  const optionLabel =
    activeFilter === "topic"
      ? "Topics"
      : activeFilter === "difficulty"
        ? "Difficulty Levels"
        : "Answer Types";

  /* ------------------------------------------------------------------- */
  /*  Fetch: distinct PYQ subjects (once, on mount)                       */
  /* ------------------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setSubjectsLoading(true);
      try {
        const token = getAuthToken();
        if (!token) {
          alert("Your session has expired. Please log in again.");
          router.push("/");
          return;
        }

        const res = await fetch("/api/students/exams/pyq/filters", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          alert("Your session has expired. Please log in again.");
          router.push("/");
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        if (data.success && Array.isArray(data.subjects)) {
          // De-dupe by normalized key (after PYQ- prefix strip + alias
          // resolution) so a genuine duplicate/misspelled row in the DB
          // (e.g. two "PYQ-History" rows, or "PYQ-History" + "PYQ-Histroy")
          // doesn't render as two separate tabs. This is a display-layer
          // safety net only - the real fix is deduping/correcting the
          // underlying subjects / pyq_exam_meta rows at the source. Note
          // that whichever raw variant is encountered first "wins" and is
          // the one used for subsequent API calls under that tab - if
          // exams are split across both DB variants, some may not show up
          // until the DB itself is cleaned up.
          const seen = new Set<string>();
          const deduped = data.subjects.filter((s: string) => {
            const key = normalizeSubjectKey(s).toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          setDbSubjects(deduped);
          setSelectedSubject((prev) => prev || deduped[0] || "");
        } else {
          setDbSubjects([]);
        }
      } catch (error) {
        console.error("Failed to fetch PYQ subjects:", error);
        if (!cancelled) setDbSubjects([]);
      } finally {
        if (!cancelled) setSubjectsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ------------------------------------------------------------------- */
  /*  Fetch: topics/difficulties/answerTypes for the selected subject     */
  /* ------------------------------------------------------------------- */
  useEffect(() => {
    if (!selectedSubject) return;
    let cancelled = false;

    (async () => {
      setOptionsLoading(true);
      try {
        const token = getAuthToken();
        if (!token) return;

        const res = await fetch(
          `/api/students/exams/pyq/filters?subject=${encodeURIComponent(selectedSubject)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await res.json();
        if (cancelled) return;

        const topics = data.success ? data.topics || [] : [];
        const difficulties = data.success ? data.difficulties || [] : [];
        const answerTypes = data.success ? data.answerTypes || [] : [];

        setTopicsForSubject(topics);
        setDifficultiesForSubject(difficulties);
        setAnswerTypesForSubject(answerTypes);

        // Reset selection to the first topic whenever the subject changes,
        // so the content area is never left empty (matches previous design).
        setActiveFilter("topic");
        setSelectedValue(topics[0] || null);
        setPage(1);
        setShowAllOptions(false);
      } catch (error) {
        console.error("Failed to fetch PYQ filter options:", error);
        if (!cancelled) {
          setTopicsForSubject([]);
          setDifficultiesForSubject([]);
          setAnswerTypesForSubject([]);
          setSelectedValue(null);
        }
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedSubject]);

  // When the filter category (Topic/Difficulty/Answer Type tab) changes,
  // default to its first already-loaded option.
  useEffect(() => {
    const list =
      activeFilter === "topic"
        ? topicsForSubject
        : activeFilter === "difficulty"
          ? difficultiesForSubject
          : answerTypesForSubject;
    setSelectedValue(list[0] || null);
    setPage(1);
    setShowAllOptions(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  useEffect(() => {
    if (selectedSubject && activeFilter && selectedValue) {
      handleSearchAPI(selectedSubject, activeFilter, selectedValue);
    }
  }, [selectedSubject, activeFilter, selectedValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchAPI = async (
    subject: string,
    type: string,
    value: string,
  ) => {
    setExamsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Your session has expired. Please log in again.");
        router.push("/");
        return;
      }

      const apiTypeMap: Record<string, string> = {
        topic: "topic",
        difficulty: "difficulty",
        answerType: "answer_type",
      };
      const queryType = apiTypeMap[type] || type;

      const response = await fetch(
        `/api/students/exams/pyq?subject=${encodeURIComponent(subject)}&type=${encodeURIComponent(queryType)}&value=${encodeURIComponent(value)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 401) {
        alert("Your session has expired. Please log in again.");
        router.push("/");
        return;
      }

      const data = await response.json();
      if (data.success) {
        const transformedExams: Exam[] = data.exams.map((exam: any) => ({
          id: exam.exam_id,
          title: exam.exam_title,
          examCategory: exam.exam_category || "Prelims",
          year: exam.year?.toString() || extractYear(exam.exam_title),
          duration: `${exam.duration_minutes} mins`,
          totalQuestions: exam.question_count,
          totalMarks: exam.total_marks,
          difficulty: exam.difficulty || "Medium",
          setNumber: exam.set_number,
          apiAttemptId: resolveLatestAttemptId(exam),
        }));
        setExams(transformedExams);
      } else {
        setExams([]);
      }
    } catch (error) {
      console.error("Failed to fetch exams:", error);
      setExams([]);
    } finally {
      setExamsLoading(false);
      setPage(1);
    }
  };

  const extractYear = (title: string) => {
    const match = title?.match(/\d{4}/);
    return match ? match[0] : "-";
  };

  const handleStartExam = async (
    examId: number,
    examType: string = "practice",
  ) => {
    const token = getAuthToken();

    if (!token) {
      alert("Your session has expired. Please log in again.");
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

      // If the API errored, it may not return JSON at all (e.g. a 404/500
      // HTML page) - reading that as JSON throws and got silently swallowed
      // before. Read as text first and only parse when it looks like JSON,
      // so we can show a real error message instead of a generic one.
      const raw = await response.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        console.error(
          "Start-exam response was not JSON:",
          response.status,
          raw,
        );
        alert(
          `Could not start the exam (server returned status ${response.status}). Check the console/network tab for details.`,
        );
        setStartingExamId(null);
        return;
      }

      const newAttemptId =
        data?.attemptId ??
        data?.attempt_id ??
        data?.data?.attemptId ??
        data?.data?.attempt_id;

      if (!response.ok || !data?.success || newAttemptId == null) {
        console.error("Start-exam failed:", response.status, data);
        alert(
          data?.message || `Failed to start exam (status ${response.status}).`,
        );
        setStartingExamId(null);
        return;
      }

      // Mark the exam as attempted immediately so the row reflects the new
      // state (Retake / View Result) as soon as the student returns to this
      // page - stored in attemptedMap (not on the exam object itself) so it
      // stays correct across topic/subject switches without a re-fetch, and
      // persisted to localStorage (scoped to this student's token) so it
      // survives a reload right away too. Once the topic list is re-fetched
      // from the server, the exam's own apiAttemptId field takes over as
      // the source of truth (see getAttemptId).
      setAttemptedMap((prev) => {
        const next = {
          ...prev,
          [examId]: { attemptId: newAttemptId },
        };
        persistAttemptedMap(next);
        return next;
      });

      if (examType === "mock" || examType === "live") {
        try {
          const elem = document.documentElement;
          if (elem.requestFullscreen) await elem.requestFullscreen();
        } catch (error) {
          console.error("Fullscreen failed:", error);
        }
      }

      router.push(
        `/student-pages/exam_taking?examId=${examId}&attemptId=${newAttemptId}`,
      );
    } catch (error) {
      // Genuine network-level failure (server unreachable, CORS, etc.)
      console.error("Failed to start exam:", error);
      alert(
        "Failed to start exam. Please check your connection and try again.",
      );
      setStartingExamId(null);
    }
  };

  // Takes the student to the result/review page (exam_res_rev) for their
  // most recent attempt of this exam, resolved via getAttemptId (session
  // cache first, then the exam's own apiAttemptId from the /pyq response).
  // This is only ever wired to a visible icon, which only renders when
  // isAttempted is true - so attemptId should always be present here. We
  // still guard defensively instead of falling back to a URL with no
  // attemptId, which previously could send a student to the result page
  // with nothing to actually show.
  const handleViewResult = (exam: Exam) => {
    const attemptId = getAttemptId(exam);
    if (attemptId == null) {
      console.error(
        "View Result clicked with no resolvable attemptId for exam",
        exam.id,
      );
      alert(
        "Couldn't find your latest attempt for this exam. Please refresh and try again.",
      );
      return;
    }
    router.push(
      `/student-pages/exam_res_rev?examId=${exam.id}&attemptId=${attemptId}`,
    );
  };

  const stats = useMemo(() => {
    if (!exams.length) return { questions: 0, examsCount: 0 };
    const questions = exams.reduce(
      (sum, e) => sum + (e.totalQuestions || 0),
      0,
    );
    return { questions, examsCount: exams.length };
  }, [exams]);

  // Reactive merge: an exam counts as "attempted" the moment it has any
  // attempt id - whether that came from this exam's own apiAttemptId field
  // in the /pyq response, or from the session cache right after starting it.
  // Recomputes whenever attemptedMap changes, so a freshly started exam
  // flips to "Retake" / shows "View Result" immediately, no re-fetch needed.
  const displayExams = useMemo(
    () =>
      exams.map((exam) => ({
        ...exam,
        isAttempted: getAttemptId(exam) != null,
      })),
    [exams, attemptedMap], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const totalPages = Math.max(1, Math.ceil(displayExams.length / PAGE_SIZE));
  const visibleExams = displayExams.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const activeSubjectMeta =
    SUBJECT_META[normalizeSubjectKey(selectedSubject)] || DEFAULT_SUBJECT_META;

  // Exam / Questions / Action / Result. The same template is reused for the
  // header row and every data row so the values line up under the correct
  // column headers.
  const TABLE_GRID_COLUMNS = { xs: "1fr", sm: "2.1fr 0.9fr 1.3fr 0.7fr" };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1.25, md: 1.5 },
        minHeight: "100vh",
        px: { xs: 1.25, sm: 2, md: 2.5 },
        pt: { xs: 0.5, md: 0.75 },
        pb: { xs: 2, md: 2.5 },
        background: PAGE_BG,
      }}
    >
      {/* ---------------- Hero banner ---------------- */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          py: { xs: 1, md: 1.25 },
        }}
      >
        <Box sx={{ minWidth: 220, flex: "1 1 260px" }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.35rem", sm: "1.55rem" },
              color: TEXT_PRIMARY,
              mb: 0.5,
            }}
          >
            Previous Year Questions
          </Typography>
          <Typography
            sx={{ color: TEXT_SECONDARY, fontSize: "0.88rem", maxWidth: 360 }}
          >
            Practice PYQs subject-wise, sharpen your concepts and crack UPSC
            with confidence.
          </Typography>
        </Box>

        {/* Illustration - served from /public/Images/login/book-image.png */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            width: 190,
            height: 140,
            position: "relative",
            flexShrink: 0,
          }}
        >
          <Image
            src="/Images/login/book-image.png"
            alt="Previous Year Questions"
            fill
            style={{ objectFit: "contain" }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                bgcolor: PRIMARY_GREEN_LIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: PRIMARY_GREEN,
                flexShrink: 0,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 17 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: TEXT_PRIMARY,
                }}
              >
                Free for All Users
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: TEXT_SECONDARY }}>
                Unlimited Access
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                bgcolor: PRIMARY_GREEN_LIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: PRIMARY_GREEN,
                flexShrink: 0,
              }}
            >
              <DescriptionOutlinedIcon sx={{ fontSize: 17 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: TEXT_PRIMARY,
                }}
              >
                Subject-wise PYQs
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: TEXT_SECONDARY }}>
                Topic, Type & Difficulty Wise
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ---------------- How it works (horizontal, below subjects) ---------------- */}
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${BORDER}`,
          borderRadius: 1,
          p: { xs: 2, sm: 2.25 },
          bgcolor: CARD_BG,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <HelpOutlineIcon sx={{ fontSize: 17, color: TEXT_SECONDARY }} />
          <Typography
            sx={{ fontWeight: 700, fontSize: "0.85rem", color: TEXT_PRIMARY }}
          >
            How it works?
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2, md: 0 },
          }}
        >
          {[
            {
              title: "Choose a Subject",
              desc: "Select a subject from the list above.",
            },
            {
              title: "Choose a Mode",
              desc: "Pick Topic Wise, Answer Type Wise or Difficulty Wise.",
            },
            {
              title: "Select a Topic",
              desc: "Browse topics and choose what to practice.",
            },
            {
              title: "Take the PYQ Test",
              desc: "Attempt questions and evaluate your performance.",
            },
          ].map((step, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                gap: 1,
                flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 0" },
                px: { md: 1.5 },
                borderLeft: { md: i === 0 ? "none" : `1px solid ${BORDER}` },
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 1.25,
                  bgcolor: PRIMARY_GREEN_LIGHT,
                  color: PRIMARY_GREEN,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 14 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    color: TEXT_PRIMARY,
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: TEXT_SECONDARY,
                    lineHeight: 1.35,
                  }}
                >
                  {step.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>

      {/* ---------------- Subject tabs (equal-width row) ---------------- */}
      {subjectsLoading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 1.25,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={78}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      ) : dbSubjects.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            border: `1px dashed ${BORDER}`,
            borderRadius: 1,
            p: 3,
            bgcolor: CARD_BG,
            textAlign: "center",
          }}
        >
          <Typography sx={{ color: TEXT_SECONDARY, fontSize: "0.88rem" }}>
            No PYQ subjects are available yet. Please check back soon.
          </Typography>
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: `repeat(${dbSubjects.length}, 1fr)`,
            },
            gap: 1.25,
          }}
        >
          {dbSubjects.map((subjectName) => {
            const active = subjectName === selectedSubject;
            const meta =
              SUBJECT_META[normalizeSubjectKey(subjectName)] ||
              DEFAULT_SUBJECT_META;
            return (
              <Card
                key={subjectName}
                onClick={() => setSelectedSubject(subjectName)}
                elevation={0}
                sx={{
                  cursor: "pointer",
                  px: 1.5,
                  py: 1.75,
                  borderRadius: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.75,
                  border: `1.5px solid ${active ? PRIMARY_GREEN : BORDER}`,
                  bgcolor: active ? PRIMARY_GREEN_LIGHT : CARD_BG,
                  transition: "0.15s",
                  "&:hover": { borderColor: PRIMARY_GREEN },
                }}
              >
                <Box sx={{ color: meta.color, display: "flex" }}>
                  {meta.icon}
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: TEXT_PRIMARY,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getSubjectLabel(subjectName)}
                </Typography>
              </Card>
            );
          })}
        </Box>
      )}

      {/* ---------------- Main 2-column layout ---------------- */}
      {selectedSubject && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "260px 1fr" },
            gap: { xs: 1.5, lg: 2 },
            alignItems: "start",
          }}
        >
          {/* -------- Sidebar: filter type + topic list -------- */}
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: 1,
              p: 2,
              bgcolor: CARD_BG,
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}
            >
              <Box sx={{ color: activeSubjectMeta.color }}>
                {activeSubjectMeta.icon}
              </Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: "1rem", color: TEXT_PRIMARY }}
              >
                {getSubjectLabel(selectedSubject)}
              </Typography>
            </Box>
            <Typography
              sx={{ color: TEXT_SECONDARY, fontSize: "0.78rem", mb: 2 }}
            >
              Choose how you want to practice
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2.5 }}>
              {FILTER_TABS.map((tab) => (
                <Chip
                  key={tab.key}
                  label={tab.label}
                  onClick={() => setActiveFilter(tab.key)}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    borderRadius: 1,
                    bgcolor:
                      activeFilter === tab.key ? PRIMARY_GREEN_LIGHT : PAGE_BG,
                    color:
                      activeFilter === tab.key
                        ? PRIMARY_GREEN_DARK
                        : TEXT_SECONDARY,
                    border: `1px solid ${activeFilter === tab.key ? PRIMARY_GREEN : "transparent"}`,
                  }}
                />
              ))}
            </Box>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: 0.5,
                color: TEXT_SECONDARY,
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              {activeFilter === "topic"
                ? "Topics"
                : activeFilter === "difficulty"
                  ? "Difficulty"
                  : "Answer Type"}
            </Typography>

            {optionsLoading ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rounded"
                    height={36}
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            ) : optionsForFilter.length === 0 ? (
              <Typography
                sx={{ color: TEXT_SECONDARY, fontSize: "0.8rem", py: 1 }}
              >
                No {optionLabel.toLowerCase()} available for this subject yet.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  maxHeight: showAllOptions ? 420 : "none",
                  overflowY: showAllOptions ? "auto" : "visible",
                }}
              >
                {displayedOptions.map((option) => {
                  const active = option === selectedValue;
                  const count =
                    activeFilter === "topic" ? topicCounts[option] : undefined;
                  return (
                    <Box
                      key={option}
                      onClick={() => setSelectedValue(option)}
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        border: `1px solid ${active ? PRIMARY_GREEN : "transparent"}`,
                        bgcolor: active ? PRIMARY_GREEN_LIGHT : "transparent",
                        "&:hover": {
                          bgcolor: active ? PRIMARY_GREEN_LIGHT : PAGE_BG,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: active ? 700 : 500,
                          color: active ? PRIMARY_GREEN_DARK : TEXT_PRIMARY,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {option}
                      </Typography>
                      {count !== undefined && (
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: TEXT_SECONDARY,
                            flexShrink: 0,
                          }}
                        >
                          {count}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}

            {hasMoreOptions && (
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={() => setShowAllOptions((prev) => !prev)}
                sx={{
                  mt: 2,
                  textTransform: "none",
                  borderRadius: 2,
                  borderColor: BORDER,
                  color: TEXT_PRIMARY,
                }}
                startIcon={<ClassOutlinedIcon sx={{ fontSize: 16 }} />}
              >
                {showAllOptions ? "View Less" : `View All ${optionLabel}`}
              </Button>
            )}
          </Card>

          {/* -------- Content: selected topic + table -------- */}
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: 2.5,
              p: { xs: 1.75, sm: 2.25 },
              bgcolor: CARD_BG,
            }}
          >
            {/* Topic header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.25,
                  minWidth: 200,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setSelectedValue(null)}
                  sx={{
                    border: `1px solid ${BORDER}`,
                    borderRadius: 1.5,
                    mt: 0.25,
                  }}
                >
                  <ArrowBackIosNewIcon sx={{ fontSize: 13 }} />
                </IconButton>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {selectedValue || "Select an option"}
                  </Typography>
                  <Typography
                    sx={{ color: TEXT_SECONDARY, fontSize: "0.76rem" }}
                  >
                    Practice questions from previous years on{" "}
                    {selectedValue || "this selection"}
                  </Typography>
                </Box>
              </Box>

              {/* Only the counts that matter for this selection - no filter/sort controls */}
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 2, sm: 2.5 },
                  flexWrap: "wrap",
                }}
              >
                <StatBlock label="Questions" value={stats.questions} />
                <StatBlock label="Exams" value={stats.examsCount} />
              </Box>
            </Box>

            {/* Table */}
            {examsLoading ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rounded"
                    height={64}
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            ) : visibleExams.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {/* header row - desktop only */}
                <Box
                  sx={{
                    display: { xs: "none", sm: "grid" },
                    gridTemplateColumns: TABLE_GRID_COLUMNS,
                    columnGap: 1.5,
                    px: 1.5,
                    py: 1,
                    color: TEXT_SECONDARY,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.3,
                  }}
                >
                  <Box>Exam</Box>
                  <Box>Questions</Box>
                  <Box>Action</Box>
                  <Box>Result</Box>
                </Box>

                {visibleExams.map((exam) => {
                  const isStarting = startingExamId === exam.id;
                  return (
                    <Box
                      key={exam.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: TABLE_GRID_COLUMNS,
                        columnGap: 1.5,
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: { xs: 1, sm: 1.5 },
                        px: 1.5,
                        py: 1.5,
                        borderTop: `1px solid ${BORDER}`,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.88rem",
                            color: TEXT_PRIMARY,
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          {exam.title}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.75rem", color: TEXT_SECONDARY }}
                        >
                          {exam.examCategory}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{ fontSize: "0.82rem", color: TEXT_PRIMARY }}
                      >
                        {exam.totalQuestions} Questions
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          disabled={isStarting}
                          onClick={() => handleStartExam(exam.id, "practice")}
                          sx={{
                            bgcolor: PRIMARY_GREEN,
                            "&:hover": { bgcolor: PRIMARY_GREEN_DARK },
                            textTransform: "none",
                            borderRadius: 1,
                            fontWeight: 600,
                            px: 2,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {isStarting
                            ? "Starting..."
                            : exam.isAttempted
                              ? "Retake Exam"
                              : "Start Exam"}
                        </Button>
                      </Box>

                      {/* Result - only shown once the student has attempted this
                          exam at least once; opens the review page for their
                          latest attempt (resolved from attemptedMap / apiAttemptId). */}
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {exam.isAttempted ? (
                          <Tooltip title="View Result">
                            <IconButton
                              size="small"
                              onClick={() => handleViewResult(exam)}
                              sx={{
                                border: `1px solid ${PRIMARY_GREEN}`,
                                borderRadius: 2,
                                color: PRIMARY_GREEN_DARK,
                                "&:hover": { bgcolor: PRIMARY_GREEN_LIGHT },
                              }}
                            >
                              <VisibilityIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography
                            sx={{ fontSize: "0.78rem", color: TEXT_SECONDARY }}
                          >
                            -
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}

                {totalPages > 1 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_, value) => setPage(value)}
                      shape="rounded"
                      size="small"
                      sx={{
                        "& .Mui-selected": {
                          bgcolor: `${PRIMARY_GREEN} !important`,
                          color: "#fff",
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  borderRadius: 3,
                  border: `1px dashed ${BORDER}`,
                }}
              >
                <Typography sx={{ color: TEXT_SECONDARY, fontSize: "0.9rem" }}>
                  {selectedValue
                    ? "No papers found for this selection."
                    : "Please select an option to see papers."}
                </Typography>
              </Box>
            )}
          </Card>
        </Box>
      )}

      {/* ---------------- Footer strip ---------------- */}
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2.5,
          bgcolor: PRIMARY_GREEN_LIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <CardGiftcardIcon sx={{ color: PRIMARY_GREEN, fontSize: 20 }} />
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: PRIMARY_GREEN_DARK,
            fontWeight: 600,
          }}
        >
          All PYQs are completely free for registered users.
        </Typography>
      </Box>
    </Box>
  );
}

/* ----------------------------------------------------------------------- */
/*  Small presentational helpers                                            */
/* ----------------------------------------------------------------------- */

function StatBlock({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Box sx={{ textAlign: "center", minWidth: 64 }}>
      <Typography
        sx={{ fontWeight: 800, fontSize: "1.05rem", color: TEXT_PRIMARY }}
      >
        {value}
      </Typography>
      <Typography
        sx={{ fontSize: "0.7rem", color: TEXT_SECONDARY, whiteSpace: "nowrap" }}
      >
        {label}
      </Typography>
    </Box>
  );
}