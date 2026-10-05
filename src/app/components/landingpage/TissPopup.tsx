"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Fade } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";

const AUTO_OPEN_DELAY_MS = 10000; // 10 seconds after homepage mounts
const POSTER_WIDTH = 1402;
const POSTER_HEIGHT = 1122;

export default function TissPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), AUTO_OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Floating trigger icon — bottom-left so it doesn't collide with the PYQ button (bottom-right) */}
      <Box
        component="button"
        onClick={() => setOpen(true)}
        aria-label="Open TISS announcement"
        sx={{
          position: "fixed",
          left: { xs: 16, md: 28 },
          bottom: { xs: 16, md: 28 },
          zIndex: 1300,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          outline: "3px solid #bfdbfe",
          outlineOffset: "2px",
          background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 10px 26px rgba(37,99,235,0.45)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "scale(1.08)",
            boxShadow: "0 14px 34px rgba(37,99,235,0.55)",
          },
        }}
      >
        <CampaignRoundedIcon sx={{ color: "#fff", fontSize: 26 }} />
      </Box>

      {/* Popup with poster */}
      {open && (
        <Fade in={open} timeout={250}>
          <Box
            onClick={() => setOpen(false)}
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 1400,
              background: "rgba(15,23,42,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: `min(520px, 92vw)`,
                maxHeight: "88vh",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
                background: "#0f172a",
              }}
            >
              <Box
                component="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(15,23,42,0.55)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 1,
                  "&:hover": { background: "rgba(15,23,42,0.75)" },
                }}
              >
                <CloseRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
              </Box>

              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: `${POSTER_WIDTH} / ${POSTER_HEIGHT}`,
                  maxHeight: "88vh",
                }}
              >
                <Image
                  src="/Images/practice_today.png"
                  alt="TISS Announcement"
                  fill
                  sizes="(max-width: 600px) 92vw, 520px"
                  style={{ objectFit: "contain" }}
                />
              </Box>
            </Box>
          </Box>
        </Fade>
      )}
    </>
  );
}