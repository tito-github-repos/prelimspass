// "use client";

// import Link from "next/link";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   Container,
//   Grid,
//   Stack,
//   Typography,
// } from "@mui/material";

// import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
// import AllInclusiveRoundedIcon from "@mui/icons-material/AllInclusiveRounded";
// import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
// import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
// import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
// import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
// import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
// import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
// import StarIcon from "@mui/icons-material/Star";

// const prelimsSchedule = [
//   { day: "MON", subject: "Environment Questions", count: "100" },
//   { day: "TUE", subject: "Geography Questions", count: "100" },
//   { day: "WED", subject: "Sci & Tech Questions", count: "100" },
//   { day: "THU", subject: "Polity Questions", count: "100" },
//   { day: "FRI", subject: "Economics Questions", count: "100" },
//   { day: "SAT", subject: "History Questions", count: "100" },
//   { day: "SUN", subject: "CA Questions", count: "100" },
// ];

// const mainsSchedule = [
//   { day: "SAT", subject: "Essay and Ethics Practice" },
//   { day: "SUN", subject: "Any Two GS Papers Practice" },
// ];

// // Shared text sizes so every card stays consistent
// const CARD_TITLE_SX = { fontSize: { xs: "1.35rem", md: "1.7rem" } };
// const CARD_DESC_SX = { fontSize: { xs: "0.82rem", md: "0.9rem" } };
// const LIST_TEXT_SX = { fontSize: { xs: "0.82rem", md: "0.9rem" } };
// const PRICE_SX = { fontSize: { xs: "1.7rem", md: "2rem" } };
// const PRICE_NOTE_SX = { fontSize: { xs: "0.82rem", md: "0.9rem" } };

// export default function PricingPage() {
//   return (
//     <>
//       <Box
//         sx={{
//           background: "#f8fbf8",
//           minHeight: "100vh",
//           pt: { xs: 5, md: 7 },
//         }}
//       >
//         {/* ── Container ── */}
//         <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
//           <Box textAlign="center" mb={{ xs: 4, md: 5 }}>
//             <Typography
//               variant="h2"
//               fontWeight={800}
//               sx={{
//                 fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
//                 lineHeight: 1.2,
//                 color: "#0b1b2b",
//               }}
//             >
//               Minimum Pricing.
//               <br />
//               <Box component="span">
//                 <Box component="span" sx={{ color: "#16a34a" }}>
//                   Maximum
//                 </Box>{" "}
//                 Preparation.
//               </Box>
//             </Typography>

//             <Typography
//               sx={{
//                 mt: 2,
//                 maxWidth: "680px",
//                 mx: "auto",
//                 color: "#5b6470",
//                 fontSize: { xs: "0.88rem", md: "0.98rem" },
//                 lineHeight: 1.7,
//                 px: { xs: 1, md: 0 },
//               }}
//             >
//               Choose a plan that fits your UPSC journey. Practice more, analyze
//               better, and improve every day with PrelimsPass.
//             </Typography>
//           </Box>

//           <Grid container spacing={{ xs: 3, md: 3 }}>
//             {/* ── FREE PLAN ── */}
//             <Grid size={{ xs: 12, lg: 4 }} sx={{ mt: { lg: 4 } }}>
//               <Card
//                 sx={{
//                   borderRadius: { xs: "20px", md: "26px" },
//                   height: "100%",
//                   border: "2px solid #CBD5E1",
//                   background: "#fff",
//                 }}
//               >
//                 <CardContent
//                   sx={{
//                     p: { xs: 2.5, md: 3.5 },
//                     mt: { xs: 1, md: 2 },
//                     textAlign: "center",
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <Box>
//                     <Chip
//                       label="FREE TRIAL"
//                       sx={{
//                         background: "#475569",
//                         color: "white",
//                         fontWeight: 700,
//                         fontSize: "0.72rem",
//                         borderRadius: "10px",
//                         px: 1,
//                       }}
//                     />

//                     <Typography
//                       variant="h4"
//                       fontWeight={800}
//                       mt={2.5}
//                       mb={1}
//                       sx={{ ...CARD_TITLE_SX, color: "#111827" }}
//                     >
//                       Free Plan
//                     </Typography>

//                     <Typography color="#6B7280" mb={2.5} sx={CARD_DESC_SX}>
//                       Free Access
//                     </Typography>

//                     <Box sx={{ borderBottom: "2px dotted #D1D5DB", mb: 2.5 }} />

//                     <Stack spacing={1.75} textAlign="left">
//                       {[
//                         "Prelims PYQ Access and Practice",
//                         "FREE for all registered users",
//                         "Basic Dashboard Access",
//                         "No Payment Required",
//                         "Login / Register Required",
//                       ].map((item) => (
//                         <Stack
//                           key={item}
//                           direction="row"
//                           spacing={1}
//                           alignItems="center"
//                         >
//                           <CheckCircleOutlinedIcon
//                             sx={{
//                               color: "#475569",
//                               fontSize: 18,
//                               flexShrink: 0,
//                             }}
//                           />
//                           <Typography
//                             sx={{ ...LIST_TEXT_SX, color: "#374151" }}
//                           >
//                             {item}
//                           </Typography>
//                         </Stack>
//                       ))}
//                     </Stack>
//                   </Box>

//                   {/* Gift Section — grows to fill free space */}
//                   <Box
//                     sx={{
//                       flexGrow: 1,
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       textAlign: "center",
//                       px: 2,
//                       py: { xs: 3, md: 2 },
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         width: 60,
//                         height: 60,
//                         borderRadius: "18px",
//                         background: "#F1F5F9",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         mx: "auto",
//                         mb: 1.5,
//                       }}
//                     >
//                       <Box
//                         component="img"
//                         src="/Icons/present-icon.svg"
//                         alt="Gift Icon"
//                         sx={{
//                           width: 32,
//                           height: 32,
//                           filter:
//                             "invert(35%) sepia(12%) saturate(778%) hue-rotate(176deg) brightness(92%) contrast(86%)",
//                         }}
//                       />
//                     </Box>

//                     <Typography
//                       sx={{
//                         fontWeight: 700,
//                         fontSize: "14px",
//                         color: "#111827",
//                         mb: 0.5,
//                       }}
//                     >
//                       Experience PrelimsPass
//                     </Typography>

//                     {/* <Typography sx={{ fontSize: "13px", color: "#6B7280" }}>
//                       No risk, no cost
//                     </Typography> */}
//                   </Box>

//                   <Button
//                     fullWidth
//                     component={Link}
//                     href="/register?plan=free-trial"
//                     variant="contained"
//                     endIcon={<ArrowForwardRoundedIcon />}
//                     sx={{
//                       mt: { xs: 1, md: 2 },
//                       py: { xs: 1.2, md: 1.5 },
//                       borderRadius: "14px",
//                       background: "#475569",
//                       fontWeight: 700,
//                       textTransform: "none",
//                       fontSize: { xs: "0.9rem", md: "0.95rem" },
//                       boxShadow: "none",
//                       "&:hover": {
//                         background: "#334155",
//                         boxShadow: "none",
//                       },
//                     }}
//                   >
//                     Start Free Trial
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* ── MAINS PLAN ── */}
//             <Grid size={{ xs: 12, lg: 4 }}>
//               <Card
//                 sx={{
//                   borderRadius: { xs: "20px", md: "26px" },
//                   height: "100%",
//                   border: "2px solid #534AB7",
//                   position: "relative",
//                   overflow: "visible",
//                   pt: 3,
//                 }}
//               >
//                 <Chip
//                   label="BEST VALUE · SEASON 2027"
//                   sx={{
//                     position: "absolute",
//                     top: 0,
//                     left: "50%",
//                     transform: "translateX(-50%)",
//                     background: "#534AB7",
//                     color: "white",
//                     fontWeight: 700,
//                     fontSize: "0.72rem",
//                     px: 1,
//                     borderRadius: "0 0 14px 14px",
//                     whiteSpace: "nowrap",
//                   }}
//                 />

//                 <CardContent
//                   sx={{
//                     p: { xs: 2.5, md: 3.5 },
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: 56,
//                       height: 56,
//                       borderRadius: "16px",
//                       background: "#EEEDFE",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       mx: "auto",
//                       mb: 2,
//                     }}
//                   >
//                     <Box
//                       component="img"
//                       src="/Icons/writing-icon.svg"
//                       alt="Mains cum Prelims Icon"
//                       sx={{
//                         width: 30,
//                         height: 30,
//                         filter:
//                           "invert(32%) sepia(78%) saturate(748%) hue-rotate(232deg) brightness(91%) contrast(92%)",
//                       }}
//                     />
//                   </Box>

//                   <Box textAlign="center" mb={2.5}>
//                     <Typography
//                       variant="h4"
//                       fontWeight={800}
//                       mb={1.5}
//                       sx={CARD_TITLE_SX}
//                     >
//                       {/* Mains Plan */}
//                       Mains cum Prelims
//                     </Typography>
//                     <Typography color="text.secondary" sx={CARD_DESC_SX}>
//                       {/* Weekly 4 Tests - Mains */}
//                       Full Mains answer-writing practice — inclusive of Prelims
//                       Practice access
//                     </Typography>
//                   </Box>

//                   <Stack spacing={1.75} mb={3}>
//                     {[
//                       // "Essay and Ethics paper practice",
//                       // "GS paper practice",
//                       // "Answer writing evaluation",
//                       // "Feedback within 24 hours",
//                       // "Email-based test submission",
//                       // "Performance review",
//                       // "Mains Practice with Prelims Mobile App, Prelims PYQ & Prelims Mock Test — all free, included",
//                       "Feedback within 24 hours",
//                       "Each answer paper is evaluated, analyzed & discussed one-to-one",
//                       "Before 31 Dec 2026: 12 tests per paper — conducted, evaluated & discussed with every enrolled student",
//                       "After the Prelims exam: 8 tests per paper — conducted, evaluated & discussed with every enrolled student",
//                     ].map((item) => (
//                       <Stack
//                         key={item}
//                         direction="row"
//                         spacing={1}
//                         alignItems="flex-start"
//                       >
//                         <CheckCircleOutlinedIcon
//                           sx={{
//                             color: "#534AB7",
//                             fontSize: 18,
//                             flexShrink: 0,
//                             mt: "2px",
//                           }}
//                         />
//                         <Typography sx={LIST_TEXT_SX}>{item}</Typography>
//                       </Stack>
//                     ))}
//                   </Stack>

//                   {/*
//                    <Typography
//                     variant="h6"
//                     fontWeight={700}
//                     mb={2}
//                     sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
//                   >
//                     Weekly Schedule
//                   </Typography>

//                   <Stack spacing={1}>
//                     {mainsSchedule.map((item) => (
//                       <Box
//                         key={item.day}
//                         sx={{ display: "flex", alignItems: "center", py: 0.5 }}
//                       >
//                         <Box
//                           sx={{
//                             width: { xs: 46, md: 56 },
//                             height: 34,
//                             borderRadius: "8px",
//                             background: "#EEEDFE",
//                             color: "#534AB7",
//                             fontWeight: 700,
//                             fontSize: "13px",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             flexShrink: 0,
//                           }}
//                         >
//                           {item.day}
//                         </Box>
//                         <Typography
//                           sx={{
//                             ml: { xs: 1.5, md: 2 },
//                             fontSize: { xs: "13px", md: "15px" },
//                             color: "#374151",
//                             fontWeight: 500,
//                           }}
//                         >
//                           {item.subject}
//                         </Typography>
//                       </Box>
//                     ))}
//                   </Stack> */}

//                   {/* <Typography
//                     variant="h6"
//                     fontWeight={700}
//                     mt={4}
//                     mb={2}
//                     sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
//                   >
//                     How It Works
//                   </Typography> */}

//                   {/* <Stack spacing={2}>
//                     {[
//                       "Test papers sent to your registered email",
//                       "Submit answer sheets to prelimspass@gmail.com",
//                       "Answer sheets evaluated within 24 hours",
//                     ].map((item) => (
//                       <Stack
//                         key={item}
//                         direction="row"
//                         spacing={1}
//                         alignItems="flex-start"
//                       >
//                         <CheckCircleOutlinedIcon
//                           sx={{
//                             color: "#534AB7",
//                             fontSize: 20,
//                             flexShrink: 0,
//                             mt: "2px",
//                           }}
//                         />
//                         <Typography
//                           sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
//                         >
//                           {item}
//                         </Typography>
//                       </Stack>
//                     ))}
//                   </Stack> */}

//                   {/* PRICING */}
//                   {/* <Grid container spacing={{ xs: 2, md: 2 }} mt={4}>
//                     <Grid size={6}>
//                       <Typography
//                         variant="h4"
//                         fontWeight={800}
//                         sx={{ fontSize: { xs: "1.4rem", md: "2.125rem" } }}
//                       >
//                         ₹1,111
//                       </Typography>
//                       <Typography
//                         color="text.secondary"
//                         sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}
//                       >
//                         Per Month
//                       </Typography>
//                       <Button
//                         component={Link}
//                         href="/register?plan=mains-monthly"
//                         fullWidth
//                         variant="outlined"
//                         sx={{
//                           mt: 2,
//                           py: { xs: 1.2, md: 1.5 },
//                           borderRadius: "14px",
//                           borderColor: "#534AB7",
//                           color: "#534AB7",
//                           fontWeight: 700,
//                           textTransform: "none",
//                           fontSize: { xs: "0.85rem", md: "1rem" },
//                         }}
//                       >
//                         Monthly
//                       </Button>
//                     </Grid>

//                     <Grid size={6}>
//                       <Typography
//                         variant="h4"
//                         fontWeight={800}
//                         sx={{ fontSize: { xs: "1.4rem", md: "2.125rem" } }}
//                       >
//                         ₹11,111
//                       </Typography>
//                       <Typography
//                         color="text.secondary"
//                         sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}
//                       >
//                         Per Year
//                       </Typography>
//                       <Button
//                         component={Link}
//                         href="/register?plan=mains-yearly"
//                         fullWidth
//                         variant="contained"
//                         sx={{
//                           mt: 2,
//                           py: { xs: 1.2, md: 1.5 },
//                           borderRadius: "14px",
//                           background: "#534AB7",
//                           fontWeight: 700,
//                           textTransform: "none",
//                           fontSize: { xs: "0.85rem", md: "1rem" },
//                           "&:hover": {
//                             background: "#403d82",
//                           },
//                         }}
//                       >
//                         Yearly
//                       </Button>
//                     </Grid>
//                   </Grid> */}

//                   {/* PRICING — pinned to the bottom of the card */}
//                   <Box textAlign="center" sx={{ mt: "auto" }}>
//                     <Typography variant="h3" fontWeight={800} sx={PRICE_SX}>
//                       ₹11,111
//                     </Typography>
//                     <Typography
//                       color="text.secondary"
//                       sx={{ ...PRICE_NOTE_SX, mb: 2 }}
//                     >
//                       Valid for the 2027 season
//                     </Typography>

//                     <Button
//                       component={Link}
//                       href="/register?plan=mains-cum-prelims"
//                       fullWidth
//                       variant="contained"
//                       endIcon={<ArrowForwardRoundedIcon />}
//                       sx={{
//                         py: { xs: 1.2, md: 1.5 },
//                         borderRadius: "14px",
//                         background: "#534AB7",
//                         fontWeight: 700,
//                         textTransform: "none",
//                         boxShadow: "none",
//                         fontSize: { xs: "0.9rem", md: "0.95rem" },
//                         "&:hover": {
//                           background: "#403d82",
//                           boxShadow: "none",
//                         },
//                       }}
//                     >
//                       Enroll in Mains cum Prelims
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* ── PRELIMS PLAN ── */}
//             <Grid size={{ xs: 12, lg: 4 }} sx={{ mt: { lg: 4 } }}>
//               <Card
//                 sx={{
//                   borderRadius: { xs: "20px", md: "26px" },
//                   height: "100%",
//                   border: "2px solid #16a34a",
//                   position: "relative",
//                   overflow: "visible",
//                   pt: 3,
//                 }}
//               >
//                 {/* <Chip
//                   icon={
//                     <StarIcon
//                       sx={{ color: "white !important", fontSize: "18px" }}
//                     />
//                   }
//                   label="MOST POPULAR"
//                   sx={{
//                     position: "absolute",
//                     top: 0,
//                     left: "50%",
//                     transform: "translateX(-50%)",
//                     background: "#16a34a",
//                     color: "white",
//                     fontWeight: 700,
//                     px: 1,
//                     borderRadius: "0 0 14px 14px",
//                     whiteSpace: "nowrap",
//                   }}
//                 /> */}

//                 <CardContent
//                   sx={{
//                     p: { xs: 2.5, md: 3.5 },
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: 56,
//                       height: 56,
//                       borderRadius: "16px",
//                       background: "#ecfdf3",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       mx: "auto",
//                       mb: 2,
//                     }}
//                   >
//                     <Box
//                       component="img"
//                       src="/Icons/task-checkmark-icon.svg"
//                       alt="Prelims Icon"
//                       sx={{
//                         width: 30,
//                         height: 30,
//                         filter:
//                           "invert(46%) sepia(85%) saturate(533%) hue-rotate(93deg) brightness(94%) contrast(92%)",
//                       }}
//                     />
//                   </Box>

//                   <Box textAlign="center" mb={2.5}>
//                     <Typography
//                       variant="h4"
//                       fontWeight={800}
//                       mb={1.5}
//                       sx={CARD_TITLE_SX}
//                     >
//                       Prelims Plan
//                     </Typography>
//                     <Typography color="text.secondary" sx={CARD_DESC_SX}>
//                       Daily Test Practice questions — subject wise and topic
//                       wise
//                     </Typography>
//                   </Box>

//                   <Stack spacing={1.75} mb={3}>
//                     {[
//                       "Prelims PYQ Access and Practice",
//                       "100 mock tests start from 3 Feb 2027",
//                       "Unlimited retakes",
//                       "Detailed analytics",
//                       "Real UPSC pattern (+2 / -0.66)",
//                       "Performance tracking",
//                       // "Prelims Mobile App included free",
//                     ].map((item) => (
//                       <Stack
//                         key={item}
//                         direction="row"
//                         spacing={1}
//                         alignItems="flex-start"
//                       >
//                         <CheckCircleOutlinedIcon
//                           sx={{
//                             color: "#16a34a",
//                             fontSize: 18,
//                             flexShrink: 0,
//                             mt: "2px",
//                           }}
//                         />
//                         <Typography sx={LIST_TEXT_SX}>{item}</Typography>
//                       </Stack>
//                     ))}
//                   </Stack>

//                   {/*
//                    <Typography
//                     variant="h6"
//                     fontWeight={700}
//                     mb={1.5}
//                     sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
//                   >
//                     Daily Schedule
//                   </Typography>

//                   <Stack spacing={0}>
//                     {prelimsSchedule.map((item) => (
//                       <Box
//                         key={item.day}
//                         sx={{ display: "flex", alignItems: "center", py: 0.5 }}
//                       >
//                         <Box
//                           sx={{
//                             width: { xs: 46, md: 56 },
//                             height: 34,
//                             borderRadius: "8px",
//                             background: "#ebf6ee",
//                             color: "#16a34a",
//                             fontWeight: 700,
//                             fontSize: "13px",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             flexShrink: 0,
//                           }}
//                         >
//                           {item.day}
//                         </Box>

//                         <Typography
//                           sx={{
//                             width: { xs: 34, md: 42 },
//                             ml: { xs: 1, md: 2 },
//                             fontSize: { xs: "13px", md: "15px" },
//                             fontWeight: 700,
//                             color: "#111827",
//                             flexShrink: 0,
//                           }}
//                         >
//                           {item.count}
//                         </Typography>

//                         <Typography
//                           sx={{
//                             ml: { xs: 1, md: 2 },
//                             fontSize: { xs: "13px", md: "15px" },
//                             color: "#374151",
//                             fontWeight: 500,
//                           }}
//                         >
//                           {item.subject}
//                         </Typography>
//                       </Box>
//                     ))}
//                   </Stack>

//                   <Grid container spacing={{ xs: 2, md: 3 }} mt={4}>
//                     <Grid size={6}>
//                       <Typography
//                         variant="h4"
//                         fontWeight={800}
//                         sx={{ fontSize: { xs: "1.4rem", md: "2.125rem" } }}
//                       >
//                         ₹1,111
//                       </Typography>
//                       <Typography
//                         color="text.secondary"
//                         sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}
//                       >
//                         Per Month
//                       </Typography>
//                       <Button
//                         component={Link}
//                         href="/register?plan=prelims-monthly"
//                         fullWidth
//                         variant="outlined"
//                         sx={{
//                           mt: 2,
//                           py: { xs: 1.2, md: 1.5 },
//                           borderRadius: "14px",
//                           borderColor: "#16a34a",
//                           color: "#16a34a",
//                           fontWeight: 700,
//                           textTransform: "none",
//                           fontSize: { xs: "0.85rem", md: "1rem" },
//                         }}
//                       >
//                         Monthly
//                       </Button>
//                     </Grid>

//                     <Grid size={6}>
//                       <Typography
//                         variant="h4"
//                         fontWeight={800}
//                         sx={{ fontSize: { xs: "1.4rem", md: "2.125rem" } }}
//                       >
//                         ₹11,111
//                       </Typography>
//                       <Typography
//                         color="text.secondary"
//                         sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}
//                       >
//                         Per Year
//                       </Typography>
//                       <Button
//                         component={Link}
//                         href="/register?plan=prelims-yearly"
//                         fullWidth
//                         variant="contained"
//                         sx={{
//                           mt: 2,
//                           py: { xs: 1.2, md: 1.5 },
//                           borderRadius: "14px",
//                           background: "#16a34a",
//                           fontWeight: 700,
//                           textTransform: "none",
//                           fontSize: { xs: "0.85rem", md: "1rem" },
//                           "&:hover": {
//                             background: "#15803d",
//                           },
//                         }}
//                       >
//                         Yearly
//                       </Button>
//                     </Grid>
//                   </Grid>
//                    */}

//                   {/* OLD PRICE + REGISTER BUTTON (Prelims Plan is now free) — kept for reference
//                   <Box textAlign="center" sx={{ mt: "auto" }}>
//                     <Typography variant="h3" fontWeight={800} sx={PRICE_SX}>
//                       ₹1,111
//                     </Typography>
//                     <Typography
//                       color="text.secondary"
//                       sx={{ ...PRICE_NOTE_SX, mb: 0.5 }}
//                     >
//                       Valid for the 2027 season
//                       // Per Month
//                     </Typography>
//                     <Typography
//                       sx={{ fontSize: "12px", color: "#6B7280", mb: 2 }}
//                     >
//                       Free with a Mains cum Prelims enrolment
//                     </Typography>

//                     <Button
//                       component={Link}
//                       href="/register?plan=prelims-monthly"
//                       fullWidth
//                       variant="contained"
//                       endIcon={<ArrowForwardRoundedIcon />}
//                       sx={{
//                         py: { xs: 1.2, md: 1.5 },
//                         borderRadius: "14px",
//                         background: "#16a34a",
//                         fontWeight: 700,
//                         textTransform: "none",
//                         boxShadow: "none",
//                         fontSize: { xs: "0.9rem", md: "0.95rem" },
//                         "&:hover": {
//                           background: "#15803d",
//                           boxShadow: "none",
//                         },
//                       }}
//                     >
//                       Register for Prelims Plan
//                     </Button>
//                   </Box>
//                   */}

//                   {/* FREE ACCESS — pinned to the bottom of the card */}
//                   <Box sx={{ mt: "auto" }}>
//                     <Box textAlign="center" mb={2}>
//                       <Typography
//                         variant="h3"
//                         fontWeight={800}
//                         sx={{ ...PRICE_SX, color: "#16a34a" }}
//                       >
//                         FREE
//                       </Typography>
//                       <Typography color="text.secondary" sx={PRICE_NOTE_SX}>
//                         No payment required
//                       </Typography>
//                     </Box>

//                     <Box
//                       sx={{
//                         background: "#f0fdf4",
//                         border: "1px dashed #86efac",
//                         borderRadius: "14px",
//                         p: 2,
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontWeight: 700,
//                           fontSize: { xs: "0.82rem", md: "0.88rem" },
//                           color: "#166534",
//                           mb: 1.25,
//                         }}
//                       >
//                         Free for:
//                       </Typography>

//                       <Stack spacing={1}>
//                         {[
//                           "Mains cum Prelims plan students",
//                           "Silver & Gold badge users of the Prelims Mobile App",
//                         ].map((item) => (
//                           <Stack
//                             key={item}
//                             direction="row"
//                             spacing={1}
//                             alignItems="center"
//                           >
//                             <CheckCircleOutlinedIcon
//                               sx={{
//                                 color: "#16a34a",
//                                 fontSize: 18,
//                                 flexShrink: 0,
//                               }}
//                             />
//                             <Typography
//                               sx={{
//                                 fontSize: { xs: "0.82rem", md: "0.88rem" },
//                                 color: "#166534",
//                                 fontWeight: 600,
//                               }}
//                             >
//                               {item}
//                             </Typography>
//                           </Stack>
//                         ))}
//                       </Stack>
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Container>

//         {/* ── WHY CHOOSE ── */}
//         <Box
//           sx={{
//             mt: { xs: 5, md: 6 },
//             borderRadius: { xs: "32px 32px 0 0", md: "56px 56px 0 0" },
//             border: "1px solid #dfeee3",
//             background:
//               "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(244,250,246,0.95) 100%)",
//             py: { xs: 3, md: 4 },
//             boxShadow: "0 10px 40px rgba(22,163,74,0.05)",
//             overflow: "hidden",
//           }}
//         >
//           <Typography
//             variant="h4"
//             fontWeight={800}
//             textAlign="center"
//             sx={{
//               color: "#111827",
//               fontSize: { xs: "1.25rem", md: "1.6rem" },
//             }}
//           >
//             Why Choose{" "}
//             <Box component="span" sx={{ color: "#16a34a" }}>
//               PrelimsPass
//             </Box>
//             ?
//           </Typography>

//           <Grid container sx={{ mt: { xs: 1, md: 0 } }}>
//             {[
//               {
//                 icon: (
//                   <SecurityRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
//                 ),
//                 title: "Real",
//                 subtitle: "UPSC Standard",
//               },
//               {
//                 icon: (
//                   <AllInclusiveRoundedIcon
//                     sx={{ fontSize: { xs: 22, md: 28 } }}
//                   />
//                 ),
//                 title: "Unlimited",
//                 subtitle: "Practice",
//               },
//               {
//                 icon: (
//                   <AutorenewRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
//                 ),
//                 title: "24hr",
//                 subtitle: "Evaluation",
//               },
//               {
//                 icon: (
//                   <BarChartRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
//                 ),
//                 title: "Data-Driven",
//                 subtitle: "Analytics",
//               },
//               {
//                 icon: (
//                   <CurrencyRupeeRoundedIcon
//                     sx={{ fontSize: { xs: 22, md: 28 } }}
//                   />
//                 ),
//                 title: "Affordable",
//                 subtitle: "Pricing",
//               },
//               {
//                 icon: (
//                   <Groups2RoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
//                 ),
//                 title: "Trusted by",
//                 subtitle: "Aspirants",
//               },
//             ].map((item, index) => (
//               <Grid
//                 key={index}
//                 size={{ xs: 4, md: 2 }}
//                 sx={{
//                   position: "relative",
//                   textAlign: "center",
//                   py: { xs: 2, md: 1.5 },
//                   // Bottom border separating the two rows on mobile (3-col layout)
//                   borderBottom: {
//                     xs: index < 3 ? "1px solid #e5e7eb" : "none",
//                     md: "none",
//                   },
//                 }}
//               >
//                 {/* Vertical divider */}
//                 {index !== 5 && (
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       right: 0,
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       width: "1px",
//                       height: "50px",
//                       background: "#e5e7eb",
//                       // On xs (3 cols): hide after every 3rd item
//                       display: {
//                         xs: (index + 1) % 3 === 0 ? "none" : "block",
//                         md: "block",
//                       },
//                     }}
//                   />
//                 )}

//                 {/* ICON */}
//                 <Box
//                   sx={{
//                     width: { xs: 46, md: 60 },
//                     height: { xs: 46, md: 60 },
//                     borderRadius: "50%",
//                     background:
//                       "linear-gradient(180deg, #f4fbf6 0%, #e9f7ee 100%)",
//                     border: "1px solid #e3f1e7",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     mx: "auto",
//                     mb: { xs: 1, md: 1.5 },
//                     color: "#16a34a",
//                   }}
//                 >
//                   {item.icon}
//                 </Box>

//                 {/* TITLE */}
//                 <Typography
//                   sx={{
//                     fontWeight: 700,
//                     fontSize: { xs: "11.5px", md: "13px" },
//                     color: "#111827",
//                     lineHeight: 1.2,
//                   }}
//                 >
//                   {item.title}
//                 </Typography>

//                 {/* SUBTITLE */}
//                 <Typography
//                   sx={{
//                     fontSize: { xs: "10.5px", md: "13px" },
//                     color: "#374151",
//                     lineHeight: 1.3,
//                     mt: 0.5,
//                   }}
//                 >
//                   {item.subtitle}
//                 </Typography>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       </Box>
//     </>
//   );
// }
"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  GlobalStyles,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";
import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import AllInclusiveRoundedIcon from "@mui/icons-material/AllInclusiveRounded";

/* ─────────────────────────── Tuning knobs ─────────────────────────── */

const GREEN = "#16a34a";
const DARK_GREEN = "#14532d";
const GREEN_GRADIENT = `linear-gradient(165deg, ${DARK_GREEN} 0%, #15803d 60%, ${GREEN} 100%)`;

const SLOTS = 5;
const CENTER = 2; // slot index (0-4) that gets the highlight
const GAP = 20; // px gap between cards on desktop (keep in sync with grid gap)
const SLOT_Y = [30, 12, -26, 12, 30]; // vertical offset per slot -> the arc
const SLOT_SCALE = [0.97, 1, 1.06, 1, 0.97]; // center card is bigger
const SLOT_ROT = [14, 7, 0, -7, -14]; // rotateY (deg): outer cards face the center
const PERSPECTIVE = 1500; // px, depth of the 3D tilt
const ROTATE_MS = 800; // duration of one rotation
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const INTENT_DELAY = 180; // ms the cursor must rest on a card before it rotates
const COOLDOWN = ROTATE_MS + 50; // ms before another rotation is allowed

const mod = (n: number, m: number) => ((n % m) + m) % m;

/* ───────────────────────────── Plan data ───────────────────────────── */

type Plan = {
  id: string;
  badge?: string;
  icon: ReactNode;
  title: string;
  sub: string;
  features: string[];
  price: string;
  note: string;
  cta: string;
  href: string;
  featured?: boolean; // default highlighted plan
  outlined?: boolean; // outlined button when not highlighted
};

const plans: Plan[] = [
  {
    id: "free",
    badge: "FREE TRIAL",
    icon: <CardGiftcardRoundedIcon />,
    title: "Free Plan",
    sub: "Free access",
    features: [
      "Prelims PYQ Access and Practice",
      "FREE for all registered users",
      "Basic Dashboard Access",
      "No Payment Required",
      "Login / Register Required",
    ],
    price: "₹0",
    note: "(Free Forever)",
    cta: "Get Started",
    href: "/register?plan=free-trial",
    outlined: true,
  },
  {
    id: "mobile",
    icon: <PhoneAndroidRoundedIcon />,
    title: "Prelims Mobile App",
    sub: "Subjects Coverage",
    features: [
      "Complete Prelims subject-wise coverage",
      "New facts added every week",
      "Revise more, in the shortest possible time",
    ],
    price: "₹999",
    note: "(One Time / Annual Plan)",
    cta: "Get Started",
    href: "/register?plan=mobile",
  },
  {
    id: "web",
    badge: "Most Popular",
    icon: <LaptopMacRoundedIcon />,
    title: "Prelims Web App",
    sub: "100 Mock Tests from 2027 January 1, Friday.",
    features: [
      "100 full-length mock tests",
      "Detailed analysis & performance tracking",
      "Attempt online from any device",
      "Real UPSC pattern (+2 / -0.66)",
    ],
    price: "₹999",
    note: "(One Time / Annual Plan)",
    cta: "Get Started",
    href: "/register?plan=web",
    featured: true,
  },
  {
    id: "mains-pyq",
    badge: "PYQs",
    icon: <DescriptionRoundedIcon />,
    title: "GS Mains",
    sub: "14 years PYQs + 70 Papers Answer Scripts Evaluation",
    features: [
      "14 years of GS Mains PYQs",
      "70 papers with answer scripts",
      "Expert evaluation & detailed feedback",
    ],
    price: "₹999",
    note: "(One Time / Annual Plan)",
    cta: "Get Started",
    href: "/register?plan=mains-pyq",
  },
  {
    id: "mains-mock",
    badge: "MOCK TESTS",
    icon: <GpsFixedRoundedIcon />,
    title: "GS Mains",
    sub: "10 MockTests + 50 Papers Answer Scripts Evaluation",
    features: [
      "10 full-length GS Mains mock tests",
      "50 papers with answer scripts",
      "Expert evaluation & detailed feedback",
    ],
    price: "₹999",
    note: "(One Time / Annual Plan)",
    cta: "Get Started",
    href: "/register?plan=mains-mock",
  },
];

const whyChoose = [
  {
    icon: <GpsFixedRoundedIcon />,
    title: "Focused Preparation",
    subtitle: "Subject-wise & exam-oriented learning",
  },
  {
    icon: <BarChartRoundedIcon />,
    title: "Data Driven Insights",
    subtitle: "Track your progress with real-time analytics",
  },
  {
    icon: <PersonRoundedIcon />,
    title: "Expert Mentorship",
    subtitle: "Learn from experienced mentors",
  },
  {
    icon: <SecurityRoundedIcon />,
    title: "Track Your Progress",
    subtitle: "Stay consistent and achieve your goals",
  },
];

/* ───────────────────────────── Plan card ───────────────────────────── */

type PlanCardProps = {
  plan: Plan;
  index: number; // original position in the plans array (its grid cell)
  slot: number; // current visual position (0-4)
  isCenter: boolean;
  wrapping: boolean; // card is wrapping around the end of the row
  spin: number; // rotation counter, used to restart the fade animation
  onHover: () => void;
  onLeave: () => void;
  onFocus: () => void;
};

function PlanCard({
  plan,
  index,
  slot,
  isCenter,
  wrapping,
  spin,
  onHover,
  onLeave,
  onFocus,
}: PlanCardProps) {
  const colorTransition = "color 0.5s ease, background 0.5s ease";

  const btnBg = isCenter ? "#d9f99d" : plan.outlined ? "#fff" : GREEN;
  const btnColor = isCenter ? DARK_GREEN : plan.outlined ? GREEN : "#fff";
  const btnHoverBg = isCenter
    ? "#bef264"
    : plan.outlined
      ? "#ecfdf3"
      : "#15803d";

  return (
    <Card
      onMouseEnter={onHover}
      onMouseMove={onHover}
      onMouseLeave={onLeave}
      onFocus={onFocus}
      // --d = how many cells this card is displaced from its own grid cell
      style={{ "--d": slot - index } as CSSProperties}
      sx={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        borderRadius: "24px",
        border: "1px solid",
        borderColor: isCenter ? GREEN : "#e2efe6",
        background:
          "radial-gradient(circle at 100% 0%, #e3f5e9 0%, rgba(227,245,233,0) 42%), #fff",
        boxShadow: isCenter
          ? "0 28px 50px rgba(20, 83, 45, 0.35)"
          : "0 10px 28px rgba(15, 23, 42, 0.08)",
        zIndex: isCenter ? 3 : wrapping ? 0 : 1,

        // Desktop: slide to the slot, follow the arc, tilt toward the center.
        // Below lg the cards simply stack normally.
        transform: {
          xs: "none",
          lg: `translate(calc(var(--d) * (100% + ${GAP}px)), ${SLOT_Y[slot]}px) scale(${SLOT_SCALE[slot]}) rotateY(${SLOT_ROT[slot]}deg)`,
        },
        transition: `transform ${ROTATE_MS}ms ${EASE}, box-shadow 0.6s ease, border-color 0.6s ease`,

        // A card that wraps around the row fades out while it travels
        // behind the others, then fades back in at its new slot
        animation: {
          xs: "none",
          lg: wrapping
            ? `${spin % 2 === 0 ? "pricingDipA" : "pricingDipB"} ${ROTATE_MS}ms ease`
            : "none",
        },

        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          animation: "none",
        },
      }}
    >
      {/* Green layer that fades in when the card is highlighted */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: GREEN_GRADIENT,
          opacity: isCenter ? 1 : 0,
          transition: "opacity 0.6s ease",
          pointerEvents: "none",
        }}
      />

      <CardContent
        sx={{
          position: "relative",
          zIndex: 1,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: { xs: 2.5, lg: 2, xl: 2.75 },
          "&:last-child": { pb: { xs: 2.5, lg: 2, xl: 2.75 } },
        }}
      >
        {/* Icon + badge */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isCenter ? "rgba(255,255,255,0.18)" : "#e3f5e9",
              color: isCenter ? "#fff" : GREEN,
              transition: colorTransition,
              "& svg": { fontSize: 28 },
            }}
          >
            {plan.icon}
          </Box>

          {plan.badge && (
            <Chip
              size="small"
              icon={
                plan.featured ? (
                  <WorkspacePremiumRoundedIcon sx={{ fontSize: 16 }} />
                ) : undefined
              }
              label={plan.badge}
              sx={{
                fontWeight: 700,
                fontSize: "0.7rem",
                background: plan.featured
                  ? "#fde68a"
                  : isCenter
                    ? "rgba(255,255,255,0.2)"
                    : "#eef2f1",
                color: plan.featured
                  ? "#78350f"
                  : isCenter
                    ? "#fff"
                    : "#334155",
                transition: colorTransition,
              }}
            />
          )}
        </Stack>

        {/* Title + subtitle */}
        <Typography
          fontWeight={800}
          sx={{
            fontSize: { xs: "1.35rem", lg: "1.1rem", xl: "1.3rem" },
            lineHeight: 1.25,
            color: isCenter ? "#fff" : "#0b1b2b",
            transition: colorTransition,
          }}
        >
          {plan.title}
        </Typography>
        <Typography
          sx={{
            mt: 0.75,
            mb: 2,
            fontSize: { xs: "0.88rem", lg: "0.8rem", xl: "0.86rem" },
            lineHeight: 1.45,
            color: isCenter ? "rgba(255,255,255,0.85)" : "#5b6470",
            minHeight: { lg: "4.4em" },
            transition: colorTransition,
          }}
        >
          {plan.sub}
        </Typography>

        <Box
          sx={{
            borderBottom: "1px solid",
            borderColor: isCenter ? "rgba(255,255,255,0.25)" : "#e5e7eb",
            mb: 2,
            transition: "border-color 0.5s ease",
          }}
        />

        {/* Features */}
        <Stack spacing={1.4} mb={3}>
          {plan.features.map((f) => (
            <Stack key={f} direction="row" spacing={1} alignItems="flex-start">
              <CheckCircleIcon
                sx={{
                  color: isCenter ? "#bbf7d0" : GREEN,
                  fontSize: 17,
                  mt: "2px",
                  flexShrink: 0,
                  transition: colorTransition,
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "0.88rem", lg: "0.78rem", xl: "0.85rem" },
                  lineHeight: 1.4,
                  color: isCenter ? "#fff" : "#374151",
                  transition: colorTransition,
                }}
              >
                {f}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* Price + button, pinned to the bottom so every card lines up */}
        <Box sx={{ mt: "auto" }}>
          <Box
            sx={{
              borderRadius: "14px",
              py: 1.4,
              textAlign: "center",
              mb: 1.75,
              border: "1px solid",
              borderColor: isCenter ? "rgba(253,230,138,0.7)" : "transparent",
              background: isCenter ? "rgba(255,255,255,0.14)" : "#ecfdf3",
              transition: "all 0.5s ease",
            }}
          >
            <Typography
              fontWeight={800}
              sx={{
                fontSize: { xs: "1.7rem", lg: "1.5rem", xl: "1.8rem" },
                lineHeight: 1.2,
                color: isCenter ? "#fff" : "#0b1b2b",
                transition: colorTransition,
              }}
            >
              {plan.price}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "0.8rem", lg: "0.72rem", xl: "0.78rem" },
                color: isCenter ? "rgba(255,255,255,0.85)" : "#5b6470",
                transition: colorTransition,
              }}
            >
              {plan.note}
            </Typography>
          </Box>

          <Button
            component={Link}
            href={plan.href}
            fullWidth
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              background: btnBg,
              color: btnColor,
              border: "2px solid",
              borderColor: plan.outlined && !isCenter ? GREEN : "transparent",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "14px",
              py: 1.1,
              fontSize: "0.92rem",
              boxShadow: "none",
              transition: "all 0.5s ease",
              "&:hover": { background: btnHoverBg, boxShadow: "none" },
            }}
          >
            {plan.cta}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

/* ───────────────────────────── Page ───────────────────────────── */

type Rotation = {
  offset: number; // every card sits at slot (index + offset) % 5
  shift: number; // slots moved in the last rotation (-2..2)
  spin: number; // increments each rotation
};

export default function PricingPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [rot, setRot] = useState<Rotation>({ offset: 0, shift: 0, spin: 0 });
  const rotRef = useRef(rot);
  rotRef.current = rot;

  const intentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingIndex = useRef<number | null>(null);
  const lockedId = useRef<string | null>(null); // card that landed under the cursor
  const cooldownUntil = useRef(0);

  const clearIntent = () => {
    if (intentTimer.current) clearTimeout(intentTimer.current);
    intentTimer.current = null;
    pendingIndex.current = null;
  };

  // Rotate the whole row so that cards sit at (index + target) % 5
  const rotateTo = (target: number) => {
    const prev = rotRef.current;
    if (prev.offset === target) return;

    // Shortest direction, so the hovered card travels at most 2 slots
    let shift = mod(target - prev.offset, SLOTS);
    if (shift > SLOTS / 2) shift -= SLOTS;

    const next: Rotation = { offset: target, shift, spin: prev.spin + 1 };
    rotRef.current = next;
    setRot(next);
  };

  const handleHover = (index: number) => {
    if (!isDesktop) return;

    const id = plans[index].id;

    // The card that rotated under a resting cursor must not trigger again
    if (lockedId.current === id) return;
    // Cards sliding past the cursor mid-rotation are ignored
    if (Date.now() < cooldownUntil.current) return;

    const slot = mod(index + rotRef.current.offset, SLOTS);
    if (slot === CENTER) {
      clearIntent();
      return;
    }
    if (pendingIndex.current === index) return;

    // Wait for the cursor to rest, so a quick sweep across the row
    // doesn't spin it
    clearIntent();
    pendingIndex.current = index;
    intentTimer.current = setTimeout(() => {
      intentTimer.current = null;
      pendingIndex.current = null;

      const target = mod(CENTER - index, SLOTS);
      const currentSlot = mod(index + rotRef.current.offset, SLOTS);
      // After rotating, this card will be sitting where the cursor is
      const arrivingIndex = mod(currentSlot - target, SLOTS);
      lockedId.current = plans[arrivingIndex].id;
      cooldownUntil.current = Date.now() + COOLDOWN;
      rotateTo(target);
    }, INTENT_DELAY);
  };

  const handleLeave = (index: number) => {
    clearIntent();
    if (lockedId.current === plans[index].id) lockedId.current = null;
  };

  // Keyboard users: tabbing into a card rotates it to the center too
  const handleFocus = (index: number) => {
    if (!isDesktop) return;
    clearIntent();
    rotateTo(mod(CENTER - index, SLOTS));
  };

  // Leaving the whole row rotates back to the default order
  const resetRotation = () => {
    clearIntent();
    lockedId.current = null;
    cooldownUntil.current = 0;
    rotateTo(0);
  };

  return (
    <Box
      sx={{
        background: "#f8fbf8",
        minHeight: "100vh",
        pt: { xs: 5, md: 7 },
      }}
    >
      {/* Keyframes for cards that wrap around the row (two names so the
          animation restarts on every rotation) */}
      <GlobalStyles
        styles={{
          "@keyframes pricingDipA": {
            "0%": { opacity: 1 },
            "35%": { opacity: 0 },
            "65%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
          "@keyframes pricingDipB": {
            "0%": { opacity: 1 },
            "35%": { opacity: 0 },
            "65%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
        }}
      />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Heading */}
        <Box textAlign="center" mb={{ xs: 4, md: 5 }}>
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              lineHeight: 1.2,
              color: "#0b1b2b",
            }}
          >
            Minimum Pricing. <br />
            <Box component="span" sx={{ color: GREEN }}>
              Maximum Preparation.
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: "680px",
              mx: "auto",
              color: "#5b6470",
              fontSize: { xs: "0.88rem", md: "0.98rem" },
              lineHeight: 1.7,
            }}
          >
            Choose the plan that fits your UPSC journey. Practice more, analyze
            better, and improve every day with PrelimsPass.
          </Typography>
        </Box>

        {/* Cards: 5 in one row on desktop, hover rotates a card to the center */}
        <Box
          onMouseLeave={resetRotation}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(5, 1fr)",
            },
            gap: { xs: "24px", lg: `${GAP}px` },
            alignItems: "stretch",
            pt: { lg: 5 },
            pb: { lg: 4 },
            perspective: { lg: `${PERSPECTIVE}px` },
          }}
        >
          {plans.map((plan, index) => {
            const slot = mod(index + rot.offset, SLOTS);
            const prevSlot = mod(slot - rot.shift, SLOTS);
            const wrapping = rot.spin > 0 && prevSlot + rot.shift !== slot;
            const isCenter = isDesktop ? slot === CENTER : !!plan.featured;

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                index={index}
                slot={slot}
                isCenter={isCenter}
                wrapping={isDesktop && wrapping}
                spin={rot.spin}
                onHover={() => handleHover(index)}
                onLeave={() => handleLeave(index)}
                onFocus={() => handleFocus(index)}
              />
            );
          })}
        </Box>
      </Container>

      <Box sx={{ height: 48 }} />

      {/* ── WHY CHOOSE ── */}
      <Box
        sx={{
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
          sx={{
            color: "#111827",
            fontSize: { xs: "1.25rem", md: "1.6rem" },
          }}
        >
          Why Choose{" "}
          <Box component="span" sx={{ color: "#16a34a" }}>
            PrelimsPass
          </Box>
          ?
        </Typography>

        <Grid container sx={{ mt: { xs: 1, md: 0 } }}>
          {[
            {
              icon: (
                <SecurityRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
              ),
              title: "Real",
              subtitle: "UPSC Standard",
            },
            {
              icon: (
                <AllInclusiveRoundedIcon
                  sx={{ fontSize: { xs: 22, md: 28 } }}
                />
              ),
              title: "Unlimited",
              subtitle: "Practice",
            },
            {
              icon: (
                <AutorenewRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
              ),
              title: "24hr",
              subtitle: "Evaluation",
            },
            {
              icon: (
                <BarChartRoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
              ),
              title: "Data-Driven",
              subtitle: "Analytics",
            },
            {
              icon: (
                <CurrencyRupeeRoundedIcon
                  sx={{ fontSize: { xs: 22, md: 28 } }}
                />
              ),
              title: "Affordable",
              subtitle: "Pricing",
            },
            {
              icon: (
                <Groups2RoundedIcon sx={{ fontSize: { xs: 22, md: 28 } }} />
              ),
              title: "Trusted by",
              subtitle: "Aspirants",
            },
          ].map((item, index) => (
            <Grid
              key={index}
              size={{ xs: 4, md: 2 }}
              sx={{
                position: "relative",
                textAlign: "center",
                py: { xs: 2, md: 1.5 },
                // Bottom border separating the two rows on mobile (3-col layout)
                borderBottom: {
                  xs: index < 3 ? "1px solid #e5e7eb" : "none",
                  md: "none",
                },
              }}
            >
              {/* Vertical divider */}
              {index !== 5 && (
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "1px",
                    height: "50px",
                    background: "#e5e7eb",
                    // On xs (3 cols): hide after every 3rd item
                    display: {
                      xs: (index + 1) % 3 === 0 ? "none" : "block",
                      md: "block",
                    },
                  }}
                />
              )}

              {/* ICON */}
              <Box
                sx={{
                  width: { xs: 46, md: 60 },
                  height: { xs: 46, md: 60 },
                  borderRadius: "50%",
                  background:
                    "linear-gradient(180deg, #f4fbf6 0%, #e9f7ee 100%)",
                  border: "1px solid #e3f1e7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: { xs: 1, md: 1.5 },
                  color: "#16a34a",
                }}
              >
                {item.icon}
              </Box>

              {/* TITLE */}
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

              {/* SUBTITLE */}
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
