"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

// ---- Shared design tokens (matched to the Exam History / Progress /
// Attempt History modal) ----
const TEXT_PRIMARY = "#1e293b";
const TEXT_SECONDARY = "#64748b";

// Same tinted-badge pattern as the Attempt History modal's Result chip,
// instead of MUI's default theme success/error colors.
const RESULT_META: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pass: { label: "Pass", color: "#16a34a", bg: "#f0fdf4" },
  fail: { label: "Fail", color: "#dc2626", bg: "#fef2f2" },
};

const resultMeta = (result?: string) =>
  RESULT_META[(result || "fail").toLowerCase()] ?? RESULT_META.fail;

const SECTION_TITLE_SX = {
  fontWeight: 700,
  color: "#2c3e50",
  fontSize: { xs: 16, sm: 17 },
};

const TABLE_HEAD_CELL_SX = {
  fontWeight: 700,
  color: "#2c3e50",
  fontSize: 13.5,
  whiteSpace: "nowrap" as const,
};

interface Props {
  open: boolean;
  onClose: () => void;
  attemptId: number | null;
}

const StudentReviewModal = ({ open, onClose, attemptId }: Props) => {
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);

  useEffect(() => {
    if (!attemptId || !open) return;

    setLoading(true);
    setReviewData(null);

    const fetchReview = async () => {
      try {
        const res = await fetch(`/api/students/review?attemptId=${attemptId}`);
        const data = await res.json();

        if (!res.ok) {
          console.error(data.error);
          return;
        }

        setReviewData(data);
      } catch (err) {
        console.error("Review fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [attemptId, open]);

  const yourMeta = reviewData ? resultMeta(reviewData.result) : null;
  const topperMeta = reviewData ? resultMeta(reviewData.topperResult) : null;
  const topicSummary = reviewData?.topicSummary ?? [];

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // Prevent closing when clicking outside or pressing Escape
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      fullWidth
      maxWidth="lg"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          padding: "20px 24px",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AssessmentOutlinedIcon fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ fontWeight: 700, color: "#2c3e50", fontSize: 18 }}
            >
              Exam Review
            </Typography>
            {reviewData?.examTitle && (
              <Typography
                sx={{ color: TEXT_SECONDARY, fontSize: 13.5, mt: 0.25 }}
                noWrap
                title={reviewData.examTitle}
              >
                {reviewData.examTitle}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: TEXT_SECONDARY,
            "&:hover": {
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress sx={{ color: "var(--primary)" }} />
          </Box>
        ) : reviewData ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Score Summary */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <Typography sx={SECTION_TITLE_SX}>Score Summary</Typography>
                {reviewData.result?.toLowerCase() === "pass" &&
                  reviewData?.rank === 1 && (
                    <Chip
                      label="🏆 Topper"
                      size="small"
                      sx={{
                        backgroundColor: "#fffbeb",
                        color: "#d97706",
                        fontWeight: 700,
                        fontSize: 11,
                        border: "1px solid #d9770633",
                      }}
                    />
                  )}
              </Box>

              <TableContainer
                sx={{
                  overflowX: "auto",
                  borderRadius: 0.5,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Table sx={{ minWidth: 780 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                      <TableCell sx={TABLE_HEAD_CELL_SX}></TableCell>
                      <TableCell sx={TABLE_HEAD_CELL_SX}>Rank #</TableCell>
                      <TableCell sx={TABLE_HEAD_CELL_SX}>Exam</TableCell>
                      <TableCell sx={TABLE_HEAD_CELL_SX}>Score</TableCell>
                      <TableCell sx={TABLE_HEAD_CELL_SX}>Accuracy</TableCell>
                      <TableCell sx={TABLE_HEAD_CELL_SX}>Correct</TableCell>
                      <TableCell sx={TABLE_HEAD_CELL_SX}>Incorrect</TableCell>
                      <TableCell sx={TABLE_HEAD_CELL_SX}>Unanswered</TableCell>
                      <TableCell sx={TABLE_HEAD_CELL_SX}>Attempts</TableCell>
                      <TableCell sx={TABLE_HEAD_CELL_SX}>Time</TableCell>
                      <TableCell sx={TABLE_HEAD_CELL_SX}>Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow hover>
                      <TableCell
                        sx={{
                          backgroundColor: "var(--primary-light)",
                          color: "var(--primary)",
                          fontWeight: 700,
                          fontSize: 13.5,
                        }}
                      >
                        You
                      </TableCell>
                      <TableCell sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}>
                        {reviewData.result?.toLowerCase() === "pass"
                          ? (reviewData.rank ?? "-")
                          : "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}>
                        {reviewData.examTitle}
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 13.5,
                            color: yourMeta?.color,
                          }}
                        >
                          {reviewData.score ?? "-"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}>
                        {reviewData.accuracy !== undefined &&
                        reviewData.accuracy !== null
                          ? `${reviewData.accuracy}%`
                          : "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}>
                        {reviewData.correct ?? "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}>
                        {reviewData.incorrect ?? "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}>
                        {reviewData.unanswered ?? "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}>
                        {reviewData.attempts}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}>
                        {reviewData.timeSpent ?? "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={yourMeta?.label}
                          size="small"
                          sx={{
                            backgroundColor: yourMeta?.bg,
                            color: yourMeta?.color,
                            fontWeight: 700,
                            fontSize: 11,
                            border: `1px solid ${yourMeta?.color}33`,
                          }}
                        />
                      </TableCell>
                    </TableRow>

                    {reviewData.topperResult?.toLowerCase() === "pass" &&
                      reviewData.rank !== 1 && (
                        <TableRow hover>
                          <TableCell
                            sx={{
                              backgroundColor: "#fffbeb",
                              color: "#d97706",
                              fontWeight: 700,
                              fontSize: 13.5,
                            }}
                          >
                            Topper
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}
                          >
                            1
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}
                          >
                            {reviewData.examTitle}
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: 13.5,
                                color: topperMeta?.color,
                              }}
                            >
                              {reviewData.topperScore ?? "-"}
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}
                          >
                            {reviewData.topperAccuracy !== undefined &&
                            reviewData.topperAccuracy !== null
                              ? `${reviewData.topperAccuracy}%`
                              : "-"}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}
                          >
                            {reviewData.topperCorrect ?? "-"}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}
                          >
                            {reviewData.topperIncorrect ?? "-"}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}
                          >
                            {reviewData.topperUnanswered ?? "-"}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}
                          >
                            {reviewData.topperAttempt}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}
                          >
                            {reviewData.topperTime ?? "-"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={topperMeta?.label}
                              size="small"
                              sx={{
                                backgroundColor: topperMeta?.bg,
                                color: topperMeta?.color,
                                fontWeight: 700,
                                fontSize: 11,
                                border: `1px solid ${topperMeta?.color}33`,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Topic Wise Analysis */}
            <Box>
              <Typography sx={{ ...SECTION_TITLE_SX, mb: 1.5 }}>
                Topic Wise Analysis
              </Typography>

              {topicSummary.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 4,
                    color: TEXT_SECONDARY,
                    border: "1px solid #e2e8f0",
                    borderRadius: 0.5,
                  }}
                >
                  <Typography sx={{ fontSize: 14 }}>
                    No topic-wise breakdown available for this attempt.
                  </Typography>
                </Box>
              ) : (
                <TableContainer
                  sx={{
                    overflowX: "auto",
                    borderRadius: 0.5,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                        <TableCell sx={TABLE_HEAD_CELL_SX}>Subject</TableCell>
                        <TableCell sx={TABLE_HEAD_CELL_SX}>Topic</TableCell>
                        <TableCell sx={TABLE_HEAD_CELL_SX}>Total</TableCell>
                        <TableCell sx={TABLE_HEAD_CELL_SX}>Correct</TableCell>
                        <TableCell sx={TABLE_HEAD_CELL_SX}>Wrong</TableCell>
                        <TableCell sx={TABLE_HEAD_CELL_SX}>
                          Unanswered
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {topicSummary.map((row: any, index: number) => (
                        <TableRow
                          key={index}
                          hover
                          sx={{ "&:last-child td": { border: 0 } }}
                        >
                          <TableCell
                            sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}
                          >
                            {row.subject}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}
                          >
                            {row.topic}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 13.5, color: TEXT_PRIMARY }}
                          >
                            {row.total}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: 13.5,
                              color: "#16a34a",
                              fontWeight: 600,
                            }}
                          >
                            {row.correct}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: 13.5,
                              color: "#dc2626",
                              fontWeight: 600,
                            }}
                          >
                            {row.wrong}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: 13.5, color: TEXT_SECONDARY }}
                          >
                            {row.unanswered}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <Typography sx={{ color: TEXT_SECONDARY }}>
              No data available
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentReviewModal;
