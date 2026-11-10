"use client";

import { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

type Group = "ff" | "rr";

// One shared emerald palette so the web and mobile icons match exactly
const GREEN_RING = "#a7f3d0";
const GREEN_GLOW = "rgba(5, 150, 105, 0.4)";

const demos = [
  {
    group: "ff" as Group,
    bare: true,
    title: "Website demo",
    src: "/videos/PrelimsPass_Walkthrough.mp4",
    ring: GREEN_RING,
    glow: GREEN_GLOW,
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" aria-hidden="true">
        <defs>
          <linearGradient id="ffWebGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="0.5" stopColor="#10b981" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>
        {/* solid monitor: same full height (1 to 31) as the phone */}
        <rect x="1" y="1" width="30" height="22" rx="5" fill="url(#ffWebGrad)" />
        {/* stand */}
        <path
          d="M10.5 29.5h11M16 23v6.5"
          stroke="url(#ffWebGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* white play triangle, centred on the screen */}
        <path
          d="M13.2 6.8 22 12 13.2 17.2Z"
          fill="#fff"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  // ---- Mobile app demo: disabled until the video is available ----
  /*
  {
    group: "ff" as Group,
    bare: true,
    title: "Mobile app demo",
    src: "/videos/for-facts-mobile.mp4.mp4",
    ring: GREEN_RING,
    glow: GREEN_GLOW,
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" aria-hidden="true">
        <defs>
          <linearGradient id="ffAppGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="0.5" stopColor="#10b981" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>
        <rect x="4" y="1" width="24" height="30" rx="6" fill="url(#ffAppGrad)" />
        <rect x="13" y="3.8" width="6" height="1.4" rx="0.7" fill="#fff" fillOpacity="0.8" />
        <path
          d="M13 11.5 20.5 16.5 13 21.5Z"
          fill="#fff"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <rect x="13" y="26.5" width="6" height="1.2" rx="0.6" fill="#fff" fillOpacity="0.8" />
      </svg>
    ),
  },
  */

  // ---- wRite Right demo: disabled until the video is available ----
  /*
  {
    group: "rr" as Group,
    bare: true,
    title: "wRite Right demo",
    src: "/videos/write-right-mobile.mp4",
    ring: "#fed7aa",
    glow: "rgba(234, 88, 12, 0.35)",
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" aria-hidden="true">
        <defs>
          <linearGradient id="rrTriangle" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbbf24" />
            <stop offset="0.5" stopColor="#f97316" />
            <stop offset="1" stopColor="#e11d48" />
          </linearGradient>
        </defs>
        <path
          d="M8 4 26.5 16 8 28Z"
          fill="url(#rrTriangle)"
          stroke="url(#rrTriangle)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M11.5 9 19.5 14"
          stroke="#fff"
          strokeOpacity="0.55"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  */
];

type Demo = (typeof demos)[number];

export default function ForFactsDemos({ group = "ff" }: { group?: Group }) {
  const visibleDemos = demos.filter((d) => d.group === group);
  const [activeVideo, setActiveVideo] = useState<Demo | null>(null);
  const [videoError, setVideoError] = useState(false);

  function openVideo(demo: Demo) {
    setVideoError(false);
    setActiveVideo(demo);
  }

  function closeVideo() {
    setActiveVideo(null);
  }

  // Nothing to show for this group (e.g. wRite Right) -> render nothing
  if (visibleDemos.length === 0) return null;

  return (
    <>
      {/* Hidden preload so the demo starts instantly when clicked */}
      {visibleDemos.map((demo) => (
        <video
          key={`preload-${demo.src}`}
          src={demo.src}
          preload="auto"
          muted
          playsInline
          aria-hidden="true"
          style={{ display: "none" }}
        />
      ))}

      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: { xs: 0.5, sm: 0.75 },
          flexShrink: 0,
        }}
      >
        {visibleDemos.map((demo) => (
          <Tooltip key={demo.title} title={demo.title} arrow>
            <IconButton
              aria-label={`Play ${demo.title}`}
              onClick={() => openVideo(demo)}
              sx={{
                width: 52,
                height: 52,
                borderRadius: demo.bare ? "50%" : "16px",
                background: demo.bare ? "transparent" : "#fff",
                border: demo.bare ? "none" : `1.5px solid ${demo.ring}`,
                boxShadow: demo.bare ? "none" : "0 2px 6px rgba(15, 23, 42, 0.08)",
                filter: demo.bare ? `drop-shadow(0 4px 6px ${demo.glow})` : "none",
                transition: "transform 0.15s ease, filter 0.15s ease",
                "&:hover": {
                  background: demo.bare ? "transparent" : "#fff",
                  transform: "translateY(-2px) scale(1.1)",
                  filter: demo.bare
                    ? `drop-shadow(0 8px 12px ${demo.glow})`
                    : "none",
                },
                "&:focus-visible": {
                  outline: "2px solid #10b981",
                  outlineOffset: "2px",
                },
              }}
            >
              {demo.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      <Dialog
        fullScreen
        open={Boolean(activeVideo)}
        onClose={closeVideo}
        PaperProps={{
          sx: {
            bgcolor: "#080d14",
            color: "#fff",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            px: { xs: 1.5, sm: 2.5 },
            py: 1.25,
            borderBottom: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#86efac",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
              }}
            >
              {group === "rr" ? "WRITE-RIGHT DEMO" : "FOR-FACTS DEMO"}
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: "1rem", fontWeight: 700 }}>
              {activeVideo?.title}
            </Typography>
          </Box>

          <IconButton
            onClick={closeVideo}
            aria-label="Close video"
            sx={{
              width: 40,
              height: 40,
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              fontSize: 26,
              "&:hover": {
                background: "rgba(255,255,255,0.1)",
              },
            }}
          >
            ×
          </IconButton>
        </Box>

        <DialogContent
          sx={{
            display: "grid",
            placeItems: "center",
            p: { xs: 1, sm: 2 },
            overflow: "hidden",
          }}
        >
          {videoError ? (
            <Typography sx={{ color: "#fff", textAlign: "center" }}>
              This video couldn’t be loaded. Check that this file exists:
              <br />
              <Box component="code" sx={{ color: "#86efac" }}>
                {activeVideo?.src}
              </Box>
            </Typography>
          ) : (
            activeVideo && (
              <video
                key={activeVideo.src}
                src={activeVideo.src}
                controls
                autoPlay
                playsInline
                preload="auto"
                onError={() => setVideoError(true)}
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  maxHeight: "calc(100dvh - 76px)",
                  objectFit: "contain",
                  background: "#000",
                }}
              />
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}