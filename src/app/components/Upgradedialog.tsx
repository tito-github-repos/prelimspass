"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useRouter } from "next/navigation";

interface UpgradeDialogProps {
  open: boolean;
  onClose: () => void;
  /** Name of the exam the student tried to open (optional) */
  examTitle?: string;
  /** Where the Upgrade button takes the student */
  redirectTo?: string;
}

export default function UpgradeDialog({
  open,
  onClose,
  examTitle,
  redirectTo = "/pricing",
}: UpgradeDialogProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onClose();
    router.push(redirectTo);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 3, p: { xs: 1, sm: 1.5 } } }}
    >
      <DialogContent sx={{ textAlign: "center", pb: 1 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #fff4d6 0%, #ffe7a8 100%)",
            color: "#d99a1b",
          }}
        >
          <WorkspacePremiumIcon sx={{ fontSize: 34 }} />
        </Box>

        <Typography
          sx={{ fontWeight: 800, fontSize: { xs: 18, sm: 20 }, color: "#1e293b" }}
        >
          Upgrade to take this exam
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontSize: { xs: 13.5, sm: 14.5 },
            color: "#64748b",
            lineHeight: 1.6,
          }}
        >
          {examTitle ? (
            <>
              To take <strong>{examTitle}</strong>, please upgrade your plan.
            </>
          ) : (
            "To take this exam, please upgrade your plan."
          )}{" "}
          Would you like to upgrade now?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            py: 1,
            color: "#475569",
            borderColor: "#cbd5e1",
            "&:hover": { borderColor: "#94a3b8", background: "#f8fafc" },
          }}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleUpgrade}
          startIcon={<WorkspacePremiumIcon sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            py: 1,
            color: "#fff",
            background: "linear-gradient(90deg, #f2b73f 0%, #d99a1b 100%)",
            boxShadow: "0 2px 8px rgba(217,154,27,0.35)",
            "&:hover": {
              background: "linear-gradient(90deg, #eab030 0%, #c88c17 100%)",
              boxShadow: "0 4px 12px rgba(217,154,27,0.45)",
            },
          }}
        >
          Upgrade
        </Button>
      </DialogActions>
    </Dialog>
  );
}