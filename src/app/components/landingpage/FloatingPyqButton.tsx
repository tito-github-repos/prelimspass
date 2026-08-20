"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Box, Typography, Fade } from "@mui/material";

const SECTION_ID = "pyq-section";
const W = "var(--website-font)";

const BookIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 122.88 96.16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#fff"
      d="M108.82,14.33c-0.02-0.18-0.05-0.37-0.05-0.57c0-0.19,0.01-0.38,0.05-0.57V0.7
      c-8.76-0.83-17.79,0.13-25.68,3.12c-7.37,2.8-13.73,7.39-17.86,13.98v71.15c6.43-4.29,13-7.82,19.75-10.22
      c7.69-2.74,15.6-4.04,23.79-3.39V14.33L108.82,14.33L108.82,14.33z M57.71,88.21V17.68C53.74,10.68,47.32,6,40.08,3.22
      C31.87,0.08,22.64-0.63,14.6,0.51l-0.43,75.05c8.77-0.32,17.36,0.8,25.43,3.44C46.03,81.09,52.12,84.16,57.71,88.21
      L57.71,88.21L57.71,88.21z"
    />
    <path
      fill="#fff"
      d="M6.62,79.25l0.35-61.69H0v78.5c9.57-2.47,19.17-4.04,28.85-4.11c8.93-0.05,17.86,1.19,26.81,4.22
      c-5.56-4.5-11.76-7.82-18.38-9.97c-8.33-2.72-17.34-3.62-26.58-2.83c-2.09,0.17-3.91-1.38-4.09-3.46
      C6.59,79.68,6.59,79.46,6.62,79.25L6.62,79.25L6.62,79.25z M68.95,95.59c8.37-2.63,16.72-3.71,25.08-3.66
      c9.67,0.05,19.28,1.64,28.85,4.11V17.56h-6.48v62.03c0,2.09-1.7,3.79-3.79,3.79c-0.3,0-0.59-0.03-0.87-0.1
      c-8.29-1.3-16.32-0.22-24.16,2.57C81.26,88.1,75.06,91.47,68.95,95.59L68.95,95.59L68.95,95.59z"
    />
  </svg>
);

export default function FloatingPyqButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [showTip, setShowTip] = useState(false);

  // Scroll to the section once we land on the homepage with the hash present
  // (covers both a hard navigation and a client-side router.push from another page).
  useEffect(() => {
    if (pathname !== "/") return;
    if (typeof window === "undefined") return;
    if (window.location.hash !== `#${SECTION_ID}`) return;

    const timer = setTimeout(() => {
      document
        .getElementById(SECTION_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150); // small delay so the homepage content has mounted
    return () => clearTimeout(timer);
  }, [pathname]);

  // Occasionally pulse the tooltip so the button doesn't go unnoticed.
  useEffect(() => {
    const showOnce = setTimeout(() => setShowTip(true), 1500);
    const hideOnce = setTimeout(() => setShowTip(false), 5000);
    return () => {
      clearTimeout(showOnce);
      clearTimeout(hideOnce);
    };
  }, []);

  const handleClick = () => {
    const el = pathname === "/" ? document.getElementById(SECTION_ID) : null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/#${SECTION_ID}`);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        right: { xs: 16, md: 28 },
        bottom: { xs: 16, md: 28 },
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <Fade in={showTip}>
        <Box
          sx={{
            background: "#0f172a",
            color: "#fff",
            px: 1.6,
            py: 0.9,
            borderRadius: "10px",
            fontSize: "0.72rem",
            fontWeight: 600,
            fontFamily: W,
            whiteSpace: "nowrap",
            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
          }}
        >
          Practice PYQs Anytime!
        </Box>
      </Fade>

      <Box
        component="button"
        onClick={handleClick}
        aria-label="Jump to Previous Year Questions"
        sx={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "none", // reset native button border
          outline: "3px solid #bbf7d0",
          outlineOffset: "2px",
          background: "linear-gradient(135deg,#16a34a,#15803d)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1px",
          padding: 0, // reset native button padding
          font: "inherit", // reset native button font
          cursor: "pointer",
          boxShadow: "0 10px 26px rgba(22,163,74,0.45)",
          transition:
            "transform 0.2s ease, box-shadow 0.2s ease, outline-offset 0.2s ease",
          "&:hover": {
            transform: "scale(1.08)",
            boxShadow: "0 14px 34px rgba(22,163,74,0.55)",
          },
          "&:focus-visible": {
            outline: "3px solid #bbf7d0", // keep your custom ring on keyboard focus
            outlineOffset: "3px",
          },
        }}
      >
        {BookIcon}
        <Typography
          sx={{
            fontSize: "0.55rem",
            fontWeight: 800,
            color: "#fff",
            fontFamily: W,
            letterSpacing: "0.03em",
          }}
        >
          PYQ
        </Typography>
      </Box>
    </Box>
  );
}
