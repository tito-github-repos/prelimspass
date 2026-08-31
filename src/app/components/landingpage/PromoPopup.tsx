"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Dialog, IconButton, Fade } from "@mui/material";

export default function PromoPopup() {
  const [open, setOpen] = useState(true); // shows automatically when home page loads
  const router = useRouter();

  const handleGoToLogin = () => {
    setOpen(false);
    router.push("/login");
  };

  return (
    <>
      {/* Floating trigger tab — middle of right side of the page */}
      <Box
        onClick={() => setOpen(true)}
        onMouseEnter={() => setOpen(true)}
        sx={{
          position: "fixed",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1200,
          background: "linear-gradient(135deg,#16a34a,#15803d)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.8rem",
          fontFamily: "var(--website-font)",
          borderRadius: "10px 0 0 10px",
          padding: "16px 9px",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          letterSpacing: "0.5px",
          cursor: "pointer",
          boxShadow: "0 4px 18px rgba(22,163,74,0.4)",
          transition: "padding 0.2s ease",
          "&:hover": {
            padding: "18px 11px",
          },
        }}
      >
        Practice Paper
      </Box>

      {/* Poster popup */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        disableScrollLock
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            background: "transparent",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
            margin: "16px",
            maxWidth: "92vw",
            maxHeight: "92vh",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            lineHeight: 0,
            maxHeight: "92vh",
            display: "flex",
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(15,23,42,0.75)",
              color: "#fff",
              width: 32,
              height: 32,
              zIndex: 2,
              "&:hover": { background: "rgba(15,23,42,0.95)" },
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </IconButton>

          <Box
            component="img"
            src="/Images/promo-poster.webp"
            alt="PrelimsPass - Practice Today, Crack Tomorrow"
            onClick={handleGoToLogin}
            sx={{
              display: "block",
              width: "auto",
              height: "auto",
              maxWidth: "92vw",
              maxHeight: "92vh",
              objectFit: "contain",
              cursor: "pointer",
            }}
          />
        </Box>
      </Dialog>
    </>
  );
}
