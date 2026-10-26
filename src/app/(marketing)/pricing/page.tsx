
// "use client";

// import Link from "next/link";
// import { useRef, useState } from "react";
// import type { CSSProperties, ReactNode } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   Container,
//   GlobalStyles,
//   Grid,
//   Stack,
//   Typography,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";

// import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
// import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
// import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
// import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
// import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
// import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";
// import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";
// import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
// import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
// import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
// import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
// import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
// import AllInclusiveRoundedIcon from "@mui/icons-material/AllInclusiveRounded";

// /* ─────────────────────────── Tuning knobs ─────────────────────────── */

// const GREEN = "#16a34a";
// const DARK_GREEN = "#14532d";
// const GREEN_GRADIENT = `linear-gradient(165deg, ${DARK_GREEN} 0%, #15803d 60%, ${GREEN} 100%)`;

// const SLOTS = 5;
// const CENTER = 2; // slot index (0-4) that gets the highlight
// const GAP = 20; // px gap between cards on desktop (keep in sync with grid gap)
// const SLOT_Y = [30, 12, -26, 12, 30]; // vertical offset per slot -> the arc
// const SLOT_SCALE = [0.97, 1, 1.06, 1, 0.97]; // center card is bigger
// const SLOT_ROT = [14, 7, 0, -7, -14]; // rotateY (deg): outer cards face the center
// const PERSPECTIVE = 1500; // px, depth of the 3D tilt
// const ROTATE_MS = 800; // duration of one rotation
// const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
// const INTENT_DELAY = 180; // ms the cursor must rest on a card before it rotates
// const COOLDOWN = ROTATE_MS + 50; // ms before another rotation is allowed

// const mod = (n: number, m: number) => ((n % m) + m) % m;

// /* ───────────────────────────── Plan data ───────────────────────────── */

// type Plan = {
//   id: string;
//   badge?: string;
//   icon: ReactNode;
//   title: string;
//   sub: string;
//   features: string[];
//   price: string;
//   note: string;
//   cta: string;
//   href: string;
//   featured?: boolean; // default highlighted plan
//   outlined?: boolean; // outlined button when not highlighted
// };

// const plans: Plan[] = [
//   {
//     id: "free",
//     badge: "FREE TRIAL",
//     icon: <CardGiftcardRoundedIcon />,
//     title: "Free Plan",
//     sub: "Free access",
//     features: [
//       "Prelims PYQ Access and Practice",
//       "FREE for all registered users",
//       "Basic Dashboard Access",
//       "No Payment Required",
//       "Login / Register Required",
//     ],
//     price: "₹0",
//     note: "(Free Forever)",
//     cta: "Get Started",
//     href: "/register?plan=free-trial",
//     outlined: true,
//   },
//   {
//     id: "mobile",
//     icon: <PhoneAndroidRoundedIcon />,
//     title: "Prelims Mobile App",
//     sub: "Subjects Coverage",
//     features: [
//       "Complete Prelims subject-wise coverage",
//       "New facts added every week",
//       "Revise more, in the shortest possible time",
//     ],
//     price: "₹999",
//     note: "(One Time / Annual Plan)",
//     cta: "Get Started",
//     href: "/register?plan=mobile",
//   },
//   {
//     id: "web",
//     badge: "Most Popular",
//     icon: <LaptopMacRoundedIcon />,
//     title: "Prelims Web App",
//     sub: "100 Mock Tests from 2027 January 1, Friday.",
//     features: [
//       "100 full-length mock tests",
//       "Detailed analysis & performance tracking",
//       "Attempt online from any device",
//       "Real UPSC pattern (+2 / -0.66)",
//     ],
//     price: "₹999",
//     note: "(One Time / Annual Plan)",
//     cta: "Get Started",
//     href: "/register?plan=web",
//     featured: true,
//   },
//   {
//     id: "mains-pyq",
//     badge: "PYQs",
//     icon: <DescriptionRoundedIcon />,
//     title: "GS Mains",
//     sub: "14 years PYQs + 70 Papers Answer Scripts Evaluation",
//     features: [
//       "14 years of GS Mains PYQs",
//       "70 papers with answer scripts",
//       "Expert evaluation & detailed feedback",
//     ],
//     price: "₹999",
//     note: "(One Time / Annual Plan)",
//     cta: "Get Started",
//     href: "/register?plan=mains-pyq",
//   },
//   {
//     id: "mains-mock",
//     badge: "MOCK TESTS",
//     icon: <GpsFixedRoundedIcon />,
//     title: "GS Mains",
//     sub: "10 MockTests + 50 Papers Answer Scripts Evaluation",
//     features: [
//       "10 full-length GS Mains mock tests",
//       "50 papers with answer scripts",
//       "Expert evaluation & detailed feedback",
//     ],
//     price: "₹999",
//     note: "(One Time / Annual Plan)",
//     cta: "Get Started",
//     href: "/register?plan=mains-mock",
//   },
// ];

// const whyChoose = [
//   {
//     icon: <GpsFixedRoundedIcon />,
//     title: "Focused Preparation",
//     subtitle: "Subject-wise & exam-oriented learning",
//   },
//   {
//     icon: <BarChartRoundedIcon />,
//     title: "Data Driven Insights",
//     subtitle: "Track your progress with real-time analytics",
//   },
//   {
//     icon: <PersonRoundedIcon />,
//     title: "Expert Mentorship",
//     subtitle: "Learn from experienced mentors",
//   },
//   {
//     icon: <SecurityRoundedIcon />,
//     title: "Track Your Progress",
//     subtitle: "Stay consistent and achieve your goals",
//   },
// ];

// /* ───────────────────────────── Plan card ───────────────────────────── */

// type PlanCardProps = {
//   plan: Plan;
//   index: number; // original position in the plans array (its grid cell)
//   slot: number; // current visual position (0-4)
//   isCenter: boolean;
//   wrapping: boolean; // card is wrapping around the end of the row
//   spin: number; // rotation counter, used to restart the fade animation
//   onHover: () => void;
//   onLeave: () => void;
//   onFocus: () => void;
// };

// function PlanCard({
//   plan,
//   index,
//   slot,
//   isCenter,
//   wrapping,
//   spin,
//   onHover,
//   onLeave,
//   onFocus,
// }: PlanCardProps) {
//   const colorTransition = "color 0.5s ease, background 0.5s ease";

//   const btnBg = isCenter ? "#d9f99d" : plan.outlined ? "#fff" : GREEN;
//   const btnColor = isCenter ? DARK_GREEN : plan.outlined ? GREEN : "#fff";
//   const btnHoverBg = isCenter
//     ? "#bef264"
//     : plan.outlined
//       ? "#ecfdf3"
//       : "#15803d";

//   return (
//     <Card
//       onMouseEnter={onHover}
//       onMouseMove={onHover}
//       onMouseLeave={onLeave}
//       onFocus={onFocus}
//       // --d = how many cells this card is displaced from its own grid cell
//       style={{ "--d": slot - index } as CSSProperties}
//       sx={{
//         position: "relative",
//         overflow: "hidden",
//         display: "flex",
//         flexDirection: "column",
//         borderRadius: "24px",
//         border: "1px solid",
//         borderColor: isCenter ? GREEN : "#e2efe6",
//         background:
//           "radial-gradient(circle at 100% 0%, #e3f5e9 0%, rgba(227,245,233,0) 42%), #fff",
//         boxShadow: isCenter
//           ? "0 28px 50px rgba(20, 83, 45, 0.35)"
//           : "0 10px 28px rgba(15, 23, 42, 0.08)",
//         zIndex: isCenter ? 3 : wrapping ? 0 : 1,

//         // Desktop: slide to the slot, follow the arc, tilt toward the center.
//         // Below lg the cards simply stack normally.
//         transform: {
//           xs: "none",
//           lg: `translate(calc(var(--d) * (100% + ${GAP}px)), ${SLOT_Y[slot]}px) scale(${SLOT_SCALE[slot]}) rotateY(${SLOT_ROT[slot]}deg)`,
//         },
//         transition: `transform ${ROTATE_MS}ms ${EASE}, box-shadow 0.6s ease, border-color 0.6s ease`,

//         // A card that wraps around the row fades out while it travels
//         // behind the others, then fades back in at its new slot
//         animation: {
//           xs: "none",
//           lg: wrapping
//             ? `${spin % 2 === 0 ? "pricingDipA" : "pricingDipB"} ${ROTATE_MS}ms ease`
//             : "none",
//         },

//         "@media (prefers-reduced-motion: reduce)": {
//           transition: "none",
//           animation: "none",
//         },
//       }}
//     >
//       {/* Green layer that fades in when the card is highlighted */}
//       <Box
//         aria-hidden
//         sx={{
//           position: "absolute",
//           inset: 0,
//           background: GREEN_GRADIENT,
//           opacity: isCenter ? 1 : 0,
//           transition: "opacity 0.6s ease",
//           pointerEvents: "none",
//         }}
//       />

//       <CardContent
//         sx={{
//           position: "relative",
//           zIndex: 1,
//           flexGrow: 1,
//           display: "flex",
//           flexDirection: "column",
//           p: { xs: 2.5, lg: 2, xl: 2.75 },
//           "&:last-child": { pb: { xs: 2.5, lg: 2, xl: 2.75 } },
//         }}
//       >
//         {/* Icon + badge */}
//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="flex-start"
//           mb={2}
//         >
//           <Box
//             sx={{
//               width: 54,
//               height: 54,
//               borderRadius: "50%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               background: isCenter ? "rgba(255,255,255,0.18)" : "#e3f5e9",
//               color: isCenter ? "#fff" : GREEN,
//               transition: colorTransition,
//               "& svg": { fontSize: 28 },
//             }}
//           >
//             {plan.icon}
//           </Box>

//           {plan.badge && (
//             <Chip
//               size="small"
//               icon={
//                 plan.featured ? (
//                   <WorkspacePremiumRoundedIcon sx={{ fontSize: 16 }} />
//                 ) : undefined
//               }
//               label={plan.badge}
//               sx={{
//                 fontWeight: 700,
//                 fontSize: "0.7rem",
//                 background: plan.featured
//                   ? "#fde68a"
//                   : isCenter
//                     ? "rgba(255,255,255,0.2)"
//                     : "#eef2f1",
//                 color: plan.featured
//                   ? "#78350f"
//                   : isCenter
//                     ? "#fff"
//                     : "#334155",
//                 transition: colorTransition,
//               }}
//             />
//           )}
//         </Stack>

//         {/* Title + subtitle */}
//         <Typography
//           fontWeight={800}
//           sx={{
//             fontSize: { xs: "1.35rem", lg: "1.1rem", xl: "1.3rem" },
//             lineHeight: 1.25,
//             color: isCenter ? "#fff" : "#0b1b2b",
//             transition: colorTransition,
//           }}
//         >
//           {plan.title}
//         </Typography>
//         <Typography
//           sx={{
//             mt: 0.75,
//             mb: 2,
//             fontSize: { xs: "0.88rem", lg: "0.8rem", xl: "0.86rem" },
//             lineHeight: 1.45,
//             color: isCenter ? "rgba(255,255,255,0.85)" : "#5b6470",
//             minHeight: { lg: "4.4em" },
//             transition: colorTransition,
//           }}
//         >
//           {plan.sub}
//         </Typography>

//         <Box
//           sx={{
//             borderBottom: "1px solid",
//             borderColor: isCenter ? "rgba(255,255,255,0.25)" : "#e5e7eb",
//             mb: 2,
//             transition: "border-color 0.5s ease",
//           }}
//         />

//         {/* Features */}
//         <Stack spacing={1.4} mb={3}>
//           {plan.features.map((f) => (
//             <Stack key={f} direction="row" spacing={1} alignItems="flex-start">
//               <CheckCircleIcon
//                 sx={{
//                   color: isCenter ? "#bbf7d0" : GREEN,
//                   fontSize: 17,
//                   mt: "2px",
//                   flexShrink: 0,
//                   transition: colorTransition,
//                 }}
//               />
//               <Typography
//                 sx={{
//                   fontSize: { xs: "0.88rem", lg: "0.78rem", xl: "0.85rem" },
//                   lineHeight: 1.4,
//                   color: isCenter ? "#fff" : "#374151",
//                   transition: colorTransition,
//                 }}
//               >
//                 {f}
//               </Typography>
//             </Stack>
//           ))}
//         </Stack>

//         {/* Price + button, pinned to the bottom so every card lines up */}
//         <Box sx={{ mt: "auto" }}>
//           <Box
//             sx={{
//               borderRadius: "14px",
//               py: 1.4,
//               textAlign: "center",
//               mb: 1.75,
//               border: "1px solid",
//               borderColor: isCenter ? "rgba(253,230,138,0.7)" : "transparent",
//               background: isCenter ? "rgba(255,255,255,0.14)" : "#ecfdf3",
//               transition: "all 0.5s ease",
//             }}
//           >
//             <Typography
//               fontWeight={800}
//               sx={{
//                 fontSize: { xs: "1.7rem", lg: "1.5rem", xl: "1.8rem" },
//                 lineHeight: 1.2,
//                 color: isCenter ? "#fff" : "#0b1b2b",
//                 transition: colorTransition,
//               }}
//             >
//               {plan.price}
//             </Typography>
//             <Typography
//               sx={{
//                 fontSize: { xs: "0.8rem", lg: "0.72rem", xl: "0.78rem" },
//                 color: isCenter ? "rgba(255,255,255,0.85)" : "#5b6470",
//                 transition: colorTransition,
//               }}
//             >
//               {plan.note}
//             </Typography>
//           </Box>

//           <Button
//             component={Link}
//             href={plan.href}
//             fullWidth
//             variant="contained"
//             endIcon={<ArrowForwardRoundedIcon />}
//             sx={{
//               background: btnBg,
//               color: btnColor,
//               border: "2px solid",
//               borderColor: plan.outlined && !isCenter ? GREEN : "transparent",
//               fontWeight: 700,
//               textTransform: "none",
//               borderRadius: "14px",
//               py: 1.1,
//               fontSize: "0.92rem",
//               boxShadow: "none",
//               transition: "all 0.5s ease",
//               "&:hover": { background: btnHoverBg, boxShadow: "none" },
//             }}
//           >
//             {plan.cta}
//           </Button>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }

// /* ───────────────────────────── Page ───────────────────────────── */

// type Rotation = {
//   offset: number; // every card sits at slot (index + offset) % 5
//   shift: number; // slots moved in the last rotation (-2..2)
//   spin: number; // increments each rotation
// };

// export default function PricingPage() {
//   const theme = useTheme();
//   const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

//   const [rot, setRot] = useState<Rotation>({ offset: 0, shift: 0, spin: 0 });
//   const rotRef = useRef(rot);
//   rotRef.current = rot;

//   const intentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const pendingIndex = useRef<number | null>(null);
//   const lockedId = useRef<string | null>(null); // card that landed under the cursor
//   const cooldownUntil = useRef(0);

//   const clearIntent = () => {
//     if (intentTimer.current) clearTimeout(intentTimer.current);
//     intentTimer.current = null;
//     pendingIndex.current = null;
//   };

//   // Rotate the whole row so that cards sit at (index + target) % 5
//   const rotateTo = (target: number) => {
//     const prev = rotRef.current;
//     if (prev.offset === target) return;

//     // Shortest direction, so the hovered card travels at most 2 slots
//     let shift = mod(target - prev.offset, SLOTS);
//     if (shift > SLOTS / 2) shift -= SLOTS;

//     const next: Rotation = { offset: target, shift, spin: prev.spin + 1 };
//     rotRef.current = next;
//     setRot(next);
//   };

//   const handleHover = (index: number) => {
//     if (!isDesktop) return;

//     const id = plans[index].id;

//     // The card that rotated under a resting cursor must not trigger again
//     if (lockedId.current === id) return;
//     // Cards sliding past the cursor mid-rotation are ignored
//     if (Date.now() < cooldownUntil.current) return;

//     const slot = mod(index + rotRef.current.offset, SLOTS);
//     if (slot === CENTER) {
//       clearIntent();
//       return;
//     }
//     if (pendingIndex.current === index) return;

//     // Wait for the cursor to rest, so a quick sweep across the row
//     // doesn't spin it
//     clearIntent();
//     pendingIndex.current = index;
//     intentTimer.current = setTimeout(() => {
//       intentTimer.current = null;
//       pendingIndex.current = null;

//       const target = mod(CENTER - index, SLOTS);
//       const currentSlot = mod(index + rotRef.current.offset, SLOTS);
//       // After rotating, this card will be sitting where the cursor is
//       const arrivingIndex = mod(currentSlot - target, SLOTS);
//       lockedId.current = plans[arrivingIndex].id;
//       cooldownUntil.current = Date.now() + COOLDOWN;
//       rotateTo(target);
//     }, INTENT_DELAY);
//   };

//   const handleLeave = (index: number) => {
//     clearIntent();
//     if (lockedId.current === plans[index].id) lockedId.current = null;
//   };

//   // Keyboard users: tabbing into a card rotates it to the center too
//   const handleFocus = (index: number) => {
//     if (!isDesktop) return;
//     clearIntent();
//     rotateTo(mod(CENTER - index, SLOTS));
//   };

//   // Leaving the whole row rotates back to the default order
//   const resetRotation = () => {
//     clearIntent();
//     lockedId.current = null;
//     cooldownUntil.current = 0;
//     rotateTo(0);
//   };

//   return (
//     <Box
//       sx={{
//         background: "#f8fbf8",
//         minHeight: "100vh",
//         pt: { xs: 5, md: 7 },
//       }}
//     >
//       {/* Keyframes for cards that wrap around the row (two names so the
//           animation restarts on every rotation) */}
//       <GlobalStyles
//         styles={{
//           "@keyframes pricingDipA": {
//             "0%": { opacity: 1 },
//             "35%": { opacity: 0 },
//             "65%": { opacity: 0 },
//             "100%": { opacity: 1 },
//           },
//           "@keyframes pricingDipB": {
//             "0%": { opacity: 1 },
//             "35%": { opacity: 0 },
//             "65%": { opacity: 0 },
//             "100%": { opacity: 1 },
//           },
//         }}
//       />

//       <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
//         {/* Heading */}
//         <Box textAlign="center" mb={{ xs: 4, md: 5 }}>
//           <Typography
//             variant="h2"
//             fontWeight={800}
//             sx={{
//               fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
//               lineHeight: 1.2,
//               color: "#0b1b2b",
//             }}
//           >
//             Minimum Pricing. <br />
//             <Box component="span" sx={{ color: GREEN }}>
//               Maximum Preparation.
//             </Box>
//           </Typography>

//           <Typography
//             sx={{
//               mt: 2,
//               maxWidth: "680px",
//               mx: "auto",
//               color: "#5b6470",
//               fontSize: { xs: "0.88rem", md: "0.98rem" },
//               lineHeight: 1.7,
//             }}
//           >
//             Choose the plan that fits your UPSC journey. Practice more, analyze
//             better, and improve every day with PrelimsPass.
//           </Typography>
//         </Box>

//         {/* Cards: 5 in one row on desktop, hover rotates a card to the center */}
//         <Box
//           onMouseLeave={resetRotation}
//           sx={{
//             display: "grid",
//             gridTemplateColumns: {
//               xs: "1fr",
//               md: "repeat(2, 1fr)",
//               lg: "repeat(5, 1fr)",
//             },
//             gap: { xs: "24px", lg: `${GAP}px` },
//             alignItems: "stretch",
//             pt: { lg: 5 },
//             pb: { lg: 4 },
//             perspective: { lg: `${PERSPECTIVE}px` },
//           }}
//         >
//           {plans.map((plan, index) => {
//             const slot = mod(index + rot.offset, SLOTS);
//             const prevSlot = mod(slot - rot.shift, SLOTS);
//             const wrapping = rot.spin > 0 && prevSlot + rot.shift !== slot;
//             const isCenter = isDesktop ? slot === CENTER : !!plan.featured;

//             return (
//               <PlanCard
//                 key={plan.id}
//                 plan={plan}
//                 index={index}
//                 slot={slot}
//                 isCenter={isCenter}
//                 wrapping={isDesktop && wrapping}
//                 spin={rot.spin}
//                 onHover={() => handleHover(index)}
//                 onLeave={() => handleLeave(index)}
//                 onFocus={() => handleFocus(index)}
//               />
//             );
//           })}
//         </Box>
//       </Container>

//       <Box sx={{ height: 48 }} />

//       {/* ── WHY CHOOSE ── */}
//       <Box
//         sx={{
//           mt: { xs: 5, md: 6 },
//           borderRadius: { xs: "32px 32px 0 0", md: "56px 56px 0 0" },
//           border: "1px solid #dfeee3",
//           background:
//             "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(244,250,246,0.95) 100%)",
//           py: { xs: 3, md: 4 },
//           boxShadow: "0 10px 40px rgba(22,163,74,0.05)",
//           overflow: "hidden",
//         }}
//       >
//         <Typography
//           variant="h4"
//           fontWeight={800}
//           textAlign="center"
//           sx={{
//             color: "#111827",
//             fontSize: { xs: "1.25rem", md: "1.6rem" },
//           }}
//         >
//           Why Choose{" "}
//           <Box component="span" sx={{ color: "#16a34a" }}>
//             PrelimsPass
//           </Box>
//           ?
//         </Typography>

//         <Grid container sx={{ mt: { xs: 1, md: 0 } }}>
//           {[
//             {
//               icon: (
//                 <SecurityRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
//               ),
//               title: "Real",
//               subtitle: "UPSC Standard",
//             },
//             {
//               icon: (
//                 <AllInclusiveRoundedIcon
//                   sx={{ fontSize: { xs: 22, md: 28 } }}
//                 />
//               ),
//               title: "Unlimited",
//               subtitle: "Practice",
//             },
//             {
//               icon: (
//                 <AutorenewRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
//               ),
//               title: "24hr",
//               subtitle: "Evaluation",
//             },
//             {
//               icon: (
//                 <BarChartRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
//               ),
//               title: "Data-Driven",
//               subtitle: "Analytics",
//             },
//             {
//               icon: (
//                 <CurrencyRupeeRoundedIcon
//                   sx={{ fontSize: { xs: 22, md: 28 } }}
//                 />
//               ),
//               title: "Affordable",
//               subtitle: "Pricing",
//             },
//             {
//               icon: (
//                 <Groups2RoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
//               ),
//               title: "Trusted by",
//               subtitle: "Aspirants",
//             },
//           ].map((item, index) => (
//             <Grid
//               key={index}
//               size={{ xs: 4, md: 2 }}
//               sx={{
//                 position: "relative",
//                 textAlign: "center",
//                 py: { xs: 2, md: 1.5 },
//                 // Bottom border separating the two rows on mobile (3-col layout)
//                 borderBottom: {
//                   xs: index < 3 ? "1px solid #e5e7eb" : "none",
//                   md: "none",
//                 },
//               }}
//             >
//               {/* Vertical divider */}
//               {index !== 5 && (
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     right: 0,
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     width: "1px",
//                     height: "50px",
//                     background: "#e5e7eb",
//                     // On xs (3 cols): hide after every 3rd item
//                     display: {
//                       xs: (index + 1) % 3 === 0 ? "none" : "block",
//                       md: "block",
//                     },
//                   }}
//                 />
//               )}

//               {/* ICON */}
//               <Box
//                 sx={{
//                   width: { xs: 46, md: 60 },
//                   height: { xs: 46, md: 60 },
//                   borderRadius: "50%",
//                   background:
//                     "linear-gradient(180deg, #f4fbf6 0%, #e9f7ee 100%)",
//                   border: "1px solid #e3f1e7",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   mx: "auto",
//                   mb: { xs: 1, md: 1.5 },
//                   color: "#16a34a",
//                 }}
//               >
//                 {item.icon}
//               </Box>

//               {/* TITLE */}
//               <Typography
//                 sx={{
//                   fontWeight: 700,
//                   fontSize: { xs: "11.5px", md: "13px" },
//                   color: "#111827",
//                   lineHeight: 1.2,
//                 }}
//               >
//                 {item.title}
//               </Typography>

//               {/* SUBTITLE */}
//               <Typography
//                 sx={{
//                   fontSize: { xs: "10.5px", md: "13px" },
//                   color: "#374151",
//                   lineHeight: 1.3,
//                   mt: 0.5,
//                 }}
//               >
//                 {item.subtitle}
//               </Typography>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//   );
// }

"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import AllInclusiveRoundedIcon from "@mui/icons-material/AllInclusiveRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

/* ─────────────────────────── Tuning knobs ─────────────────────────── */

const GREEN = "#16a34a";
const GREEN_DARK = "#15803d";
const DARK_GREEN = "#14532d";
const GREEN_GRADIENT = `linear-gradient(165deg, ${DARK_GREEN} 0%, ${GREEN_DARK} 60%, ${GREEN} 100%)`;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const COLOR_T = "color 450ms ease, background 450ms ease, border-color 450ms ease";

/* ───────────────────────────── Plan data ───────────────────────────── */

type Plan = {
  id: string;
  title: string;
  subtitle: string;
  stats?: string[]; // "10,000 facts | 60 mock tests" style row
  description?: string; // shown instead of stats when there are none
  features: string[];
  price: string;
  originalPrice?: string; // struck-through price
  offer?: string; // ribbon text, e.g. "Until Dec 31, 2026"
  href: string;
  headerIcon: ReactNode;
  headerIconShape: "square" | "circle";
  illustration: {
    main: ReactNode;
    badge: ReactNode;
    topLeft: ReactNode;
    topRight: ReactNode;
  };
};

const plans: Plan[] = [
  {
    id: "ezeeexams",
    title: "EzeeExams",
    subtitle: "Eases GS Prelims",
    stats: ["10,000 facts", "60 mock tests"],
    features: [
      "Detailed analysis & performance tracking",
      "Attempt online from any device",
      "Real UPSC pattern (+2 / -0.66)",
    ],
    price: "₹999",
    originalPrice: "₹9,999",
    offer: "Until Dec 31, 2026",
    href: "/register?plan=web",
    headerIcon: <LaptopMacRoundedIcon />,
    headerIconShape: "square",
    illustration: {
      main: <LaptopMacRoundedIcon />,
      badge: <BarChartRoundedIcon />,
      topLeft: <MenuBookRoundedIcon />,
      topRight: <GpsFixedRoundedIcon />,
    },
  },
  {
    id: "magicmocks",
    title: "MagicMocks",
    subtitle: "Eases GS Mains",
    stats: ["Answer Evaluation", "1-to-1 Feedback"],
    features: ["14 years of GS Mains PYQs", "20 full-length GS Mains mock tests"],
    price: "₹9,999",
    href: "/register?plan=mains-mock",
    headerIcon: <GpsFixedRoundedIcon />,
    headerIconShape: "circle",
    illustration: {
      main: <DescriptionRoundedIcon />,
      badge: <PersonRoundedIcon />,
      topLeft: <EditNoteRoundedIcon />,
      topRight: <CheckCircleIcon />,
    },
  },
];

const whyChoose = [
  { icon: <SecurityRoundedIcon />, title: "Real", subtitle: "UPSC Standard" },
  { icon: <AllInclusiveRoundedIcon />, title: "Unlimited", subtitle: "Practice" },
  { icon: <AutorenewRoundedIcon />, title: "24hr", subtitle: "Evaluation" },
  { icon: <BarChartRoundedIcon />, title: "Data-Driven", subtitle: "Analytics" },
  { icon: <CurrencyRupeeRoundedIcon />, title: "Affordable", subtitle: "Pricing" },
  { icon: <Groups2RoundedIcon />, title: "Trusted by", subtitle: "Aspirants" },
];

/* ───────────────────────────── Illustration ───────────────────────────── */

// A static "scene" built from icons, so no image assets are needed
function Illustration({ data }: { data: Plan["illustration"] }) {
  const bubble = {
    position: "absolute" as const,
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#fff",
    color: GREEN,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(20,83,45,0.15)",
    "& svg": { fontSize: 18 },
  };

  return (
    <Box
      className="pp-illus"
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: { xs: 150, sm: 170 },
        transition: `transform 600ms ${EASE}`,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: "6% 4%",
          borderRadius: "50%",
          background: "radial-gradient(circle, #d3f2de 0%, rgba(211,242,222,0) 70%)",
          transition: "opacity 450ms ease",
          ".pp-card:hover &": { opacity: 0.25 },
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          color: GREEN,
          transition: COLOR_T,
          ".pp-card:hover &": { color: "#bbf7d0" },
          "& svg": {
            fontSize: { xs: 84, sm: 96 },
            filter: "drop-shadow(0 14px 16px rgba(22,163,74,0.28))",
          },
        }}
      >
        {data.main}
      </Box>

      <Box aria-hidden sx={{ ...bubble, top: "6%", left: "8%" }}>
        {data.topLeft}
      </Box>
      <Box aria-hidden sx={{ ...bubble, top: "4%", right: "6%" }}>
        {data.topRight}
      </Box>

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          right: "4%",
          bottom: "8%",
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: `linear-gradient(145deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 24px rgba(20,83,45,0.35)",
          "& svg": { fontSize: 24 },
        }}
      >
        {data.badge}
      </Box>
    </Box>
  );
}

/* ───────────────────────────── Plan card ───────────────────────────── */

function PlanCard({ plan }: { plan: Plan }) {
  const isSquare = plan.headerIconShape === "square";

  return (
    <Card
      className="pp-card"
      sx={{
        position: "relative",
        overflow: "hidden",
        height: "100%",
        borderRadius: { xs: "22px", md: "28px" },
        border: "1px solid #d9eedf",
        background:
          "radial-gradient(circle at 0% 0%, #e6f7ec 0%, rgba(230,247,236,0) 48%), #fff",
        boxShadow: "0 10px 30px rgba(20,83,45,0.07)",
        transition: `transform 450ms ${EASE}, box-shadow 450ms ease, border-color 450ms ease`,

        // Highlight: card lifts and the green layer fades in
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 30px 60px rgba(20,83,45,0.35)",
          borderColor: GREEN,
        },
        "&:hover .pp-overlay": { opacity: 1 },
        "&:hover .pp-illus": { transform: "scale(1.05)" },

        // Text and elements switch to light colours on the green layer
        "&:hover .pp-title": { color: "#fff" },
        "&:hover .pp-sub": { color: "#bbf7d0" },
        "&:hover .pp-text": { color: "#fff" },
        "&:hover .pp-check": { color: "#bbf7d0" },
        "&:hover .pp-divider": { background: "rgba(255,255,255,0.4)" },
        "&:hover .pp-hicon": {
          background: "rgba(255,255,255,0.2)",
          color: "#fff",
          boxShadow: "none",
        },
        "&:hover .pp-pricebox": {
          background: "rgba(255,255,255,0.14)",
          borderColor: "rgba(253,230,138,0.7)",
        },
        "&:hover .pp-price": { color: "#fff" },
        "&:hover .pp-orig": { color: "rgba(255,255,255,0.8)" },
        "&:hover .pp-offer": { background: "#fde68a", color: "#78350f" },
        "&:hover .pp-btn": { background: "#d9f99d", color: DARK_GREEN },
        "&:hover .pp-btn:hover": { background: "#bef264" },
      }}
    >
      {/* Green layer that fades in on hover */}
      <Box
        aria-hidden
        className="pp-overlay"
        sx={{
          position: "absolute",
          inset: 0,
          background: GREEN_GRADIENT,
          opacity: 0,
          transition: "opacity 450ms ease",
          pointerEvents: "none",
        }}
      />

      <CardContent
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: { xs: 2.25, sm: 3 },
          "&:last-child": { pb: { xs: 2.25, sm: 3 } },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row", md: "column", lg: "row" },
            gap: { xs: 1, sm: 2 },
            flexGrow: 1,
          }}
        >
          {/* Left: header, stats, features */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Box
                className="pp-hicon"
                sx={{
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                  borderRadius: isSquare ? "18px" : "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isSquare
                    ? `linear-gradient(145deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`
                    : "#e3f5e9",
                  color: isSquare ? "#fff" : GREEN,
                  boxShadow: isSquare ? "0 10px 20px rgba(22,163,74,0.3)" : "none",
                  transition: COLOR_T,
                  "& svg": { fontSize: 30 },
                }}
              >
                {plan.headerIcon}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  className="pp-title"
                  fontWeight={800}
                  sx={{
                    fontSize: { xs: "1.4rem", sm: "1.6rem" },
                    lineHeight: 1.15,
                    color: "#0b1b2b",
                    transition: COLOR_T,
                  }}
                >
                  {plan.title}
                </Typography>
                <Typography
                  className="pp-sub"
                  fontWeight={700}
                  sx={{
                    color: GREEN,
                    fontSize: { xs: "0.95rem", sm: "1.05rem" },
                    transition: COLOR_T,
                  }}
                >
                  {plan.subtitle}
                </Typography>
              </Box>
            </Stack>

            {plan.stats ? (
              <Stack
                direction="row"
                alignItems="center"
                flexWrap="nowrap"
                columnGap={{ xs: 1.25, sm: 1.75 }}
                mb={2.25}
              >
                {plan.stats.map((s, i) => (
                  <Stack key={s} direction="row" alignItems="center" columnGap={{ xs: 1.25, sm: 1.75 }}>
                    {i > 0 && (
                      <Box
                        className="pp-divider"
                        sx={{
                          width: "2px",
                          height: 24,
                          background: "#cfe3d5",
                          transition: COLOR_T,
                        }}
                      />
                    )}
                    <Typography
                      className="pp-text"
                      fontWeight={700}
                      sx={{
                        color: "#1f2937",
                        fontSize: { xs: "0.82rem", sm: "0.95rem" },
                        whiteSpace: "nowrap",
                        transition: COLOR_T,
                      }}
                    >
                      {s}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Typography
                className="pp-text"
                sx={{
                  color: "#4b5563",
                  fontSize: { xs: "0.92rem", sm: "1rem" },
                  lineHeight: 1.5,
                  mb: 2.25,
                  maxWidth: 260,
                  transition: COLOR_T,
                }}
              >
                {plan.description}
              </Typography>
            )}

            <Stack spacing={1.4}>
              {plan.features.map((f) => (
                <Stack
                  key={f}
                  direction="row"
                  spacing={1.25}
                  alignItems="center"
                  sx={{
                    transition: `transform 300ms ${EASE}`,
                    "&:hover": { transform: "translateX(6px)" },
                  }}
                >
                  <CheckCircleIcon
                    className="pp-check"
                    sx={{ color: GREEN, fontSize: 21, flexShrink: 0, transition: COLOR_T }}
                  />
                  <Typography
                    className="pp-text"
                    sx={{
                      color: "#374151",
                      fontSize: { xs: "0.85rem", sm: "0.9rem" },
                      transition: COLOR_T,
                    }}
                  >
                    {f}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* Right: illustration */}
          <Box
            sx={{
              width: { xs: "100%", sm: 170, md: "100%", lg: 170 },
              flexShrink: 0,
              display: "flex",
              alignItems: "stretch",
            }}
          >
            <Illustration data={plan.illustration} />
          </Box>
        </Box>

        {/* Price + button */}
        <Box sx={{ mt: 2.5 }}>
          <Box
            className="pp-pricebox"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
              borderRadius: "18px",
              px: { xs: 2, sm: 3 },
              py: 1.2,
              mb: 1.75,
              minHeight: 80,
              background: "rgba(236,253,243,0.9)",
              border: "1px solid #dff3e5",
              transition: COLOR_T,
            }}
          >
            <Box>
              {plan.originalPrice && (
                <Typography
                  className="pp-orig"
                  fontWeight={700}
                  sx={{
                    display: "inline-block",
                    color: "#6b7280",
                    fontSize: { xs: "1.3rem", sm: "1.6rem" },
                    textDecoration: "line-through",
                    textDecorationColor: "#ef4444",
                    textDecorationThickness: "2px",
                    lineHeight: 1,
                    transition: COLOR_T,
                  }}
                >
                  {plan.originalPrice}
                </Typography>
              )}
              <Typography
                className="pp-price"
                fontWeight={800}
                sx={{
                  color: GREEN_DARK,
                  fontSize: { xs: "2.1rem", sm: "2.5rem" },
                  lineHeight: 1.1,
                  transition: COLOR_T,
                }}
              >
                {plan.price}
              </Typography>
            </Box>

            {plan.offer && (
              <Stack
                className="pp-offer"
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  background: DARK_GREEN,
                  color: "#fff",
                  px: 2,
                  py: 1,
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  transform: "rotate(-4deg)",
                  boxShadow: "0 8px 18px rgba(20,83,45,0.3)",
                  transition: COLOR_T,
                }}
              >
                <CalendarMonthRoundedIcon sx={{ fontSize: 20 }} />
                <span>{plan.offer}</span>
              </Stack>
            )}
          </Box>

          <Button
            className="pp-btn"
            component={Link}
            href={plan.href}
            fullWidth
            variant="contained"
            endIcon={
              <ArrowForwardRoundedIcon
                className="pp-arrow"
                sx={{ transition: `transform 300ms ${EASE}` }}
              />
            }
            sx={{
              background: `linear-gradient(90deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: "14px",
              py: 1.2,
              boxShadow: "none",
              transition: `${COLOR_T}, transform 300ms ${EASE}`,
              "&:hover": { boxShadow: "none", transform: "translateY(-2px)" },
              "&:hover .pp-arrow": { transform: "translateX(6px)" },
              "&:active": { transform: "translateY(0) scale(0.99)" },
            }}
          >
            Get Started
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

/* ───────────────────────────── Page ───────────────────────────── */

export default function PricingPage() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background: "#f8fbf8",
        minHeight: "100vh",
        pt: { xs: 5, md: 7 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{ position: "relative", maxWidth: { lg: 1240 }, px: { xs: 2, sm: 3, md: 4 } }}
      >
        {/* Heading */}
        <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1.5}
            mb={1.5}
          >
            <Box sx={{ width: { xs: 24, sm: 40 }, height: "2px", background: GREEN }} />
            <Typography
              fontWeight={700}
              sx={{
                color: GREEN_DARK,
                letterSpacing: 1.5,
                fontSize: { xs: "0.78rem", md: "0.95rem" },
              }}
            >
              CHOOSE YOUR PLAN
            </Typography>
            <Box sx={{ width: { xs: 24, sm: 40 }, height: "2px", background: GREEN }} />
          </Stack>

          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              fontSize: { xs: "1.9rem", sm: "2.6rem", md: "3.2rem" },
              lineHeight: 1.15,
              color: "#0b1b2b",
            }}
          >
            Minimum Pricing. <br />
            <Box component="span" sx={{ color: GREEN }}>
              Maximum Preparation.
            </Box>
          </Typography>

          {/* <Typography
            sx={{
              mt: 2,
              maxWidth: "620px",
              mx: "auto",
              color: "#4b5563",
              fontSize: { xs: "0.9rem", md: "1rem" },
              lineHeight: 1.7,
            }}
          >
            Choose the plan that fits your UPSC journey. Practice more, analyze
            better, and improve every day with PrelimsPass.
          </Typography>

          <Stack
            direction="row"
            justifyContent="center"
            flexWrap="wrap"
            gap={1.5}
            mt={3}
          >
            {plans.map((plan) => (
              <Box
                key={plan.id}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.9,
                  borderRadius: "999px",
                  background: "#fff",
                  border: "1px solid #cfe9d6",
                  color: DARK_GREEN,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  transition: `all 300ms ${EASE}`,
                  "&:hover": {
                    background: GREEN,
                    borderColor: GREEN,
                    color: "#fff",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 18px rgba(22,163,74,0.3)",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{ width: 8, height: 8, borderRadius: "50%", background: "currentColor" }}
                />
                <b>{plan.title}</b>
                <span>{plan.subtitle}</span>
              </Box>
            ))}
          </Stack> */}
        </Box>

        {/* Two equal cards: stacked below lg, 50/50 on desktop */}
        <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="stretch">
          {plans.map((plan) => (
            <Grid key={plan.id} size={{ xs: 12, lg: 6 }}>
              <PlanCard plan={plan} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ height: 48 }} />

      {/* ── WHY CHOOSE ── */}
      <Box
        sx={{
          position: "relative",
          mt: { xs: 5, md: 6 },
          borderRadius: { xs: "32px 32px 0 0", md: "56px 56px 0 0" },
          border: "1px solid #dfeee3",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(244,250,246,0.95) 100%)",
          py: { xs: 3, md: 4 },
          boxShadow: "0 10px 40px rgba(22,163,74,0.05)",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          textAlign="center"
          sx={{ color: "#111827", fontSize: { xs: "1.25rem", md: "1.6rem" } }}
        >
          Why Choose{" "}
          <Box component="span" sx={{ color: GREEN }}>
            PrelimsPass
          </Box>
          ?
        </Typography>

        <Grid container sx={{ mt: { xs: 1, md: 0 } }}>
          {whyChoose.map((item, index) => (
            <Grid
              key={item.title}
              size={{ xs: 4, md: 2 }}
              sx={{
                position: "relative",
                textAlign: "center",
                py: { xs: 2, md: 1.5 },
                borderBottom: {
                  xs: index < 3 ? "1px solid #e5e7eb" : "none",
                  md: "none",
                },
                "&:hover .pp-why-icon": {
                  background: GREEN,
                  color: "#fff",
                  transform: "translateY(-6px) scale(1.08)",
                  boxShadow: "0 12px 22px rgba(22,163,74,0.3)",
                },
              }}
            >
              {index !== whyChoose.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "1px",
                    height: "50px",
                    background: "#e5e7eb",
                    display: {
                      xs: (index + 1) % 3 === 0 ? "none" : "block",
                      md: "block",
                    },
                  }}
                />
              )}

              <Box
                className="pp-why-icon"
                sx={{
                  width: { xs: 46, md: 60 },
                  height: { xs: 46, md: 60 },
                  borderRadius: "50%",
                  background: "linear-gradient(180deg, #f4fbf6 0%, #e9f7ee 100%)",
                  border: "1px solid #e3f1e7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: { xs: 1, md: 1.5 },
                  color: GREEN,
                  transition: `all 350ms ${EASE}`,
                  "& svg": { fontSize: { xs: 22, md: 28 } },
                }}
              >
                {item.icon}
              </Box>

              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "11.5px", md: "13px" },
                  color: "#111827",
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "10.5px", md: "13px" },
                  color: "#374151",
                  lineHeight: 1.3,
                  mt: 0.5,
                }}
              >
                {item.subtitle}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}