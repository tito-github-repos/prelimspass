"use client";

import React, { useState } from "react";
import "./upsc-insights.css";

import {
  Box,
  Card,
  Chip,
  Container,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  AutoGraph,
  Insights,
  Psychology,
  TrendingUp,
} from "@mui/icons-material";
import InsightsIcon from "@mui/icons-material/Insights";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DescriptionIcon from "@mui/icons-material/Description";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const years = [
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
];

const subjectData = [
  {
    subject: "Environment",
    values: [19, 20, 17, 24, 19, 17, 14, 12, 18, 18, 15, 17, 18, 19, 19],
    color: "#19c880",
  },
  {
    subject: "Geography",
    values: [13, 12, 13, 11, 11, 3, 8, 7, 10, 10, 12, 10, 15, 17, 13],
    color: "#3b82f6",
  },
  {
    subject: "Science & Tech.",
    values: [15, 10, 15, 10, 7, 7, 8, 13, 12, 11, 11, 14, 9, 7, 9],
    color: "#8b5cf6",
  },
  {
    subject: "Polity",
    values: [7, 18, 15, 11, 13, 12, 23, 16, 15, 18, 17, 11, 15, 16, 18],
    color: "#f97316",
  },
  {
    subject: "Economics",
    values: [29, 17, 23, 11, 20, 28, 27, 25, 27, 20, 15, 20, 16, 16, 17],
    color: "#ef4444",
  },
  {
    subject: "History",
    values: [12, 21, 17, 24, 14, 17, 13, 21, 16, 19, 23, 15, 13, 11, 16],
    color: "#eab308",
  },
  {
    subject: "Current Affairs",
    values: [5, 2, 0, 9, 16, 16, 7, 6, 2, 4, 7, 13, 14, 14, 8],
    color: "#06b6d4",
  },
];

const insightCards = [
  {
    icon: <Insights />,
    title: "Data-Driven Insights",
  },
  {
    icon: <AutoGraph />,
    title: "11+ Years Analysis",
  },
  {
    icon: <TrendingUp />,
    title: "Real Exam Trends",
  },
  {
    icon: <Psychology />,
    title: "Smart Preparation",
  },
];

export default function UPSCInsightsSection() {
  const [view, setView] = useState("table");
  const [selectedSubject, setSelectedSubject] = useState(subjectData[0]);

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box className="sample-test-wrapper">
      {/* <Card elevation={0} className="sample-main-card"> */}
        {/* TOP SECTION */}
        <Box
          sx={{
            px: { xs: 2.5, md: 5 },
            py: { xs: 3, md: 2 },
            background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
          }}
        >
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={{ xs: 3, md: 2 }}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* LEFT CONTENT */}
            <Box
              sx={{
                flex: 1,
                maxWidth: "650px",
              }}
            >
              <Chip
                label="UPSC INSIGHTS 2027"
                sx={{
                  mb: 2,
                  background: "#dcfce7",
                  color: "#19c880",
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                }}
              />

              <Typography
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.05,
                  color: "#0f172a",
                  fontSize: {
                    xs: "2.6rem",
                    sm: "3.4rem",
                    md: "3.3rem",
                  },
                }}
              >
                UPSC Insights &
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    color: "#19c880",
                  }}
                >
                  Exam Analysis
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 2.5,
                  color: "#64748b",
                  lineHeight: 1.9,
                  maxWidth: "560px",
                  fontSize: {
                    xs: "1rem",
                    md: "1.05rem",
                  },
                }}
              >
                Understand UPSC trends, exam patterns, subject weightage, and
                cut-offs from 2011–2025 and prepare strategically for UPSC 2027.
              </Typography>

              {/* STATS */}
              <Box className="hero-stats-grid">
                {[
                  {
                    icon: <InsightsIcon />,
                    title: "15 Years",
                    subtitle: "Question Analysis",
                  },
                  {
                    icon: <MenuBookIcon />,
                    title: "7 Subjects",
                    subtitle: "UPSC Coverage",
                  },
                  {
                    icon: <QuizIcon />,
                    title: "100 Questions",
                    subtitle: "Real UPSC Pattern",
                  },
                  {
                    icon: <RocketLaunchIcon />,
                    title: "365+ Tests",
                    subtitle: "Mock Test Series",
                  },
                ].map((item, index) => (
                  <Card key={index} elevation={0} className="hero-mini-card">
                    <Box className="hero-mini-icon">{item.icon}</Box>

                    <Box>
                      <Typography className="hero-mini-title">
                        {item.title}
                      </Typography>

                      <Typography className="hero-mini-subtitle">
                        {item.subtitle}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* RIGHT IMAGE */}
            <Box className="hero-image-wrapper">
              <img
                src="/Images/UPSC_img-1.png"
                alt="UPSC Insights"
                className="hero-image"
              />
            </Box>
          </Stack>
        </Box>

        {/* MAIN ANALYSIS SECTION */}
        <Box
          sx={{
            px: { xs: 2, md: 5 },
            py: { xs: 4, md: 6 },
          }}
        >
          {/* HEADING */}
          <Box textAlign="center" mb={5}>
            <Typography
              sx={{
                fontWeight: 900,
                color: "#0f172a",
                fontSize: {
                  xs: "1.8rem",
                  md: "2.7rem",
                },
              }}
            >
              UPSC Subject Weightage Trend
              <Box
                component="span"
                sx={{
                  color: "#19c880",
                }}
              >
                {" "}
                (2011–2025)
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                color: "#64748b",
              }}
            >
              Subject-wise question distribution analysis
            </Typography>
          </Box>

          {/* SUBJECT BUTTONS */}
          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
            mb={4}
          >
            {subjectData.map((item, index) => (
              <Chip
                key={index}
                label={item.subject}
                onClick={() => {
                  setSelectedSubject(item);
                  setView("graph");
                }}
                sx={{
                  px: 1,
                  py: 2.5,
                  borderRadius: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  background:
                    selectedSubject.subject === item.subject && view === "graph"
                      ? item.color
                      : "#f1f5f9",
                  color:
                    selectedSubject.subject === item.subject && view === "graph"
                      ? "#fff"
                      : "#334155",

                  "&:hover": {
                    background: item.color,
                    color: "#fff",
                  },
                }}
              />
            ))}
          </Stack>

          {/* TOGGLE */}
         <Box display="flex" justifyContent="center" mb={5}>
  <ToggleButtonGroup
    value={view}
    exclusive
    onChange={(e, val) => val && setView(val)}
    size={mobile ? "small" : "medium"}
    className="custom-toggle-group"
  >
    <ToggleButton value="graph" className="custom-toggle-btn">
      <InsertChartOutlinedIcon className="toggle-icon" />
      Graph View
    </ToggleButton>

    <ToggleButton value="table" className="custom-toggle-btn">
      <TableChartIcon className="toggle-icon" />
      Table View
    </ToggleButton>
  </ToggleButtonGroup>
</Box>

          {/* GRAPH VIEW */}
          {view === "graph" && (
            <Card
              elevation={0}
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: "28px",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
              }}
            >
              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                  xs: "flex-start",
                  md: "center",
                }}
                spacing={2}
                mb={4}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: {
                        xs: "1.4rem",
                        md: "2rem",
                      },
                      color: "#0f172a",
                    }}
                  >
                    {selectedSubject.subject}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      mt: 1,
                    }}
                  >
                    UPSC Subject-wise Question Trend
                  </Typography>
                </Box>

                <Chip
                  label={`Highest : ${Math.max(...selectedSubject.values)}`}
                  sx={{
                    background: `${selectedSubject.color}15`,
                    color: selectedSubject.color,
                    fontWeight: 700,
                  }}
                />
              </Stack>

              {/* GRAPH */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: {
                    xs: 0.5,
                    md: 1.2,
                  },
                  height: {
                    xs: 260,
                    md: 340,
                  },
                  overflowX: "auto",
                  pb: 2,
                }}
              >
                {selectedSubject.values.map((value, index) => (
                  <Box
                    key={index}
                    sx={{
                      minWidth: mobile ? 24 : 42,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        mb: 1,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: "#334155",
                      }}
                    >
                      {value}
                    </Typography>

                    <Box
                      sx={{
                        width: "100%",
                        height: `${value * 9}px`,
                        borderRadius: "14px 14px 0 0",
                        background: selectedSubject.color,
                      }}
                    />

                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: "0.68rem",
                        color: "#64748b",
                      }}
                    >
                      {years[index]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          )}

          {/* TABLE VIEW */}
          {view === "table" && (
            <Box className="analysis-table-wrapper">
              <table className="analysis-table">
                <thead>
                  <tr>
                    <th className="table-head">Subject</th>

                    {years.map((year) => (
                      <th key={year} className="table-head">
                        {year}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {subjectData.map((item, index) => (
                    <tr key={index}>
                      <td
                        className="table-cell subject-cell"
                        style={{ color: item.color }}
                      >
                        {item.subject}
                      </td>

                      {item.values.map((value, idx) => (
                        <td key={idx} className="table-cell">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}

                  <tr className="total-row">
                    <td className="table-cell total-cell">Total</td>

                    {years.map((year, index) => (
                      <td
                        key={index}
                        className="table-cell"
                        style={{ fontWeight: 700 }}
                      >
                        100
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </Box>
          )}
        </Box>

        {/* MOCK TEST SECTION */}
        <Box className="mock-test-section" px={4} pb={6}>
          <Box textAlign="center" mb={5}>
            <Typography
              sx={{
                fontWeight: 900,
                color: "#0f172a",
                fontSize: {
                  xs: "1.8rem",
                  md: "2.5rem",
                },
              }}
            >
              Mock Test Format
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#64748b",
              }}
            >
              Designed based on real UPSC Prelims examination pattern
            </Typography>
          </Box>

          <Box className="mock-card-grid">
            {[
              {
                title: "Duration",
                value: "2 Hours",
                icon: <AccessTimeIcon />,
              },
              {
                title: "Total Questions",
                value: "100",
                icon: <QuizIcon />,
              },
              {
                title: "Negative Marking",
                value: "1/3rd",
                icon: <TrackChangesIcon />,
              },
              {
                title: "Difficulty",
                value: "Real UPSC Standard",
                icon: <InsightsIcon />,
              },
              {
                title: "Includes",
                value: "Solutions, Review & Performance Tracking",
                icon: <DescriptionIcon />,
              },
            ].map((item, index) => (
              <Card key={index} elevation={0} className="mock-card">
                <Box className="mock-icon">{item.icon}</Box>

                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "#0f172a",
                    fontSize: "1rem",
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: "#19c880",
                    fontWeight: 900,
                    fontSize: {
                      xs: "1.1rem",
                      md: "1.3rem",
                    },
                    lineHeight: 1.5,
                  }}
                >
                  {item.value}
                </Typography>
              </Card>
            ))}
          </Box>
          {/* ================= TEST PLAN SECTION ================= */}

          <Box className="upsc-plan-section">
            {/* HEADING */}
            <Box className="plan-heading-wrapper">
              <Typography className="plan-main-heading">
                UPSC 2026–2027
                <span className="green-text"> Test Plan</span>
              </Typography>

              <Typography className="plan-sub-heading">
                Day-wise subject allocation (June–May)
              </Typography>
            </Box>

            {/* TABLE */}
            <Box className="test-plan-wrapper">
              <Box className="test-plan-inner">
                {/* MONTH HEADER */}
                <Box className="month-grid">
                  <Box className="empty-cell" />

                  {[
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                  ].map((month) => (
                    <Box key={month} className="month-box">
                      {month}
                    </Box>
                  ))}
                </Box>

                {/* SUBJECT ROWS */}
                {[
                  {
                    day: "Mon",
                    subject: "Environment",
                    className: "env-box",
                  },
                  {
                    day: "Tue",
                    subject: "Geography",
                    className: "geo-box",
                  },
                  {
                    day: "Wed",
                    subject: "Science & Tech",
                    className: "sci-box",
                  },
                  {
                    day: "Thu",
                    subject: "Polity",
                    className: "polity-box",
                  },
                  {
                    day: "Fri",
                    subject: "Economics",
                    className: "eco-box",
                  },
                  {
                    day: "Sat",
                    subject: "History",
                    className: "history-box",
                  },
                  {
                    day: "Sun",
                    subject: "CSAT",
                    className: "csat-box",
                  },
                ].map((row, rowIndex) => (
                  <Box key={rowIndex} className="plan-row">
                    <Box className="day-label">{row.day}</Box>

                    {Array.from({ length: 12 }).map((_, index) => (
                      <Box
                        key={index}
                        className={
                          index >= 8
                            ? "mock-test-box"
                            : `subject-box ${row.className}`
                        }
                      >
                        {index >= 8 ? "Mock Test" : row.subject}
                      </Box>
                    ))}
                  </Box>
                ))}

                {/* MAINS SECTION */}
                <Box className="mains-section">
                  <Typography className="mains-heading">
                    MAINS TEST PLAN
                  </Typography>

                  {/* ESSAY */}
                  <Box className="plan-row">
                    <Box className="day-label">Saturday</Box>

                    {Array.from({ length: 12 }).map((_, index) => (
                      <Box key={index} className="essay-box">
                        Essay & Ethics
                      </Box>
                    ))}
                  </Box>

                  {/* GS */}
                  <Box className="plan-row">
                    <Box className="day-label">Sunday</Box>

                    {[
                      "GS1",
                      "GS1",
                      "GS1",
                      "GS2",
                      "GS2",
                      "GS2",
                      "GS3",
                      "GS3",
                      "GS3",
                      "GS4",
                      "GS4",
                      "Revision",
                    ].map((item, index) => (
                      <Box key={index} className="gs-box">
                        {item}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ================= CUT OFF TREND SECTION ================= */}

        <Box className="cutoff-section">
          {/* HEADING */}
          <Box className="cutoff-heading-wrapper">
            <Typography className="cutoff-main-heading">
              UPSC Cut-off
              <span className="green-text"> Trend (2020–2025)</span>
            </Typography>

            <Typography className="cutoff-sub-heading">
              Previous years category-wise UPSC Prelims cut-off analysis
            </Typography>
          </Box>

          {/* TABLE */}
          <Box className="cutoff-table-wrapper">
            <table className="cutoff-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>2025</th>
                  <th>2024</th>
                  <th>2023</th>
                  <th>2022</th>
                  <th>2021</th>
                  <th>2020</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="category-cell">General</td>

                  <td className="highlight-red">92.66</td>
                  <td>87.98</td>
                  <td>75.41</td>
                  <td>88.22</td>
                  <td>87.54</td>
                  <td>92.51</td>
                </tr>

                <tr>
                  <td className="category-cell">EWS</td>

                  <td className="highlight-red">89.34</td>
                  <td>85.92</td>
                  <td>68.02</td>
                  <td>82.83</td>
                  <td>80.14</td>
                  <td>77.55</td>
                </tr>

                <tr>
                  <td className="category-cell">OBC</td>

                  <td className="highlight-red">92</td>
                  <td>87.28</td>
                  <td>74.75</td>
                  <td>87.54</td>
                  <td>84.85</td>
                  <td>89.12</td>
                </tr>

                <tr>
                  <td className="category-cell">SC</td>

                  <td className="highlight-red">84</td>
                  <td>79.03</td>
                  <td>59.25</td>
                  <td>74.08</td>
                  <td>75.41</td>
                  <td>74.84</td>
                </tr>

                <tr>
                  <td className="category-cell">ST</td>

                  <td className="highlight-red">82.66</td>
                  <td>74.23</td>
                  <td>47.82</td>
                  <td>69.35</td>
                  <td>70.71</td>
                  <td>68.71</td>
                </tr>

                <tr>
                  <td className="category-cell">PwBD-1</td>

                  <td className="highlight-red">76.66</td>
                  <td>69.42</td>
                  <td>40.40</td>
                  <td>49.84</td>
                  <td>68.02</td>
                  <td>70.06</td>
                </tr>

                <tr>
                  <td className="category-cell">PwBD-2</td>

                  <td>54.66</td>
                  <td>65.30</td>
                  <td>47.13</td>
                  <td>58.59</td>
                  <td className="highlight-red">67.33</td>
                  <td>63.94</td>
                </tr>

                <tr>
                  <td className="category-cell">PwBD-3</td>

                  <td>40.66</td>
                  <td>40.56</td>
                  <td>40.40</td>
                  <td>40.40</td>
                  <td className="highlight-red">43.09</td>
                  <td>40.82</td>
                </tr>

                <tr>
                  <td className="category-cell">PwBD-5</td>

                  <td>40.66</td>
                  <td>40.56</td>
                  <td>33.68</td>
                  <td>41.76</td>
                  <td className="highlight-red">45.80</td>
                  <td>42.86</td>
                </tr>
              </tbody>
            </table>
          </Box>
        </Box>
        {/* ================= SMART ANALYSIS SECTION ================= */}

        <Box className="smart-analysis-section">
          <Box className="smart-analysis-grid">
            {/* ================= LEFT CONTENT ================= */}

            <Box className="smart-analysis-left">
              <Typography className="smart-analysis-heading">
                Smart Analysis.
                <br />
                <span className="green-text">Better Preparation.</span>
              </Typography>

              <Typography className="smart-analysis-description">
                Data-driven insights to help you crack UPSC with confidence.
              </Typography>

              {/* FEATURE STRIP */}

              <Box className="feature-strip">
                {[
                  {
                    icon: <TrackChangesIcon />,
                    text: "Understand Exam Trends",
                  },
                  {
                    icon: <AnalyticsIcon />,
                    text: "Analyze Your Performance",
                  },
                  {
                    icon: <TrendingUpIcon />,
                    text: "Improve Your Strategy",
                  },
                  {
                    icon: <EmojiEventsIcon />,
                    text: "Achieve Your UPSC Dream",
                  },
                ].map((item, index) => (
                  <Box key={index} className="feature-strip-item">
                    <Box className="feature-strip-icon">{item.icon}</Box>

                    <Typography className="feature-strip-text">
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* ================= RIGHT IMAGE ================= */}

            <Box className="smart-analysis-right">
              <img
                src="/Images/UPSC-student-image.png"
                alt="UPSC Student"
                className="smart-analysis-image"
              />
            </Box>
          </Box>

          {/* ================= BOTTOM FEATURES ================= */}

          <Box className="bottom-feature-container">
            {[
              {
                icon: <InsightsIcon />,
                title: "Data-Driven Insights",
                subtitle: "Get accurate analysis of exam trends and patterns.",
              },
              {
                icon: <AnalyticsIcon />,
                title: "Performance Analytics",
                subtitle: "Identify strengths and weaknesses to improve.",
              },
              {
                icon: <PsychologyIcon />,
                title: "Smart Preparation",
                subtitle: "Focus on important topics based on real data.",
              },
              {
                icon: <EmojiEventsIcon />,
                title: "Success Strategy",
                subtitle: "Prepare strategically and achieve your UPSC dream.",
              },
            ].map((item, index) => (
              <Box key={index} className="bottom-feature-card">
                <Box className="bottom-feature-icon">{item.icon}</Box>

                <Box>
                  <Typography className="bottom-feature-title">
                    {item.title}
                  </Typography>

                  <Typography className="bottom-feature-subtitle">
                    {item.subtitle}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      
    </Box>
  );
}
