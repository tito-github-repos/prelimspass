"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, HistoryOutlined } from "@mui/icons-material";

// ---- Shared design tokens (matched to the Exam History / Progress pages) ----
const TEXT_PRIMARY = "#1e293b";
const TEXT_SECONDARY = "#64748b";

// Pass/fail tint, same pattern as the Score column and Chip badges on the
// other pages (getProgressColor / EXAM_TYPE_META) instead of MUI's default
// theme success/error colors.
const RESULT_META: Record<string, { label: string; color: string; bg: string }> = {
  pass: { label: "Pass", color: "#16a34a", bg: "#f0fdf4" },
  fail: { label: "Fail", color: "#dc2626", bg: "#fef2f2" },
};

// Same hover/selected treatment used for the rows-per-page menu on the
// Exam History page's TablePagination.
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

interface Attempt {
  attemptNumber: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  score: string;
  points: string;
  result: string;
  completedAt: string;
}

interface AttemptHistoryModalProps {
  open: boolean;
  examName: string;
  examId: number;
  onClose: () => void;
}

export default function AttemptHistoryModal({
  open,
  examName,
  examId,
  onClose,
}: AttemptHistoryModalProps) {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (open && examId) {
      fetchAttempts();
      setPage(0); // reset to first page whenever a new exam's history opens
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, examId]);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(
        `/api/students/attempts?examId=${examId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        setAttempts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch attempt history:", error);
    } finally {
      setLoading(false);
    }
  };

  const paginatedAttempts = useMemo(() => {
    const start = page * rowsPerPage;
    return attempts.slice(start, start + rowsPerPage);
  }, [attempts, page, rowsPerPage]);

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // Prevent closing when clicking outside or pressing Escape
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          maxWidth: "90vw",
          width: "auto",
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
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, minWidth: 0 }}>
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
            <HistoryOutlined fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ fontWeight: 700, color: "#2c3e50", fontSize: 18 }}
            >
              Attempt History
            </Typography>
            <Typography
              sx={{ color: TEXT_SECONDARY, fontSize: 13.5, mt: 0.25 }}
              noWrap
              title={examName}
            >
              {examName}
            </Typography>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "48px",
            }}
          >
            <CircularProgress sx={{ color: "var(--primary)" }} />
          </Box>
        ) : attempts.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              padding: "48px",
              color: TEXT_SECONDARY,
            }}
          >
            <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
              No attempts found
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer
              sx={{
                overflowX: "auto",
                borderRadius: 0.5,
                border: "1px solid #e2e8f0",
              }}
            >
              <Table sx={{ minWidth: 700 }} aria-label="attempt history table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                    <TableCell
                      sx={{ fontWeight: 700, color: "#2c3e50", fontSize: 13.5 }}
                    >
                      Attempt
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: "#2c3e50", fontSize: 13.5 }}
                    >
                      Correct
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: "#2c3e50", fontSize: 13.5 }}
                    >
                      Wrong
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: "#2c3e50", fontSize: 13.5 }}
                    >
                      Unanswered
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: "#2c3e50", fontSize: 13.5 }}
                    >
                      Score
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: "#2c3e50", fontSize: 13.5 }}
                    >
                      Result
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: "#2c3e50", fontSize: 13.5 }}
                    >
                      Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAttempts.map((attempt) => {
                    const meta =
                      RESULT_META[(attempt.result || "fail").toLowerCase()] ??
                      RESULT_META.fail;

                    return (
                      <TableRow
                        key={attempt.attemptNumber}
                        hover
                        sx={{ "&:last-child td": { border: 0 } }}
                      >
                        <TableCell
                          sx={{ color: TEXT_PRIMARY, fontSize: 13.5, fontWeight: 600 }}
                        >
                          Attempt {attempt.attemptNumber}
                        </TableCell>
                        <TableCell sx={{ color: TEXT_PRIMARY, fontSize: 13.5 }}>
                          {attempt.correctAnswers}
                        </TableCell>
                        <TableCell sx={{ color: TEXT_PRIMARY, fontSize: 13.5 }}>
                          {attempt.wrongAnswers}
                        </TableCell>
                        <TableCell sx={{ color: TEXT_PRIMARY, fontSize: 13.5 }}>
                          {attempt.unanswered}
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{ fontWeight: 700, fontSize: 13.5, color: meta.color }}
                          >
                            {attempt.score}/{attempt.points}
                          </Typography>
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
                        <TableCell sx={{ color: TEXT_PRIMARY, fontSize: 13.5 }}>
                          {attempt.completedAt}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={attempts.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
              SelectProps={{
                MenuProps: { PaperProps: { sx: MENU_ITEM_SX } },
              }}
              sx={{
                "& .MuiTablePagination-toolbar": {
                  flexWrap: "wrap",
                  rowGap: 1,
                  px: { xs: 0, sm: 1 },
                },
                "& .MuiTablePagination-select": {
                  color: "var(--primary)",
                  fontWeight: 600,
                },
                "& .MuiTablePagination-selectIcon": {
                  color: "var(--primary)",
                },
                "& .MuiTablePagination-actions button": {
                  color: "var(--primary)",
                },
                "& .MuiTablePagination-actions button.Mui-disabled": {
                  color: "#cbd5e1",
                },
              }}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}