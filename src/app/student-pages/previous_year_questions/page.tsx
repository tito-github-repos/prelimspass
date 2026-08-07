"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  Avatar,
  Skeleton,
  Fade,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import PublicIcon from "@mui/icons-material/Public";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { FaHistory, FaBook, FaFlask, FaChartLine } from "react-icons/fa";

const MAIN_BG = "#f5f7fa";
const CARD_BG = "#ffffff";
const TEXT_PRIMARY = "#1e293b";
const TEXT_SECONDARY = "#64748b";
const PRIMARY_PURPLE = "#2f13c9ff";

// Static Data for UI Selection
const SUBJECTS = [
  {
    id: 1,
    name: "Economics",
    icon: <FaChartLine size={24} />,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: 2,
    name: "Environment",
    icon: <FaFlask size={24} />,
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    id: 3,
    name: "Geography",
    icon: <PublicIcon sx={{ fontSize: 24 }} />,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: 4,
    name: "Polity",
    icon: <AccountBalanceIcon sx={{ fontSize: 24 }} />,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: 5,
    name: "History",
    icon: <FaHistory size={24} />,
    gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  },
  {
    id: 6,
    name: "Science & Technology",
    icon: <SchoolIcon sx={{ fontSize: 24 }} />,
    gradient: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
  },
];

const TOPICS_BY_SUBJECT: Record<string, string[]> = {
  Economics: [
    "Macroeconomy", 
    "Government Budgeting and Govt. Accounts",
    "Indian Taxation System",
    "RBI Functions - Money Supply, Monetary Policy, Forex Mgt & Balance of Payment",
    "RBI and Indian Banking and Finance System",
    "Capital Market, Money Market and FDI",
    "International Trade",
    "International Economic Organizations",
    "Population and Demography",
    "Agriculture", 
    "Corporates and Industries",
    "Poverty, Development, Health and Education",
    "Employment and Skill Development",
    "Economic Institutions, Laws and Policies",
    "Five Year Plans",
    ],
  Environment: [
    "Environment Ecology",
    "Biodiversity in India",
    "Environmental Pollution and Remedies",
    "Climate Change and Remedies",
    "Indian Initiatives for Environment Protection",
    "Agriculture and Environment",
    "Renewable and Alternative Energy Sources",
  ],
  Geography: [
    "Physical Geography - Geomorphology",
    "Physical Geography - Climatology",
    "Physical Geography - Oceanography",
    "Indian Geography - Map Based Questions",
    "Indian Geography - Mountains, Glaciers and Associated Landforms",
    "Indian Geography - Rocks, Soil, Minerals and Other Natural Resources",
    "Indian Geography - Rivers, Lakes and Lagoons",
    "Indian Geography - Location, Climate, Forests etc",
    "Indian Geography - Agriculture",
    "Indian Geography - Roads, Railways, Ports and Airports",
    "Indian Geography - Industries and Other Major Projects",
    "World Geography - Geographical Features and Natural Resources",
    "World Geography - Map Based Questions",
  ],
  Polity: [
    "Political Theory",
    "Indian Political System",
    "Indian Constitution",
    "Fundamental Rights",
    "DPSPs and Fundamental Duties",
    "Ministers, Ministries and Secretariat",
    "President, Vice President and Governor",
    "Union and State Legislature",
    "Judiciary and Judicial System",
    "Elections, Election Commission and RPA",
    "Various Constitutional & Non-Constitutional Posts and Bodie",
    "Important Acts and Constitutional Amendments",
    "Panchayati Raj and Local Governance",
    "Post Independence History",
    "International Relations",
  ],
  History: [
    "Art and Craft in India",
    "Indian Culture and Heritage",
    "Politics and Society",
    "Architecture",
    "Literature",
    "Religion and Philosophy",
    "Politics and Society",
    "Advent of Europeans in India",
    "Art, Architecture and Literature",
    "Religion and Philosophy",
    "Establishment of British Rule (1750-1857)",
    "The Revolt of 1857",
    "Events from 1857-1885",
    "From Establishment to Split of Congress (1885-1907)",
    "Freedom Struggle Before Gandhi (1908-1917)",
    "Early Phase of Gandhian Struggle (1917-1925)",
    "Civil Disobedience Movement and Other Events (1926-1932)",
    "Events from 1933 to 1939",
    "Last Phase of British Rule (1940-1950)",
    "Social Reforms and Reformers",
    "Literature",
    "Revolutionaries and Revolutionary Movement",
    "Development of Modern Education System",
    "Tribal and Peasant Movements",

  ],
  "Science & Technology": [
    "Electronics and IT",
    "Astrophysics and Space Technology",
    "Biotechnology",
    "Physics",
    "Chemistry",
    "Biology",
    "Diseases",
  ],
   "CURRENT AFFAIRS": [
    "Defence",
    "Nuclear Weapons and Treaties",
    "International Organizations and Treaties",
  ],
};

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];
const ANSWER_TYPES: Record<string, string[]> = {
  Economics: ["Single Word", "Single Sentence", "Match the Pairs","Both, Neither","A & R / Statement - I, II","Three Statements","Only I, Only II","All"],
  default: ["Single Word", "Single Sentence", "Match the Pairs","Both, Neither","A & R / Statement - I, II","Three Statements","Only I, Only II","All"],
};

interface Exam {
  id: number;
  title: string;
  duration: string;
  totalQuestions: number;
  totalMarks: number;
  setNumber?: number;
}

export default function PreviousYearQuestionsPage() {
  const router = useRouter();
  const [examsLoading, setExamsLoading] = useState(false);

  // Selection states
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "topic" | "difficulty" | "answerType" | null
  >(null);

  // Selection Values
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  // Data state
  const [exams, setExams] = useState<Exam[]>([]);

  const [startingExamId, setStartingExamId] = useState<number | null>(null);

  // 1. Reset everything when subject changes
  useEffect(() => {
    setActiveFilter(null);
    setSelectedValue(null);
    setExams([]);
  }, [selectedSubject]);

  // 2. Reset specific value when filter category changes
  useEffect(() => {
    setSelectedValue(null);
    setExams([]);
  }, [activeFilter]);

  // 3. Trigger API call when the "Final Value" is selected
  useEffect(() => {
    if (selectedSubject && activeFilter && selectedValue) {
      handleSearchAPI(selectedSubject, activeFilter, selectedValue);
    }
  }, [selectedSubject, activeFilter, selectedValue]);

  const handleSearchAPI = async (
    subject: string,
    type: string,
    value: string,
  ) => {
    setExamsLoading(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // We map the UI keys to the API 'type' keys expected by prisma route
      const apiTypeMap: Record<string, string> = {
        topic: "topic",
        difficulty: "difficulty",
        answerType: "answer_type",
      };

      const queryType = apiTypeMap[type] || type;

      const response = await fetch(
        `/api/students/exams/pyq?subject=${encodeURIComponent(subject)}&type=${encodeURIComponent(queryType)}&value=${encodeURIComponent(value)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        // Mapping Prisma response fields to our UI interface
        const transformedExams: Exam[] = data.exams.map((exam: any) => ({
          id: exam.exam_id,
          title: exam.exam_title,
          duration: `${exam.duration_minutes} mins`,
          totalQuestions: exam.question_count,
          totalMarks: exam.total_marks,
          setNumber: exam.set_number,
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
    }
  };

  const handleStartExam = async (
    examId: number,
    examType: string = "practice",
  ) => {
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
        // fullscreen for mock/live
        if (examType === "mock" || examType === "live") {
          try {
            const elem = document.documentElement;

            if (elem.requestFullscreen) {
              await elem.requestFullscreen();
            }
          } catch (error) {
            console.error("Fullscreen failed:", error);
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

  const getSubjectColor = (subjectName: string) => {
    return (
      SUBJECTS.find((s) => s.name === subjectName)?.gradient || PRIMARY_PURPLE
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        minHeight: "100vh",
        p: { xs: 2, md: 3 },
        background: MAIN_BG,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Avatar sx={{ bgcolor: PRIMARY_PURPLE, width: 42, height: 42 }}>
          <FaHistory fontSize={18} />
        </Avatar>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: TEXT_PRIMARY }}
          >
            Previous Year Questions
          </Typography>
          <Typography sx={{ color: TEXT_SECONDARY, fontSize: "0.85rem" }}>
            Select your criteria to view specialized papers
          </Typography>
        </Box>
      </Box>

      {!selectedSubject ? (
        /* Subject Selection Grid */
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: 2,
          }}
        >
          {SUBJECTS.map((subject) => (
            <Card
              key={subject.id}
              onClick={() => setSelectedSubject(subject.name)}
              sx={{
                cursor: "pointer",
                transition: "0.3s",
                borderRadius: 3,
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                sx={{
                  height: 100,
                  background: subject.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.3)",
                    width: 50,
                    height: 50,
                  }}
                >
                  {subject.icon}
                </Avatar>
              </Box>
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography fontWeight={600}>{subject.name}</Typography>
              </Box>
            </Card>
          ))}
        </Box>
      ) : (
        <>
          {/* Detailed Selection View */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setSelectedSubject(null)}
            >
              ← Subjects
            </Button>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: TEXT_PRIMARY }}
            >
              {selectedSubject}
            </Typography>
          </Box>

          {/* Step 2: Choose Filter Category */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: TEXT_SECONDARY,
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            Step 1: Choose Filter Type
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
            {[
              { key: "topic", label: "Topic-wise", icon: <FaBook /> },
              { key: "difficulty", label: "Difficulty", icon: <FaFlask /> },
              {
                key: "answerType",
                label: "Answer Type",
                icon: <QuestionAnswer />,
              },
            ].map((cat) => (
              <Card
                key={cat.key}
                onClick={() => setActiveFilter(cat.key as any)}
                sx={{
                  cursor: "pointer",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  minWidth: 150,
                  border: `2px solid ${activeFilter === cat.key ? PRIMARY_PURPLE : "transparent"}`,
                  bgcolor: activeFilter === cat.key ? PRIMARY_PURPLE : CARD_BG,
                  color: activeFilter === cat.key ? "#fff" : TEXT_PRIMARY,
                  transition: "0.2s",
                }}
              >
                {cat.icon}
                <Typography fontWeight={600}>{cat.label}</Typography>
              </Card>
            ))}
          </Box>

          {/* Step 3: Choose Final Value */}
          <Fade in={!!activeFilter}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: TEXT_SECONDARY,
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                Step 2: Select {activeFilter}
              </Typography>
              <Card
                sx={{
                  p: 2,
                  mb: 4,
                  borderRadius: 2,
                  borderLeft: `5px solid ${PRIMARY_PURPLE}`,
                }}
              >
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {activeFilter === "topic" &&
                    TOPICS_BY_SUBJECT[selectedSubject]?.map((val) => (
                      <Chip
                        key={val}
                        label={val}
                        onClick={() => setSelectedValue(val)}
                        color={selectedValue === val ? "primary" : "default"}
                        clickable
                      />
                    ))}
                  {activeFilter === "difficulty" &&
                    DIFFICULTY_LEVELS.map((val) => (
                      <Chip
                        key={val}
                        label={val}
                        onClick={() => setSelectedValue(val)}
                        color={selectedValue === val ? "primary" : "default"}
                        clickable
                      />
                    ))}
                  {activeFilter === "answerType" &&
                    (ANSWER_TYPES[selectedSubject] || ANSWER_TYPES.default).map(
                      (val) => (
                        <Chip
                          key={val}
                          label={val}
                          onClick={() => setSelectedValue(val)}
                          color={selectedValue === val ? "primary" : "default"}
                          clickable
                        />
                      ),
                    )}
                </Box>
              </Card>
            </Box>
          </Fade>

          {/* Results Grid */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Available Papers
          </Typography>

          {examsLoading ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 2,
              }}
            >
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  height={180}
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>
          ) : exams.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 2,
              }}
            >
              {exams.map((exam) => (
                <Card
                  key={exam.id}
                  sx={{
                    p: 2,
                    position: "relative",
                    border: "1px solid #e0e0e0",
                    boxShadow: "none",
                    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "4px",
                      background: getSubjectColor(selectedSubject),
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="primary"
                    fontWeight={800}
                  >
                    SET {exam.setNumber || 1}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mt: 1, mb: 2, lineHeight: 1.3 }}
                  >
                    {exam.title}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <QuestionAnswer
                        sx={{ fontSize: 16, color: TEXT_SECONDARY }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {exam.totalQuestions} Qs
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <AccessTimeIcon
                        sx={{ fontSize: 16, color: TEXT_SECONDARY }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {exam.duration}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    disabled={startingExamId === exam.id}
                    onClick={() => handleStartExam(exam.id, "practice")}
                    sx={{
                      bgcolor: PRIMARY_PURPLE,
                      textTransform: "none",
                      borderRadius: 2,
                    }}
                  >
                    {startingExamId === exam.id ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      "Start Practice"
                    )}
                  </Button>
                </Card>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 10,
                bgcolor: "#fff",
                borderRadius: 4,
                border: "1px dashed #ccc",
              }}
            >
              <Typography color="textSecondary">
                {selectedValue
                  ? "No papers found for this selection."
                  : "Please select a filter above to see papers."}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
