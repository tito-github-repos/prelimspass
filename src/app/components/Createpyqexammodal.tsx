"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  Tooltip,
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import * as XLSX from "xlsx";

type ExamType = "practice" | "mock" | "live";
type FilterType = "topic" | "difficulty" | "answer_type";

interface Topic {
  topic_id: number;
  topic_name: string;
  is_pyq?: boolean;
}

interface Subject {
  subject_id: number;
  subject_name: string;
  is_pyq: boolean;
  topics: Topic[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Static lists - no DB table for these, matches the student-facing
// PreviousYearQuestionsPage exactly so exam tags line up with what
// students filter by.
const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];
const ANSWER_TYPES = [
  "Single Word",
  "Single Sentence",
  "Match the Pairs",
  "Both, Neither",
  "A & R / Statement - I, II",
  "Three Statements",
  "Only I, Only II",
  "All",
];

const MAX_QUESTIONS = 100;
const BULK_PREVIEW_PAGE_SIZE = 10;

const generalInfoSchema = Yup.object({
  examTitle: Yup.string()
    .transform((value) => (value ? value.trim() : ""))
    .required("Exam title is required")
    .test(
      "min-length",
      "Exam title must be at least 3 characters",
      (value) => !value || value.length >= 3,
    ),
  examType: Yup.string()
    .oneOf(["practice", "mock", "live"])
    .required("Exam type is required"),
});

const pyqDetailsSchema = Yup.object({
  subjectId: Yup.number().required().min(1, "Please select a subject"),
  filterType: Yup.string()
    .oneOf(["topic", "difficulty", "answer_type"])
    .required(),
  topicId: Yup.number().when("filterType", {
    is: "topic",
    then: () => Yup.number().min(1, "Please select a topic"),
    otherwise: () => Yup.number().nullable(),
  }),
  difficultyValue: Yup.string().when("filterType", {
    is: "difficulty",
    then: () => Yup.string().required("Please select a difficulty level"),
    otherwise: () => Yup.string().nullable(),
  }),
  answerTypeValue: Yup.string().when("filterType", {
    is: "answer_type",
    then: () => Yup.string().required("Please select an answer type"),
    otherwise: () => Yup.string().nullable(),
  }),
  setNumber: Yup.number()
    .typeError("Set number must be a number")
    .required("Set number is required")
    .min(1, "Set number must be at least 1"),
});

const parseLocalDatetime = (value: string) => {
  if (!value) return new Date("");
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
};

const rulesSchema = Yup.object({
  duration: Yup.number()
    .typeError("Duration must be a number")
    .required("Duration is required")
    .min(1, "Duration must be at least 1 minute")
    .max(300, "Duration cannot exceed 300 minutes"),
  startTime: Yup.string().when("examType", {
    is: "live",
    then: () =>
      Yup.string()
        .required("Start time is required")
        .test("not-past", "Start time must be now or later", (value) => {
          if (!value) return false;
          return parseLocalDatetime(value) >= new Date();
        }),
    otherwise: () => Yup.string().nullable(),
  }),
  endTime: Yup.string().when("examType", {
    is: "live",
    then: () =>
      Yup.string()
        .required("End time is required")
        .test(
          "after-start",
          "End time must be after start time",
          function (value) {
            const { startTime } = this.parent;
            if (!value || !startTime) return false;
            return parseLocalDatetime(value) >= parseLocalDatetime(startTime);
          },
        ),
    otherwise: () => Yup.string().nullable(),
  }),
});

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "success";
    case "medium":
      return "warning";
    case "hard":
      return "error";
    default:
      return "default";
  }
};

export default function CreatePyqExamModal({ open, onClose, onSuccess }: Props) {
  const steps = ["General Info", "PYQ Details & Questions", "Rules", "Review"];
  const [activeStep, setActiveStep] = useState(0);

  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  // ---------------- General Info ----------------
  const [examTitle, setExamTitle] = useState("");
  const [description, setDescription] = useState("");
  // PYQ exams default to "practice" - they're meant to be auto-assigned to
  // all users for self-practice, not scheduled/live events. Admin can still
  // switch this if a timed PYQ set is ever needed.
  const [examType, setExamType] = useState<ExamType>("practice");

  // ---------------- PYQ Details ----------------
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [subjectId, setSubjectId] = useState<number>(0);
  const [filterType, setFilterType] = useState<FilterType>("topic");
  const [topicId, setTopicId] = useState<number>(0);
  const [difficultyValue, setDifficultyValue] = useState<string>("");
  const [answerTypeValue, setAnswerTypeValue] = useState<string>("");
  const [setNumber, setSetNumber] = useState<number | "">("");

  // ---------------- Question Upload ----------------
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkQuestions, setBulkQuestions] = useState<any[]>([]);
  const [bulkValidationErrors, setBulkValidationErrors] = useState<string[]>(
    [],
  );
  const [showBulkPreview, setShowBulkPreview] = useState(false);
  const [bulkPreviewPage, setBulkPreviewPage] = useState(1);

  // ---------------- Rules ----------------
  const [duration, setDuration] = useState<number | "">("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dateErrors, setDateErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success",
  ) => setSnackbar({ open: true, message, severity });

  const selectedSubject = subjects.find((s) => s.subject_id === subjectId);
  const topicsForSubject = selectedSubject?.topics || [];

  // Row-level subject/topic columns are only needed for Difficulty Wise and
  // Answer Type Wise uploads. Topic Wise already pins every question to the
  // single topic chosen in the dropdown, so there's nothing to cross-check
  // per row and the existing 9-column file format keeps working as-is.
  const needsRowLevelSubjectTopic = filterType !== "topic";

  // Upload can't be parsed correctly until we know which subject (and,
  // for Topic Wise, which topic) the file is being validated against.
  const uploadDisabled = !subjectId || (filterType === "topic" && !topicId);

  // ---------------- Reset ----------------
  const resetForm = () => {
    setActiveStep(0);
    setExamTitle("");
    setDescription("");
    setExamType("practice");
    setSubjectId(0);
    setFilterType("topic");
    setTopicId(0);
    setDifficultyValue("");
    setAnswerTypeValue("");
    setSetNumber("");
    setBulkFile(null);
    setBulkQuestions([]);
    setBulkValidationErrors([]);
    setShowBulkPreview(false);
    setBulkPreviewPage(1);
    setDuration("");
    setStartTime("");
    setEndTime("");
    setFormErrors({});
    setDateErrors({});
  };

  useEffect(() => {
    if (open) resetForm();
  }, [open]);

  // ---------------- Fetch PYQ-flagged subjects/topics ----------------
  useEffect(() => {
    if (!open) return;
    setLoadingSubjects(true);
    fetch("/api/subjects")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        // Only subjects flagged is_pyq: true show up here, and only their
        // is_pyq topics - normal question-bank subjects/topics never leak
        // into this modal. This same is_pyq-filtered map is what row-level
        // topic names get resolved against, so a topic that isn't flagged
        // is_pyq simply won't match and the row will error out.
        const pyqSubjects: Subject[] = list
          .filter((s: any) => s.is_pyq)
          .map((s: any) => ({
            subject_id: s.subject_id,
            subject_name: s.subject_name,
            is_pyq: s.is_pyq,
            topics: (s.topics || []).filter((t: any) => t.is_pyq),
          }));
        setSubjects(pyqSubjects);
      })
      .catch((err) => {
        console.error("Error fetching PYQ subjects:", err);
        showSnackbar("Failed to load PYQ subjects", "error");
      })
      .finally(() => setLoadingSubjects(false));
  }, [open]);

  // ---------------- Auto duration (practice exams) ----------------
  // Mirrors the normal Create Exam modal: practice exams get an
  // auto-calculated duration based on question count, and the field is
  // locked in the Rules step so admins can't accidentally desync it.
  useEffect(() => {
    if (examType !== "practice") return;
    const calculatedDuration = Math.ceil(bulkQuestions.length * 1.2);
    setDuration(calculatedDuration > 0 ? calculatedDuration : 0);
  }, [bulkQuestions.length, examType]);

  // ---------------- Validation ----------------
  const validateGeneralInfoStep = async () => {
    try {
      await generalInfoSchema.validate(
        { examTitle, examType },
        { abortEarly: false },
      );
      setFormErrors((prev) => ({ ...prev, examTitle: "", examType: "" }));
      return true;
    } catch (err: any) {
      const errors: Record<string, string> = {};
      err.inner?.forEach((e: any) => {
        if (e.path) errors[e.path] = e.message;
      });
      setFormErrors((prev) => ({ ...prev, ...errors }));
      return false;
    }
  };

  const validatePyqDetailsStep = async () => {
    try {
      await pyqDetailsSchema.validate(
        {
          subjectId,
          filterType,
          topicId,
          difficultyValue,
          answerTypeValue,
          setNumber,
        },
        { abortEarly: false },
      );

      if (bulkQuestions.length === 0) {
        setFormErrors((prev) => ({
          ...prev,
          questions: "Please upload at least one question",
        }));
        return false;
      }

      if (bulkQuestions.length > MAX_QUESTIONS) {
        setFormErrors((prev) => ({
          ...prev,
          questions: `Maximum ${MAX_QUESTIONS} questions allowed per exam`,
        }));
        return false;
      }

      setFormErrors((prev) => ({
        ...prev,
        subjectId: "",
        topicId: "",
        difficultyValue: "",
        answerTypeValue: "",
        setNumber: "",
        questions: "",
      }));
      return true;
    } catch (err: any) {
      const errors: Record<string, string> = {};
      err.inner?.forEach((e: any) => {
        if (e.path) errors[e.path] = e.message;
      });
      setFormErrors((prev) => ({ ...prev, ...errors }));
      return false;
    }
  };

  const validateLiveDates = (start = startTime, end = endTime) => {
    if (examType !== "live") return true;
    const errors: Record<string, string> = {};
    const now = new Date();

    if (!start) errors.startTime = "Start time is required";
    else if (parseLocalDatetime(start) < now)
      errors.startTime = "Start time must be now or later";

    if (!end) errors.endTime = "End time is required";
    else if (start && parseLocalDatetime(end) < parseLocalDatetime(start))
      errors.endTime = "End time must be after start time";

    setDateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRulesStep = async () => {
    let isValid = true;
    try {
      await rulesSchema.validate(
        { duration, startTime, endTime, examType },
        { abortEarly: false },
      );
      setFormErrors((prev) => ({ ...prev, duration: "" }));
    } catch (err: any) {
      const errs: Record<string, string> = {};
      err.inner?.forEach((e: any) => {
        if (e.path === "duration") errs.duration = e.message;
      });
      setFormErrors((prev) => ({ ...prev, ...errs }));
      isValid = false;
    }
    if (!validateLiveDates()) isValid = false;
    return isValid;
  };

  const handleNext = async () => {
    let isValid = true;

    if (steps[activeStep] === "General Info") {
      isValid = await validateGeneralInfoStep();
    }
    if (steps[activeStep] === "PYQ Details & Questions") {
      isValid = await validatePyqDetailsStep();
    }
    if (steps[activeStep] === "Rules") {
      isValid = await validateRulesStep();
    }

    if (!isValid) return;

    if (activeStep === steps.length - 1) {
      await handleSubmit();
    } else {
      setActiveStep((s) => s + 1);
    }
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  // ---------------- Excel Parsing ----------------
  // Topic Wise keeps the original 9-column template (question_text,
  // option_a-d, correct_answer, points, difficulty, explanation) - topic is
  // chosen once in the dropdown, same as Subject.
  //
  // Difficulty Wise / Answer Type Wise additionally require `subject` and
  // `topic` name columns per row, since questions in those exams aren't
  // pinned to a single topic. Those names get resolved against the
  // is_pyq-scoped subject/topic list and cross-checked against the
  // dropdown-selected subject, so a mismatched or unrecognized name fails
  // per-row instead of silently writing a wrong topic_id.
  const difficultyNormalizationMap: Record<string, string> = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    e: "Easy",
    m: "Medium",
    h: "Hard",
    "1": "Easy",
    "2": "Medium",
    "3": "Hard",
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      showSnackbar("Please upload an Excel file (.xlsx or .xls)", "error");
      return;
    }

    setBulkFile(file);
    parseExcelFile(file);
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        if (rows.length === 0) {
          setBulkValidationErrors(["File is empty"]);
          return;
        }

        const headers = (rows[0] as any[]).map((h) =>
          String(h).toLowerCase().trim(),
        );

        const baseFields = [
          "question_text",
          "option_a",
          "option_b",
          "option_c",
          "option_d",
          "correct_answer",
          "points",
          "difficulty",
          "explanation",
        ];
        const requiredFields = needsRowLevelSubjectTopic
          ? [...baseFields, "subject", "topic"]
          : baseFields;

        const missingFields = requiredFields.filter(
          (f) => !headers.includes(f),
        );

        if (missingFields.length > 0) {
          setBulkValidationErrors([
            `Missing required columns: ${missingFields.join(", ")}`,
          ]);
          return;
        }

        const selectedSubjectName = selectedSubject?.subject_name
          .toLowerCase()
          .trim();
        const topicNameToId = new Map<string, number>(
          topicsForSubject.map((t) => [
            t.topic_name.toLowerCase().trim(),
            t.topic_id,
          ]),
        );

        const parsed: any[] = [];
        const errors: string[] = [];

        for (let i = 1; i < rows.length; i++) {
          const values = rows[i];
          if (!values || !Array.isArray(values)) continue;

          const rowData: Record<string, string> = {};
          headers.forEach((header, index) => {
            const value = values[index];
            rowData[header] = value !== undefined ? String(value).trim() : "";
          });

          const hasData = Object.values(rowData).some((v) => v.trim() !== "");
          if (!hasData) continue;

          if (
            !rowData.question_text ||
            !rowData.option_a ||
            !rowData.option_b ||
            !rowData.option_c ||
            !rowData.option_d ||
            !rowData.correct_answer
          ) {
            errors.push(`Row ${i + 1}: Missing required fields`);
            continue;
          }

          // Topic Wise: every row uses the single dropdown-selected topic.
          // Difficulty/Answer-Type: resolve + validate per row.
          let rowTopicId: number | undefined =
            filterType === "topic" ? topicId : undefined;
          let rowTopicName = "";

          if (needsRowLevelSubjectTopic) {
            const rowSubjectName = rowData.subject.toLowerCase().trim();
            if (!rowSubjectName || rowSubjectName !== selectedSubjectName) {
              errors.push(
                `Row ${i + 1}: Subject "${rowData.subject || "(missing)"}" does not match selected subject "${selectedSubject?.subject_name}"`,
              );
              continue;
            }

            const rowTopicNameRaw = rowData.topic.trim();
            const resolvedTopicId = topicNameToId.get(
              rowTopicNameRaw.toLowerCase(),
            );
            if (!resolvedTopicId) {
              errors.push(
                `Row ${i + 1}: Topic "${rowTopicNameRaw || "(missing)"}" not found under "${selectedSubject?.subject_name}"'s PYQ topics`,
              );
              continue;
            }

            rowTopicId = resolvedTopicId;
            rowTopicName = rowTopicNameRaw;
          }

          const normalizedDifficulty = String(rowData.difficulty || "Medium")
            .toLowerCase()
            .trim();
          const finalDifficulty =
            difficultyNormalizationMap[normalizedDifficulty] || "Medium";

          parsed.push({
            question_text: rowData.question_text,
            option_a: rowData.option_a,
            option_b: rowData.option_b,
            option_c: rowData.option_c,
            option_d: rowData.option_d,
            correct_answer: rowData.correct_answer.toUpperCase(),
            points: Number(rowData.points) || 2,
            difficulty: finalDifficulty,
            explanation: rowData.explanation || "",
            topic_id: rowTopicId,
            ...(needsRowLevelSubjectTopic ? { topic_name: rowTopicName } : {}),
          });
        }

        if (parsed.length > MAX_QUESTIONS) {
          setBulkValidationErrors([
            `File contains ${parsed.length} questions - maximum allowed is ${MAX_QUESTIONS}. Please trim the file and re-upload.`,
          ]);
          setBulkQuestions([]);
          setShowBulkPreview(false);
          return;
        }

        // Difficulty-mode: every question in a "Difficulty Wise" PYQ exam
        // should match the exam's own tagged difficulty, so the exam stays
        // internally consistent for students filtering by that difficulty.
        const finalQuestions =
          filterType === "difficulty" && difficultyValue
            ? parsed.map((q) => ({ ...q, difficulty: difficultyValue }))
            : parsed;

        setBulkQuestions(finalQuestions);
        setBulkValidationErrors(errors);
        setShowBulkPreview(true);

        if (finalQuestions.length > 0) {
          showSnackbar(
            `Successfully parsed ${finalQuestions.length} questions`,
            "success",
          );
        }

        setFormErrors((prev) => ({ ...prev, questions: "" }));
      } catch (error) {
        setBulkValidationErrors([
          "Error parsing file. Please check the format.",
        ]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const templateRow: Record<string, any> = {
      question_text: "Sample previous year question text?",
      option_a: "Option A",
      option_b: "Option B",
      option_c: "Option C",
      option_d: "Option D",
      correct_answer: "A",
      points: 2,
      difficulty: "Easy",
      explanation: "Explanation for the correct answer",
    };

    if (needsRowLevelSubjectTopic) {
      templateRow.subject =
        selectedSubject?.subject_name || "Enter exact subject name";
      templateRow.topic = "Enter exact topic name (must match Manage Topics)";
    }

    const worksheet = XLSX.utils.json_to_sheet([templateRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PYQ Questions");
    XLSX.writeFile(workbook, "pyq_questions_template.xlsx");
  };

  const resetUpload = () => {
    setBulkFile(null);
    setBulkQuestions([]);
    setBulkValidationErrors([]);
    setShowBulkPreview(false);
    setBulkPreviewPage(1);
    if (bulkFileInputRef.current) bulkFileInputRef.current.value = "";
  };

  // ---------------- Duration helpers ----------------
  const toDatetimeLocal = (dateStr: string) => {
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === "") {
      setDuration("");
      setFormErrors((prev) => ({ ...prev, duration: "Duration is required" }));
      return;
    }
    const value = Number(rawValue);
    setDuration(value);

    if (startTime) {
      const start = parseLocalDatetime(startTime);
      const end = new Date(start.getTime() + value * 60 * 1000);
      setEndTime(toDatetimeLocal(end.toISOString()));
    }

    rulesSchema
      .validateAt("duration", { duration: value, examType })
      .then(() => setFormErrors((prev) => ({ ...prev, duration: "" })))
      .catch((err) =>
        setFormErrors((prev) => ({ ...prev, duration: err.message })),
      );
  };

  // ---------------- Submit ----------------
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const payload = {
      examTitle,
      description,
      examType,
      duration,
      startTime: startTime ? new Date(startTime).toISOString() : null,
      endTime: endTime ? new Date(endTime).toISOString() : null,
      subjectId,
      filterType,
      // Topic Wise still sends the single dropdown topicId at the top
      // level (drives pyq_exam_meta.topic). Difficulty/Answer-Type rely on
      // the per-row topic_id already resolved onto each question instead.
      topicId: filterType === "topic" ? topicId : null,
      difficultyValue: filterType === "difficulty" ? difficultyValue : null,
      answerTypeValue: filterType === "answer_type" ? answerTypeValue : null,
      setNumber,
      questions: bulkQuestions,
    };

    try {
      const res = await fetch("/api/exams/pyq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showSnackbar("PYQ exam created successfully!", "success");
        resetForm();
        onSuccess?.();
        onClose();
      } else {
        showSnackbar(data.message || "Failed to create PYQ exam", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Error creating PYQ exam", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatReviewDateTime = (value: string) => {
    if (!value) return "Not set";
    const date = parseLocalDatetime(value);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const categoryLabel =
    filterType === "topic"
      ? topicsForSubject.find((t) => t.topic_id === topicId)?.topic_name
      : filterType === "difficulty"
        ? difficultyValue
        : answerTypeValue;

  // ---------------- Step Content ----------------
  const renderStepContent = () => {
    switch (steps[activeStep]) {
      case "General Info":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Exam Title"
              value={examTitle}
              onChange={(e) => {
                setExamTitle(e.target.value);
                setFormErrors((prev) => ({ ...prev, examTitle: "" }));
              }}
              error={!!formErrors.examTitle}
              helperText={
                formErrors.examTitle ||
                'e.g. "Economics PYQ - Macroeconomy - Set 1"'
              }
            />
            <TextField
              label="Description (optional)"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Typography fontWeight={600}>Exam Type</Typography>
            <RadioGroup
              row
              value={examType}
              onChange={(e) => {
                const type = e.target.value as ExamType;
                setExamType(type);
                setFormErrors((prev) => ({ ...prev, examType: "" }));
                setStartTime("");
                setEndTime("");
                setDateErrors({});
                if (type === "mock" || type === "live") setDuration(120);
              }}
            >
              <FormControlLabel
                value="practice"
                control={<Radio />}
                label="Practice"
              />
              <FormControlLabel value="mock" control={<Radio />} label="Mock" />
              <FormControlLabel value="live" control={<Radio />} label="Live" />
            </RadioGroup>
            {examType === "practice" && (
              <Typography variant="caption" color="text.secondary">
                Practice PYQ exams are automatically assigned to all users
                and their duration is calculated for you in the Rules step.
              </Typography>
            )}
          </Box>
        );

      case "PYQ Details & Questions":
        return (
          <Box display="flex" flexDirection="column" gap={3}>
            {loadingSubjects ? (
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress />
              </Box>
            ) : subjects.length === 0 ? (
              <Alert severity="warning">
                No PYQ-flagged subjects found. Go to Manage Subject / Topic and
                enable the "PYQ Subject" toggle on at least one subject first.
              </Alert>
            ) : (
              <>
                <FormControl fullWidth error={!!formErrors.subjectId}>
                  <InputLabel>Select Subject</InputLabel>
                  <Select
                    label="Select Subject"
                    value={subjectId}
                    onChange={(e) => {
                      setSubjectId(Number(e.target.value));
                      setTopicId(0);
                      setFormErrors((prev) => ({ ...prev, subjectId: "" }));
                      resetUpload();
                    }}
                  >
                    <MenuItem value={0}>Select Subject</MenuItem>
                    {subjects.map((s) => (
                      <MenuItem key={s.subject_id} value={s.subject_id}>
                        {s.subject_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.subjectId && (
                    <Typography color="error" variant="caption">
                      {formErrors.subjectId}
                    </Typography>
                  )}
                </FormControl>

                <Box>
                  <Typography fontWeight={600} mb={1}>
                    Filter Type
                  </Typography>
                  <RadioGroup
                    row
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value as FilterType);
                      setTopicId(0);
                      setDifficultyValue("");
                      setAnswerTypeValue("");
                      resetUpload();
                    }}
                  >
                    <FormControlLabel
                      value="topic"
                      control={<Radio />}
                      label="Topic Wise"
                    />
                    <FormControlLabel
                      value="difficulty"
                      control={<Radio />}
                      label="Difficulty Wise"
                    />
                    <FormControlLabel
                      value="answer_type"
                      control={<Radio />}
                      label="Answer Type Wise"
                    />
                  </RadioGroup>
                </Box>

                {filterType === "topic" && (
                  <FormControl
                    fullWidth
                    disabled={!subjectId}
                    error={!!formErrors.topicId}
                  >
                    <InputLabel>Select Topic</InputLabel>
                    <Select
                      label="Select Topic"
                      value={topicId}
                      onChange={(e) => {
                        setTopicId(Number(e.target.value));
                        setFormErrors((prev) => ({ ...prev, topicId: "" }));
                        resetUpload();
                      }}
                    >
                      <MenuItem value={0}>Select Topic</MenuItem>
                      {topicsForSubject.map((t) => (
                        <MenuItem key={t.topic_id} value={t.topic_id}>
                          {t.topic_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {topicsForSubject.length === 0 && subjectId > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        No PYQ topics found under this subject.
                      </Typography>
                    )}
                    {formErrors.topicId && (
                      <Typography color="error" variant="caption">
                        {formErrors.topicId}
                      </Typography>
                    )}
                  </FormControl>
                )}

                {filterType === "difficulty" && (
                  <FormControl fullWidth error={!!formErrors.difficultyValue}>
                    <InputLabel>Select Difficulty</InputLabel>
                    <Select
                      label="Select Difficulty"
                      value={difficultyValue}
                      onChange={(e) => {
                        setDifficultyValue(e.target.value);
                        setFormErrors((prev) => ({
                          ...prev,
                          difficultyValue: "",
                        }));
                        // if questions already uploaded, keep them in sync
                        if (bulkQuestions.length > 0) {
                          setBulkQuestions((prev) =>
                            prev.map((q) => ({
                              ...q,
                              difficulty: e.target.value,
                            })),
                          );
                        }
                      }}
                    >
                      {DIFFICULTY_LEVELS.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.difficultyValue && (
                      <Typography color="error" variant="caption">
                        {formErrors.difficultyValue}
                      </Typography>
                    )}
                  </FormControl>
                )}

                {filterType === "answer_type" && (
                  <FormControl fullWidth error={!!formErrors.answerTypeValue}>
                    <InputLabel>Select Answer Type</InputLabel>
                    <Select
                      label="Select Answer Type"
                      value={answerTypeValue}
                      onChange={(e) => {
                        setAnswerTypeValue(e.target.value);
                        setFormErrors((prev) => ({
                          ...prev,
                          answerTypeValue: "",
                        }));
                      }}
                    >
                      {ANSWER_TYPES.map((a) => (
                        <MenuItem key={a} value={a}>
                          {a}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.answerTypeValue && (
                      <Typography color="error" variant="caption">
                        {formErrors.answerTypeValue}
                      </Typography>
                    )}
                  </FormControl>
                )}

                <TextField
                  label="Set Number"
                  type="number"
                  value={setNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSetNumber(val === "" ? "" : Number(val));
                    setFormErrors((prev) => ({ ...prev, setNumber: "" }));
                  }}
                  error={!!formErrors.setNumber}
                  helperText={formErrors.setNumber}
                  inputProps={{ min: 1 }}
                  sx={{ maxWidth: 200 }}
                />

                {/* -------- Question Upload -------- */}
                <Box border="1px solid #ddd" borderRadius={2} p={2}>
                  <Typography fontWeight={600} mb={1}>
                    Upload Questions (Excel)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Maximum {MAX_QUESTIONS} questions per exam.{" "}
                    {needsRowLevelSubjectTopic
                      ? "This filter type needs a Subject and Topic column in every row so we can match each question to the right topic."
                      : "Same 9-column format as the Question Bank bulk upload - topic is taken from your selection above."}
                  </Typography>

                  {uploadDisabled && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      {!subjectId
                        ? "Select a Subject above before uploading."
                        : "Select a Topic above before uploading."}
                    </Alert>
                  )}

                  <Box display="flex" gap={2} mb={2}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={downloadTemplate}
                      disabled={uploadDisabled}
                    >
                      Download Template
                    </Button>

                    <input
                      ref={bulkFileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                      id="pyq-upload-input"
                      disabled={uploadDisabled}
                    />
                    <label htmlFor="pyq-upload-input">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<UploadIcon />}
                        disabled={uploadDisabled}
                      >
                        Choose File
                      </Button>
                    </label>
                  </Box>

                  {bulkFile && (
                    <Typography variant="body2" mb={2}>
                      Selected file: {bulkFile.name}
                    </Typography>
                  )}

                  {bulkValidationErrors.length > 0 && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {bulkValidationErrors.map((err, i) => (
                        <Typography key={i} variant="body2">
                          • {err}
                        </Typography>
                      ))}
                    </Alert>
                  )}

                  {formErrors.questions && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      {formErrors.questions}
                    </Alert>
                  )}

                  {showBulkPreview && bulkQuestions.length > 0 && (
                    <Box mt={2}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography fontWeight={600}>
                          Preview ({bulkQuestions.length} questions)
                        </Typography>
                        <Button size="small" onClick={resetUpload}>
                          Clear & Re-upload
                        </Button>
                      </Box>

                      <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                S.No
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Question
                              </TableCell>
                              {needsRowLevelSubjectTopic && (
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Topic
                                </TableCell>
                              )}
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Difficulty
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Correct
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {bulkQuestions
                              .slice(
                                (bulkPreviewPage - 1) * BULK_PREVIEW_PAGE_SIZE,
                                bulkPreviewPage * BULK_PREVIEW_PAGE_SIZE,
                              )
                              .map((q, index) => (
                                <TableRow
                                  key={
                                    (bulkPreviewPage - 1) *
                                      BULK_PREVIEW_PAGE_SIZE +
                                    index
                                  }
                                >
                                  <TableCell>
                                    {(bulkPreviewPage - 1) *
                                      BULK_PREVIEW_PAGE_SIZE +
                                      index +
                                      1}
                                  </TableCell>
                                  <TableCell>
                                    <Tooltip title={q.question_text}>
                                      <span>
                                        {q.question_text.slice(0, 60)}
                                        {q.question_text.length > 60
                                          ? "..."
                                          : ""}
                                      </span>
                                    </Tooltip>
                                  </TableCell>
                                  {needsRowLevelSubjectTopic && (
                                    <TableCell>{q.topic_name}</TableCell>
                                  )}
                                  <TableCell>
                                    <Chip
                                      label={q.difficulty}
                                      color={getDifficultyColor(q.difficulty)}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>{q.correct_answer}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {bulkQuestions.length > BULK_PREVIEW_PAGE_SIZE && (
                        <Box display="flex" justifyContent="center" mt={2}>
                          <Pagination
                            count={Math.ceil(
                              bulkQuestions.length / BULK_PREVIEW_PAGE_SIZE,
                            )}
                            page={bulkPreviewPage}
                            onChange={(_, page) => setBulkPreviewPage(page)}
                            size="small"
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        );

      case "Rules":
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label={
                examType === "practice"
                  ? "Duration (Auto Calculated)"
                  : "Duration (minutes)"
              }
              type="number"
              value={duration}
              onChange={handleDurationChange}
              disabled={examType === "practice"}
              error={!!formErrors.duration}
              helperText={formErrors.duration}
              inputProps={{ min: 1, max: 300 }}
            />
            {examType === "live" && (
              <>
                <TextField
                  label="Start Time"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={startTime}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStartTime(value);
                    if (!value) {
                      setEndTime("");
                      setDateErrors({});
                      return;
                    }
                    let newEnd = "";
                    if (duration) {
                      const start = parseLocalDatetime(value);
                      const end = new Date(
                        start.getTime() + Number(duration) * 60 * 1000,
                      );
                      newEnd = toDatetimeLocal(end.toISOString());
                      setEndTime(newEnd);
                    }
                    validateLiveDates(value, newEnd);
                  }}
                  error={!!dateErrors.startTime}
                  helperText={dateErrors.startTime}
                />
                <TextField
                  label="End Time (Auto Calculated)"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={endTime}
                  InputProps={{ readOnly: true }}
                />
              </>
            )}
          </Box>
        );

      case "Review":
        return (
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography>
              <b>Title:</b> {examTitle}
            </Typography>
            <Typography>
              <b>Type:</b> {examType}
            </Typography>
            <Typography>
              <b>Subject:</b> {selectedSubject?.subject_name}
            </Typography>
            <Typography>
              <b>Filter Type:</b>{" "}
              {filterType === "topic"
                ? "Topic Wise"
                : filterType === "difficulty"
                  ? "Difficulty Wise"
                  : "Answer Type Wise"}
            </Typography>
            <Typography>
              <b>Category:</b> {categoryLabel || "-"}
            </Typography>
            <Typography>
              <b>Set Number:</b> {setNumber}
            </Typography>
            <Typography>
              <b>Duration:</b> {duration} minutes
            </Typography>
            <Typography>
              <b>Total Questions:</b> {bulkQuestions.length}
            </Typography>
            {examType === "practice" && (
              <Typography color="text.secondary">
                This exam will be automatically assigned to all users.
              </Typography>
            )}
            {examType === "live" && (
              <>
                <Typography>
                  <b>Start Time:</b> {formatReviewDateTime(startTime)}
                </Typography>
                <Typography>
                  <b>End Time:</b> {formatReviewDateTime(endTime)}
                </Typography>
              </>
            )}
          </Box>
        );
    }
  };

  return (
    <>
      <Dialog
        open={open}
        fullScreen
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
          resetForm();
          onClose();
        }}
        scroll="paper"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          Create PYQ Exam
          <IconButton
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {renderStepContent()}
        </DialogContent>

        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            variant="outlined"
            disabled={activeStep === 0 || isSubmitting}
            onClick={handleBack}
          >
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={18} color="inherit" />
                ) : null
              }
            >
              {isSubmitting ? "Creating..." : "Create PYQ Exam"}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}