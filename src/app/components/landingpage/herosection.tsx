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

     
    </Box>
  );
}