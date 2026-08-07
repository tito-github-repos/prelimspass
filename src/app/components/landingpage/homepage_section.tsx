"use client";
import './website.css';
import { Box, Typography, Button } from "@mui/material";

/* ══ MINI CHARTS ══ */
function SparkLine({ points, color }: { points: number[]; color: string }) {
  const w = 72, h = 36;
  const max = Math.max(...points), min = Math.min(...points);
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(p => h - ((p - min) / (max - min || 1)) * (h - 6) - 3);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const id = `sg${color.replace("#", "")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1].toFixed(1)} cy={ys[ys.length - 1].toFixed(1)} r="3" fill={color} />
    </svg>
  );
}

function MiniBar({ heights, color }: { heights: number[]; color: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: "3px", height: 36 }}>
      {heights.map((h, i) => (
        <Box key={i} sx={{
          flex: 1, height: `${h}%`,
          background: i === heights.length - 1 ? color : `${color}88`,
          borderRadius: "2px 2px 0 0",
        }} />
      ))}
    </Box>
  );
}

function Donut({ pct, color }: { pct: number; color: string }) {
  const r = 16, circ = 2 * Math.PI * r;
  return (
    <Box sx={{ position: "relative", width: 40, height: 40 }}>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} fill="none" stroke="#f1f5f9" strokeWidth="5" />
        <circle cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${(pct / 100) * circ} ${circ}`}
          strokeDashoffset={circ * 0.25} strokeLinecap="round" />
      </svg>
      <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ fontSize: "0.5rem", fontWeight: 800, color, fontFamily: "var(--website-font)" }}>{pct}%</Typography>
      </Box>
    </Box>
  );
}

function Tick({ color }: { color: string }) {
  return (
    <Box sx={{
      width: 20, height: 20, borderRadius: "50%",
      background: `${color}18`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </Box>
  );
}

/* ══ DATA ══ */
const features = [
  { title: "Unlimited Practice", desc: "Topic-wise & subject-wise questions with unlimited retakes.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
  { title: "Live Mock Exams", desc: "Real UPSC pattern mock tests with ranking and analysis.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg> },
  { title: "Detailed Analytics", desc: "Track accuracy, speed, strengths and topic performance.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><polyline points="2 20 22 20" /></svg> },
  { title: "Mains Evaluation", desc: "Submit answers and get evaluated within 24 hours.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg> },
  { title: "UPSC Pattern", desc: "All tests strictly follow UPSC exam pattern and difficulty level.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
  { title: "Progress Tracking", desc: "Monitor your journey with detailed reports and trend analysis.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> },
];

const offerings = [
  {
    color: "#16a34a", lightBg: "#f0fdf4", borderCol: "#bbf7d0",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    title: "Prelims Practice", sub: "Unlimited practice. Unlimited growth. Crack Prelims with confidence.",
    pm: "₹1,111", py: "₹11,111",
    feats: ["Unlimited Subject & Topic Tests", "PYQ Practice", "Live Mock Exams", "Performance Analytics", "Progress Tracking"],
    btn: "Explore Prelims Tests",
  },
  {
    color: "#2563eb", lightBg: "#eff6ff", borderCol: "#bfdbfe",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    title: "Mains Evaluation", sub: "Write better. Get better. Detailed evaluation within 24 hours.",
    pm: "₹1,111", py: "₹11,111",
    feats: ["Weekly Essay & GS Papers", "24hr Answer Evaluation", "Detailed Feedback", "Improvement Suggestions", "Ethics & Tamil Medium Support"],
    btn: "Explore Mains Tests",
  },
  {
    color: "#7c3aed", lightBg: "#f5f3ff", borderCol: "#ddd6fe",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    title: "1-to-1 Consultation", sub: "Personalized guidance. Focused on your success.",
    pm: "₹1,111", py: null,
    feats: ["1 Hour One-to-One Session", "Prelims Strategy", "Mains Guidance", "Optional & Faculty Guidance", "Tamil Medium Support"],
    btn: "Book a Session",
  },
];

const schedule = [
  { day: "Monday",    topic: "Environment"    },
  { day: "Tuesday",   topic: "Geography"      },
  { day: "Wednesday", topic: "Science & Tech" },
  { day: "Thursday",  topic: "Polity"         },
  { day: "Friday",    topic: "Economy"        },
  { day: "Saturday",  topic: "History"        },
  { day: "Sunday",    topic: "CSAT"           },
];

const dFeats = ["3650+ questions practice in a year", "100 mock tests before prelims", "UPSC pattern & standard", "Detailed performance analysis", "Subject-wise leaderboards"];
const wFeats = ["All Saturday: Test Practice – Essay & Ethics papers", "All Sunday: Test Practice – Any two of the GS papers", "Get evaluated within 24 hours", "Detailed feedback & model answers", "Improve writing skills consistently"];

const steps = [
  { n: "1", title: "Choose Subject", desc: "Select a subject or topic to practice", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg> },
  { n: "2", title: "Practice Questions", desc: "Attempt questions with unlimited retakes", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> },
  { n: "3", title: "Analyze Results", desc: "Get detailed analysis and performance report", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><polyline points="2 20 22 20" /></svg> },
  { n: "4", title: "Attend Live Mocks", desc: "Participate in live mock exams", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg> },
  { n: "5", title: "Get Mentor Feedback", desc: "Receive evaluation & mentor feedback", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
  { n: "6", title: "Improve Consistently", desc: "Work on weak areas and improve steadily", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
];

const W = "var(--website-font)";

export default function HomepageSections() {
  return (
    <>

      {/* ══════════════════════════════════════════════
          §1  WHY CHOOSE
      ══════════════════════════════════════════════ */}
      <Box component="section" sx={{ pt: "24px", pb: "24px", background: "#fff" }}>
        <Box sx={{ maxWidth: 1240, mx: "auto", px: { xs: "18px", sm: "24px" } }}>
          <Box sx={{ textAlign: "center", mb: 2.5 }}>
            <Typography component="h2" sx={{
              fontSize: { xs: "1.55rem", md: "2rem" }, fontWeight: 800,
              color: "#0f172a", fontFamily: W, lineHeight: 1.2,
            }}>
              Why Aspirants Choose <Box component="span" sx={{ color: "#16a34a" }}>PrelimsPass</Box>?
            </Typography>
          </Box>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3,1fr)", lg: "repeat(6,1fr)" },
            gap: { xs: 1.5, md: 2 },
          }}>
            {features.map((f, i) => (
              <Box key={i} sx={{
                background: "#fff",
                border: "1.5px solid #e5e7eb",
                borderRadius: "14px",
                p: { xs: "14px 10px", md: "16px 12px" },
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                gap: 0.8, cursor: "default",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#16a34a",
                  boxShadow: "0 8px 28px rgba(22,163,74,0.13)",
                  transform: "translateY(-4px)",
                  "& .fbox": { background: "#16a34a", color: "#fff" },
                },
              }}>
                <Box className="fbox" sx={{
                  width: 44, height: 44, borderRadius: "12px",
                  background: "rgba(22,163,74,0.09)", color: "#16a34a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease",
                }}>
                  {f.icon}
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: "0.78rem", color: "#111827", fontFamily: W, lineHeight: 1.3 }}>
                  {f.title}
                </Typography>
                <Typography sx={{ fontSize: "0.68rem", color: "#6b7280", lineHeight: 1.5, fontFamily: W }}>
                  {f.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ══════════════════════════════════════════════
          §2  OUR OFFERINGS
      ══════════════════════════════════════════════ */}
      <Box component="section" sx={{ pt: "24px", pb: "24px", background: "#f8fafc" }}>
        <Box sx={{ maxWidth: 1240, mx: "auto", px: { xs: "18px", sm: "24px" } }}>

          <Box sx={{ textAlign: "center", mb: 2.5 }}>
            <Typography component="h2" sx={{ fontSize: { xs: "1.55rem", md: "2rem" }, fontWeight: 800, color: "#0f172a", fontFamily: W, mb: 0.5 }}>
              Our Offerings
            </Typography>
            <Typography sx={{ fontSize: "0.88rem", color: "#64748b", fontFamily: W }}>
              Everything you need for comprehensive UPSC preparation
            </Typography>
          </Box>

          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" },
            gap: { xs: 2, md: 2 },
            alignItems: "stretch",
          }}>
            {offerings.map((o, i) => (
              <Box key={i} sx={{
                background: "#fff",
                border: "2px solid #e5e7eb",
                borderRadius: "18px",
                overflow: "hidden",
                display: "flex", flexDirection: "column",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                transition: "all 0.22s ease",
                "&:hover": {
                  borderColor: o.color,
                  transform: "translateY(-5px)",
                  boxShadow: `0 20px 48px ${o.color}22`,
                },
              }}>

                {/* Tinted header */}
                <Box sx={{
                  background: o.lightBg,
                  borderBottom: `1.5px solid ${o.borderCol}`,
                  p: "16px 20px",
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{
                      width: 44, height: 44, borderRadius: "13px",
                      background: "#fff",
                      border: `1.5px solid ${o.borderCol}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: `0 2px 10px ${o.color}18`,
                    }}>
                      {o.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: o.color, fontFamily: W, lineHeight: 1.2 }}>
                        {o.title}
                      </Typography>
                      <Typography sx={{ fontSize: "0.73rem", color: "#6b7280", lineHeight: 1.5, fontFamily: W, mt: 0.2 }}>
                        {o.sub}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ p: "16px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  {/* Price pills */}
                  <Box sx={{ display: "flex", gap: 1.5, mb: 1.8 }}>
                    <Box sx={{
                      flex: 1, p: "8px 10px", borderRadius: "11px",
                      background: `${o.color}0a`, border: `1.5px solid ${o.color}25`,
                      display: "flex", flexDirection: "column", alignItems: "center",
                    }}>
                      <Typography sx={{ fontWeight: 900, fontSize: "1.2rem", color: o.color, fontFamily: W, lineHeight: 1 }}>
                        {o.pm}
                      </Typography>
                      <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", fontFamily: W, mt: 0.2 }}>/ month</Typography>
                    </Box>
                    {o.py ? (
                      <Box sx={{
                        flex: 1, p: "8px 10px", borderRadius: "11px",
                        background: `${o.color}0a`, border: `1.5px solid ${o.color}25`,
                        display: "flex", flexDirection: "column", alignItems: "center",
                      }}>
                        <Typography sx={{ fontWeight: 900, fontSize: "1.2rem", color: o.color, fontFamily: W, lineHeight: 1 }}>
                          {o.py}
                        </Typography>
                        <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", fontFamily: W, mt: 0.2 }}>/ year</Typography>
                      </Box>
                    ) : (
                      <Box sx={{
                        flex: 1, p: "8px 10px", borderRadius: "11px",
                        background: "#f8fafc", border: "1.5px solid #e5e7eb",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", fontFamily: W }}>Per session</Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ height: "1px", background: "#f1f5f9", mb: 1.5 }} />

                  {/* Features */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, flex: 1, mb: 2 }}>
                    {o.feats.map((feat, fi) => (
                      <Box key={fi} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Tick color={o.color} />
                        <Typography sx={{ fontSize: "0.8rem", color: "#374151", fontFamily: W }}>{feat}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button variant="outlined"
                    endIcon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>}
                    sx={{
                      borderColor: o.color, color: o.color,
                      borderRadius: "10px", fontWeight: 700, textTransform: "none",
                      fontSize: "0.83rem", py: 0.9, fontFamily: W,
                      "&:hover": { background: `${o.color}08`, borderColor: o.color },
                    }}>
                    {o.btn}
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ══════════════════════════════════════════════
          §3  TEST FORMATS
      ══════════════════════════════════════════════ */}
      <Box component="section" sx={{ pt: "24px", pb: "24px", background: "#fff" }}>
        <Box sx={{ maxWidth: 1240, mx: "auto", px: { xs: "18px", sm: "24px" } }}>

          <Box sx={{ textAlign: "center", mb: 2.5 }}>
            <Typography component="h2" sx={{ fontSize: { xs: "1.55rem", md: "2rem" }, fontWeight: 800, color: "#0f172a", fontFamily: W }}>
              Our Test Formats
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mb: 2 }}>

            {/* ── Daily Prelims ── */}
            <Box sx={{
              borderRadius: "16px", overflow: "hidden",
              border: "1.5px solid #d1fae5",
              boxShadow: "0 2px 16px rgba(22,163,74,0.08)",
              display: "flex", flexDirection: "column",
            }}>
              {/* Dark header */}
              <Box sx={{
                background: "linear-gradient(135deg,#0f172a,#1a2e1a)",
                p: "12px 18px",
                display: "flex", alignItems: "center", gap: 1.5,
              }}>
                <Box sx={{
                  width: 34, height: 34, borderRadius: "9px",
                  background: "rgba(22,163,74,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#fff", fontFamily: W }}>Daily Tests – Prelims</Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)", fontFamily: W }}>Systematic subject-wise schedule</Typography>
                </Box>
              </Box>

              {/* Body */}
              <Box
                sx={{
                  p: { xs: "12px", md: "12px 16px" },
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "44% 1fr" },
                  gap: { xs: 1.5, md: 1.5 },
                  alignItems: "start",
                }}
              >
                {/* Schedule table */}
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #e8f5e9" }}>
                    {schedule.map((row, i) => (
                      <Box key={i} sx={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        px: 1.2, py: { xs: "4px", sm: "5px" },
                        background: i % 2 === 0 ? "#fafafa" : "#fff",
                        borderBottom: i < schedule.length - 1 ? "1px solid #f1f5f9" : "none",
                        transition: "background 0.15s ease",
                        "&:hover": { background: "rgba(22,163,74,0.04)" },
                      }}>
                        {/* FIX: removed MON/TUE abbreviation badge — only full day name */}
                        <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.72rem" }, fontWeight: 500, color: "#374151", fontFamily: W }}>
                          {row.day}
                        </Typography>
                        <Box sx={{
                          px: 1, py: "2px", borderRadius: "5px",
                          background: "rgba(22,163,74,0.07)",
                          border: "1px solid rgba(22,163,74,0.14)",
                          flexShrink: 0,
                        }}>
                          <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#15803d", fontFamily: W, whiteSpace: "nowrap" }}>
                            {row.topic}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Right — features + illustration pinned to bottom-right */}
                <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.7 }}>
                    {dFeats.map((f, i) => (
                      <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 0.8 }}>
                        <Tick color="#16a34a" />
                        <Typography sx={{ fontSize: { xs: "0.62rem", sm: "0.72rem" }, color: "#374151", fontFamily: W, lineHeight: 1.4 }}>{f}</Typography>
                      </Box>
                    ))}
                  </Box>
                  {/* FIX: illustration pinned bottom-right, smaller size, no extra height */}
                  <Box
                    component="img"
                    src="/Images/prelims.png"
                    alt="Prelims illustration"
                    sx={{
                      display: { xs: "none", sm: "block" },
                      width: 110,
                      height: 110,
                      objectFit: "contain",
                      filter: "drop-shadow(0 4px 16px rgba(22,163,74,0.22))",
                      alignSelf: "flex-end",
                      mt: "auto",
                      ml: "auto",
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* ── Weekly Mains ── */}
            <Box sx={{
              borderRadius: "16px", overflow: "hidden",
              border: "1.5px solid #bfdbfe",
              boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
              display: "flex", flexDirection: "column",
            }}>
              {/* Dark header */}
              <Box sx={{
                background: "linear-gradient(135deg,#0f172a,#0f1f3a)",
                p: "12px 18px",
                display: "flex", alignItems: "center", gap: 1.5,
              }}>
                <Box sx={{
                  width: 34, height: 34, borderRadius: "9px",
                  background: "rgba(37,99,235,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#fff", fontFamily: W }}>Weekly Tests – Mains</Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)", fontFamily: W }}>Essay & GS answer writing practice</Typography>
                </Box>
              </Box>

              {/* Body — FIX: tighter padding, smaller illustration column */}
              <Box sx={{ p: "12px 16px", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 120px" }, gap: 1.5, flex: 1, alignItems: "start" }}>

                {/* Left — pills + features */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* 3 stat pills */}
                  <Box sx={{
                    display: "flex", gap: 1, mb: 1.5,
                    flexWrap: { xs: "nowrap", sm: "wrap" },
                    overflowX: { xs: "auto", sm: "visible" },
                    pb: { xs: 1, sm: 0 },
                    "&::-webkit-scrollbar": { display: "none" },
                  }}>
                    {[["Every Weekend", "Tests", "#16a34a"], ["24 Hours", "Evaluation", "#2563eb"], ["Model Answers", "Provided", "#7c3aed"]].map(([v, l, c], i) => (
                      <Box key={i} sx={{
                        flex: 1, minWidth: 72, p: "7px 10px", borderRadius: "9px",
                        background: `${c}09`, border: `1.5px solid ${c}20`, textAlign: "center",
                      }}>
                        <Typography sx={{ fontWeight: 800, fontSize: { xs: "0.62rem", sm: "0.72rem" }, color: c, fontFamily: W, lineHeight: 1.2 }}>{v}</Typography>
                        <Typography sx={{ fontSize: "0.58rem", color: "#6b7280", fontFamily: W }}>{l}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Features */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.7 }}>
                    {wFeats.map((f, i) => (
                      <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 0.8 }}>
                        <Tick color="#2563eb" />
                        <Typography sx={{ fontSize: { xs: "0.62rem", sm: "0.72rem" }, color: "#374151", fontFamily: W, lineHeight: 1.4 }}>{f}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* FIX: illustration pinned to bottom, smaller size, no wrapper Box inflating height */}
                <Box
                  component="img"
                  src="/Images/mains.png"
                  alt="Mains illustration"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    width: 110,
                    height: 110,
                    objectFit: "contain",
                    filter: "drop-shadow(0 4px 16px rgba(37,99,235,0.22))",
                    alignSelf: "flex-end",
                    mt: "auto",
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Data Insights Panel */}
          <Box sx={{ borderRadius: "18px", overflow: "hidden", border: "1.5px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <Box sx={{
              background: "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",
              p: { xs: "14px 18px", md: "16px 24px" },
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2,
            }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.05rem", md: "1.2rem" }, color: "#fff", fontFamily: W }}>
                  Data. <Box component="span" sx={{ color: "#4ade80" }}>Insights.</Box> Improvement.
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#64748b", fontFamily: W, mt: 0.2 }}>
                  Analytics that make your preparation smarter
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, px: 1.5, py: 0.6, borderRadius: "8px", background: "rgba(74,222,128,0.12)" }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} />
                <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#4ade80", fontFamily: W }}>Live Data</Typography>
              </Box>
            </Box>
            <Box sx={{ background: "#fff", p: { xs: "14px", md: "18px 24px" }, display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 1.5 }}>
              <Box sx={{ p: "14px", borderRadius: "13px", background: "linear-gradient(135deg,#f0fdf4,#fff)", border: "1.5px solid #d1fae5", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 6px 20px rgba(22,163,74,0.1)", transition: "all 0.2s" } }}>
                <SparkLine points={[28, 40, 34, 52, 46, 60, 54, 68, 63, 76]} color="#16a34a" />
                <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#111827", fontFamily: W, mt: 1, mb: 0.2 }}>Trend Analysis</Typography>
                <Typography sx={{ fontSize: "0.68rem", color: "#6b7280", fontFamily: W }}>Subject trend (2011 – 2025)</Typography>
                <Box sx={{ mt: 0.6, display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography sx={{ fontSize: "0.65rem", color: "#16a34a", fontWeight: 700, fontFamily: W }}>↑ 12%</Typography>
                  <Typography sx={{ fontSize: "0.63rem", color: "#94a3b8", fontFamily: W }}>vs last year</Typography>
                </Box>
              </Box>
              <Box sx={{ p: "14px", borderRadius: "13px", background: "linear-gradient(135deg,#eff6ff,#fff)", border: "1.5px solid #bfdbfe", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 6px 20px rgba(37,99,235,0.1)", transition: "all 0.2s" } }}>
                <MiniBar heights={[38, 55, 45, 70, 52, 82, 65, 90]} color="#2563eb" />
                <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#111827", fontFamily: W, mt: 1, mb: 0.2 }}>Performance Analytics</Typography>
                <Typography sx={{ fontSize: "0.68rem", color: "#6b7280", fontFamily: W }}>Excel-style detailed reports</Typography>
                <Box sx={{ mt: 0.6, display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography sx={{ fontSize: "0.65rem", color: "#2563eb", fontWeight: 700, fontFamily: W }}>90%</Typography>
                  <Typography sx={{ fontSize: "0.63rem", color: "#94a3b8", fontFamily: W }}>top score</Typography>
                </Box>
              </Box>
              <Box sx={{ p: "14px", borderRadius: "13px", background: "linear-gradient(135deg,#f5f3ff,#fff)", border: "1.5px solid #ddd6fe", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 6px 20px rgba(124,58,237,0.1)", transition: "all 0.2s" } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <Donut pct={68} color="#7c3aed" />
                  <Box>
                    {[["GS1", "32%", "#7c3aed"], ["GS2", "28%", "#a78bfa"], ["GS3", "40%", "#6d28d9"]].map(([s, p, c], i) => (
                      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.25 }}>
                        <Box sx={{ width: 5, height: 5, borderRadius: "50%", background: c, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: "0.6rem", color: "#374151", fontFamily: W }}>{s}</Typography>
                        <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: c, fontFamily: W }}>{p}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#111827", fontFamily: W, mt: 1, mb: 0.2 }}>Subject Weightage</Typography>
                <Typography sx={{ fontSize: "0.68rem", color: "#6b7280", fontFamily: W }}>Weightage (2011 – 2025)</Typography>
              </Box>
              <Box sx={{ p: "14px", borderRadius: "13px", background: "linear-gradient(135deg,#fff7ed,#fff)", border: "1.5px solid #fed7aa", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 6px 20px rgba(234,88,12,0.1)", transition: "all 0.2s" } }}>
                <MiniBar heights={[70, 66, 74, 68, 80, 72, 84, 78]} color="#ea580c" />
                <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#111827", fontFamily: W, mt: 1, mb: 0.2 }}>Cut-off Trends</Typography>
                <Typography sx={{ fontSize: "0.68rem", color: "#6b7280", fontFamily: W }}>Category-wise analysis (2020–2025)</Typography>
                <Box sx={{ mt: 0.6, display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography sx={{ fontSize: "0.65rem", color: "#ea580c", fontWeight: 700, fontFamily: W }}>↑ 3.2</Typography>
                  <Typography sx={{ fontSize: "0.63rem", color: "#94a3b8", fontFamily: W }}>pts this cycle</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ══════════════════════════════════════════════
            HOW IT WORKS — compact
      ══════════════════════════════════════════════ */}
      <Box component="section" sx={{
        pt: "32px", pb: "36px",
        background: "#0f172a",
        position: "relative", overflow: "hidden",
      }}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(22,163,74,0.08) 0%,transparent 68%)",
          pointerEvents: "none",
        }} />
        <Box sx={{ maxWidth: 1240, mx: "auto", px: { xs: "18px", sm: "24px" }, position: "relative" }}>
          <Box sx={{ textAlign: "center", mb: { xs: 3, md: 3.5 } }}>
            <Typography component="h2" sx={{ fontSize: { xs: "1.4rem", md: "1.8rem" }, fontWeight: 800, color: "#fff", fontFamily: W }}>
              How It Works?
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", color: "#475569", fontFamily: W, mt: 0.6 }}>
              Your complete UPSC preparation in 6 simple steps
            </Typography>
          </Box>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(3,1fr)", lg: "repeat(6,1fr)" },
            gap: { xs: 2, md: 1.5 },
            position: "relative",
          }}>
            {steps.map((s, i) => (
              <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative" }}>
                {i < steps.length - 1 && (
                  <Box sx={{
                    display: { xs: "none", lg: "block" },
                    position: "absolute", top: 26,
                    left: "calc(50% + 28px)",
                    width: "calc(100% - 24px)",
                    height: "1.5px",
                    background: "linear-gradient(90deg, rgba(74,222,128,0.45), rgba(74,222,128,0.1))",
                    zIndex: 0,
                    "&::after": {
                      content: '""', position: "absolute", right: -1, top: -4,
                      width: 7, height: 7,
                      borderTop: "1.5px solid rgba(74,222,128,0.45)",
                      borderRight: "1.5px solid rgba(74,222,128,0.45)",
                      transform: "rotate(45deg)",
                    },
                  }} />
                )}
                <Box sx={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "rgba(22,163,74,0.1)",
                  border: "1.5px solid rgba(74,222,128,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#4ade80", mb: 1.5, position: "relative", zIndex: 1,
                  transition: "all 0.22s ease",
                  "&:hover": {
                    background: "#16a34a", color: "#fff",
                    border: "1.5px solid #16a34a",
                    transform: "scale(1.1)",
                    boxShadow: "0 0 20px rgba(22,163,74,0.45)",
                  },
                }}>
                  {s.icon}
                  <Box sx={{
                    position: "absolute", top: -7, right: -7,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#16a34a", color: "#fff",
                    fontSize: "0.58rem", fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: W, boxShadow: "0 2px 8px rgba(22,163,74,0.6)",
                  }}>{s.n}</Box>
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: "0.78rem", color: "#e2e8f0", mb: 0.4, fontFamily: W, lineHeight: 1.3 }}>
                  {s.title}
                </Typography>
                <Typography sx={{ fontSize: "0.67rem", color: "#475569", lineHeight: 1.5, fontFamily: W }}>
                  {s.desc}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ textAlign: "center", mt: { xs: 4, md: 4 } }}>
            <Button variant="contained"
              endIcon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>}
              sx={{
                background: "linear-gradient(135deg,#16a34a,#15803d)",
                color: "#fff", px: 3.5, py: 1.1,
                borderRadius: "11px", fontWeight: 700, textTransform: "none",
                fontSize: "0.88rem", fontFamily: W,
                boxShadow: "0 8px 28px rgba(22,163,74,0.4)",
                "&:hover": { opacity: 0.9, transform: "translateY(-2px)", boxShadow: "0 12px 36px rgba(22,163,74,0.5)" },
                transition: "all 0.22s ease",
              }}>
              Start Your Journey Today
            </Button>
          </Box>
        </Box>
      </Box>

    </>
  );
}