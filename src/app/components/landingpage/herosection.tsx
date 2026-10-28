"use client";
import './website.css';
import Image from "next/image";
import { Box, Typography, Button } from "@mui/material";

const stats = [
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
    value: "36,500+",
    label: "Questions / Year",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    value: "24hr",
    label: "Evaluation",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    value: "6+",
    label: "Subjects Covered",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    value: "Tamil Medium",
    label: "Support",
  },
];

const subjects = [
  {
    label: "Environment",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12" />
        <path d="M12 12C12 12 7 10 5 6c3 0 5.5 1.5 7 6z" />
        <path d="M12 12C12 12 17 10 19 6c-3 0-5.5 1.5-7 6z" />
        <path d="M5 22h14" />
      </svg>
    ),
  },
  {
    label: "Geography",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    label: "Science & Tech",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3v4l-2 1-2-1V3" />
        <path d="M6 8v13" />
        <path d="M14 3v4l2 1 2-1V3" />
        <path d="M18 8v13" />
        <path d="M6 21h12" />
      </svg>
    ),
  },
  {
    label: "Polity",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="5" />
        <path d="M4 10H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2" />
        <rect x="6" y="5" width="12" height="5" rx="1" />
        <line x1="9" y1="15" x2="9" y2="18" />
        <line x1="12" y1="15" x2="12" y2="18" />
        <line x1="15" y1="15" x2="15" y2="18" />
      </svg>
    ),
  },
  {
    label: "Economics",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "History",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </svg>
    ),
  },
  {
    label: "Current Affairs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8z" />
      </svg>
    ),
  },
];

/* ══════════════════════════════════════════════
   SHARED HERO CONTENT
   Used by BOTH desktop and mobile so they always match:
   badge → heading (2x2 grid) → tagline
══════════════════════════════════════════════ */
function HeroContent() {
  return (
    <>
      {/* badge */}
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          px: "10px",
          py: "5px",
          borderRadius: "999px",
          background: "rgba(22,163,74,0.10)",
          color: "#16a34a",
          fontSize: "0.65rem",
          fontWeight: 700,
          mb: "10px",
          width: "fit-content",
        }}
      >
        {["Consistency", "Coverage", "Completeness"].map((word) => (
          <Box
            key={word}
            sx={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#16a34a",
                flexShrink: 0,
              }}
            />
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>
              {word}
            </Box>
          </Box>
        ))}
      </Box>

      {/* heading: 2 columns x 2 rows */}
      <Typography
        className="homepage-heading"
        component="h1"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          columnGap: { xs: "10px", md: "28px" },
          rowGap: "8px",
          fontSize: { xs: "0.85rem", sm: "1.15rem", md: "1.45rem" },
          fontWeight: 800,
          lineHeight: 1.25,
          letterSpacing: "-0.3px",
          color: "#0f172a",
          mb: "16px",
          wordBreak: "break-word",
        }}
      >
        <Box component="span" sx={{ display: "block" }}>
          Prelims <Box component="span" sx={{ color: "#16a34a" }}>PYQs</Box> Practice
        </Box>
        <Box component="span" sx={{ display: "block" }}>
          Mains <Box component="span" sx={{ color: "#16a34a" }}>PYQs</Box> Practice
        </Box>

        <Box component="span" sx={{ display: "block" }}>
          Prelims <Box component="span" sx={{ color: "#16a34a" }}>Mock</Box> Practice
        </Box>
        <Box component="span" sx={{ display: "block" }}>
          Mains <Box component="span" sx={{ color: "#16a34a" }}>Mock</Box> Practice
        </Box>
      </Typography>

      {/* tagline: two lines with a green accent bar */}
      <Box
        sx={{
          borderLeft: "4px solid #16a34a",
          pl: { xs: "12px", lg: "16px" },
          py: "2px",
          width: "fit-content",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1.05rem", lg: "1.3rem" },
            fontWeight: 800,
            color: "#16a34a",
            lineHeight: 1.3,
            letterSpacing: "-0.2px",
          }}
        >
          Coverage Density,
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "1.05rem", lg: "1.3rem" },
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.3,
            letterSpacing: "-0.2px",
          }}
        >
          Ensured; Fully Governed.
        </Typography>
      </Box>

      {/* stats (hidden, same as before)
      <Box sx={{ mt: "18px" }}>
        <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "20px", overflowX: "auto", "&::-webkit-scrollbar": { display: "none" } }}>
          {stats.map((s, i) => (
            <Box key={i} sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <Box
                sx={{
                  width: 32, height: 32,
                  borderRadius: "8px",
                  background: "rgba(22,163,74,0.10)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#16a34a", flexShrink: 0,
                }}
              >
                {s.icon}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: "#111827", lineHeight: 1.2, whiteSpace: "nowrap" }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: "0.67rem", color: "#94a3b8", lineHeight: 1.3, whiteSpace: "nowrap" }}>
                  {s.label}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      */}

      {/* buttons (hidden, same as before)
      <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", width: "100%", mt: "18px" }}>
        <Button
          variant="contained"
          className="homepage-primary-btn"
          sx={{ flex: 1, py: 1.05, px: 2.8, borderRadius: "10px", fontWeight: 700, textTransform: "none", fontSize: "0.875rem", whiteSpace: "nowrap", minWidth: 0 }}
        >
          Start Practicing Now
        </Button>
        <Button
          variant="outlined"
          className="homepage-secondary-btn"
          sx={{ flex: 1, py: 1.05, px: 2.8, borderRadius: "10px", fontWeight: 700, textTransform: "none", fontSize: "0.875rem", background: "#fff", whiteSpace: "nowrap", minWidth: 0 }}
        >
          View Test Plan
        </Button>
      </Box>
      */}
    </>
  );
}

export default function HeroSection() {
  return (
    <Box sx={{ position: "relative", pb: { xs: 0, lg: "40px" }, overflowX: "hidden" }}>

      {/* ════════════════════════════════════════
          MOBILE LAYOUT
      ════════════════════════════════════════ */}
      <Box sx={{ display: { xs: "block", lg: "none" }, position: "relative" }}>

        {/* Full-width image */}
        <Box sx={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
          <Image
            src="/Images/imagehero.png"
            alt="UPSC study setup"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center center" }}
          />
          {/* Smoke: image stays sharp at top, dissolves fully into white by 90% */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.55) 62%, rgba(255,255,255,0.82) 72%, rgba(255,255,255,0.95) 82%, #fff 92%)",
              zIndex: 1,
            }}
          />
        </Box>

        {/* Content: pulled up to overlap the faded area */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            mt: "-85px",
            px: "16px",
            pb: "12px",
            background: "transparent",
          }}
        >
          <HeroContent />
        </Box>
      </Box>

      {/* ════════════════════════════════════════
          DESKTOP LAYOUT
      ════════════════════════════════════════ */}
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          position: "relative",
          overflow: "hidden",
          background: `radial-gradient(circle at top left, rgba(22,163,74,0.07), transparent 30%),
                       linear-gradient(to bottom, #ffffff, #f8fafc)`,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "55% 45%",
            alignItems: "stretch",
            minHeight: "400px",
          }}
        >
          {/* Image: right col */}
          <Box
            sx={{
              order: 2,
              position: "relative",
              width: "100%",
              minHeight: "400px",
              overflow: "hidden",
            }}
          >
            <Image
              src="/Images/imagehero.png"
              alt="UPSC study setup"
              fill
              priority
              sizes="45vw"
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
            {/* Desktop: left-edge fade */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 15%, rgba(255,255,255,0.1) 30%, transparent 50%)",
                zIndex: 1,
              }}
            />
          </Box>

          {/* Content: left col */}
          <Box
            sx={{
              order: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: "max(24px, calc((100vw - 1240px) / 2 + 24px))",
              pt: 5,
              pb: "72px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <HeroContent />
          </Box>
        </Box>
      </Box>

      {/* ══════════════════════════════
          SUBJECTS BAR
      ══════════════════════════════ */}
      <Box
        sx={{
          position: { xs: "relative", lg: "absolute" },
          bottom: 0, left: 0, right: 0,
          zIndex: 10,
          mt: { xs: "12px", lg: 0 },
          px: {
            xs: "16px",
            sm: "24px",
            md: "max(24px, calc((100vw - 1240px) / 2 + 24px))",
          },
        }}
      >
        <Box
          sx={{
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)",
            border: "1px solid #f1f5f9",
            px: "14px",
            py: "12px",
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap",
            overflow: "hidden",
          }}
        >
          {/* pinned label */}
          <Box sx={{ flexShrink: 0, pr: "12px", mr: "12px", borderRight: "1px solid #e5e7eb" }}>
            <Typography sx={{ fontWeight: 700, fontSize: "0.72rem", color: "#0f172a", lineHeight: 1.35, whiteSpace: "nowrap" }}>
              Practice Across
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "0.72rem", color: "#0f172a", lineHeight: 1.35, whiteSpace: "nowrap" }}>
              All UPSC Subjects
            </Typography>
          </Box>

          {/* scrollable subjects */}
          <Box
            sx={{
              display: "flex",
              flex: 1,
              flexWrap: "nowrap",
              alignItems: "center",
              justifyContent: { xs: "flex-start", lg: "space-around" },
              overflowX: "auto",
              gap: "2px",
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {subjects.map((sub, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  cursor: "pointer",
                  px: "10px", py: "5px",
                  borderRadius: "8px",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(22,163,74,0.07)",
                    "& .subject-icon": { color: "#16a34a" },
                    "& .subject-label": { color: "#16a34a" },
                  },
                }}
              >
                <Box className="subject-icon" sx={{ color: "#60c083", transition: "color 0.2s ease", lineHeight: 0 }}>
                  {sub.icon}
                </Box>
                <Typography
                  className="subject-label"
                  sx={{ fontSize: "0.58rem", fontWeight: 600, color: "#64748b", whiteSpace: "nowrap" }}
                >
                  {sub.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* chevron hint */}
          <Box sx={{ display: { xs: "flex", lg: "none" }, flexShrink: 0, pl: "4px", color: "#94a3b8" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}