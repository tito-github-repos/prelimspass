"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as Yup from "yup";

/* =========================
   THEME COLOR (same as Register)
========================= */
const PRIMARY = "#16a34a";
const PRIMARY_DARK = "#128a3e";

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .trim()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid email address",
    ),
});

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [emailError, setEmailError] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const formatTime = (t: number) => {
    const minutes = Math.floor(t / 60);
    const seconds = t % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (step === 2) {
      inputsRef.current[0]?.focus();
    }
  }, [step]);

  const sendOtp = async () => {
    setError("");
    setOpenSnackbar(false);

    try {
      await forgotPasswordSchema.validate({ email });
      setEmailError("");
    } catch (validationError: any) {
      setEmailError(validationError.message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        setOpenSnackbar(true);
        return;
      }

      setStep(2);
      setTimer(120);

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError("Something went wrong");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    setOpenSnackbar(false);

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      setError("Enter complete OTP");
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
        signal: controller.signal,
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        setOpenSnackbar(true);
        setOtp(["", "", "", ""]);
        requestAnimationFrame(() => {
          inputsRef.current[0]?.focus();
        });
        return;
      }

      router.push(`/forgot-password/resetpassword?email=${email}`);
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError("Something went wrong");
      }
      setOpenSnackbar(true);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (error) setError("");
    const digit = value.replace(/[^0-9]/g, "").slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length === 4) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputsRef.current[3]?.focus();
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": { borderRadius: 1.5, fontSize: 13 },
  };

  const fieldLabelSx = {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#333",
    mb: 0.5,
    mt: 1.2,
  };

  const infoPoints = [
    "We'll email a 4-digit OTP to verify it's you",
    "The code expires in 2 minutes for your security",
    "You can resend it if it doesn't arrive in time",
    "Set a new password once verification is complete",
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 1, sm: 2 },
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: 820,
          borderRadius: 2.5,
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        {/* Left Panel - no logo, text + info points only */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            backgroundImage: 'url("/Images/login/bg-img.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            px: { xs: 2.5, sm: 3, md: 4 },
            py: { xs: 3, sm: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            textAlign: "center",
            minHeight: { xs: 280, md: "100%" },
            gap: { xs: 2, md: 0 },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <Typography sx={{ fontWeight: 800, mt: { xs: 0, md: 1 }, fontSize: { xs: 17, sm: 19, md: 20 }, lineHeight: 1.25 }}>
              Account Recovery
            </Typography>

            <Typography sx={{ color: "#374151", fontSize: { xs: 12, md: 12.5 }, mt: 1.2, lineHeight: 1.6, maxWidth: 300 }}>
              Forgot your password? No worries — verify your email and
              you&apos;ll be back into your exam portal in a couple of steps.
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              maxWidth: 280,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flexGrow: 1,
              py: { xs: 1.5, md: 2.5 },
            }}
          >
            {infoPoints.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.2,
                  mb: 1.5,
                  textAlign: "left",
                  "&:last-of-type": { mb: 0 },
                }}
              >
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundColor: PRIMARY,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    mt: "1px",
                  }}
                >
                  {i + 1}
                </Box>
                <Typography sx={{ fontSize: 12, color: "#1f2d24", lineHeight: 1.4 }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Form Section - logo now sits above "Prelims Pass" */}
        <Box
          sx={{
            flex: 1.15,
            px: { xs: 2.5, sm: 3.5 },
            py: { xs: 2.5, md: 3 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
            <Image
              src="/Images/login/logo-img.png"
              alt="Prelims Pass"
              width={100}
              height={100}
              style={{ objectFit: "contain" }}
            />

            <Typography sx={{ fontWeight: 800, mt: 1, fontSize: { xs: 20, sm: 24 }, lineHeight: 1.2 }}>
              <Box component="span" sx={{ color: "#1f2d24" }}>
                Prelims{" "}
              </Box>
              <Box component="span" sx={{ color: PRIMARY }}>
                Pass
              </Box>
            </Typography>

            <Box sx={{ width: 44, height: 2, backgroundColor: PRIMARY, borderRadius: 2, my: 0.7 }} />

            <Typography sx={{ fontWeight: 700, fontSize: { xs: 16, sm: 17 }, mt: 0.8 }}>
              {step === 1 ? "Forgot Password" : "Verify OTP"}
            </Typography>

            <Typography sx={{ color: "#666", fontSize: 12.5, textAlign: "center", mt: 0.4 }}>
              {step === 1
                ? "Enter your registered email to receive a code"
                : "Enter the 4-digit code we sent you"}
            </Typography>
          </Box>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <Typography sx={{ ...fieldLabelSx, mt: 0 }}>Email</Typography>
              <TextField
                fullWidth
                size="small"
                margin="none"
                placeholder="Enter your registered email"
                type="email"
                value={email}
                onChange={async (e) => {
                  const value = e.target.value;
                  setEmail(value);
                  try {
                    await forgotPasswordSchema.validate({ email: value });
                    setEmailError("");
                  } catch (err: any) {
                    setEmailError(err.message);
                  }
                }}
                error={!!emailError}
                helperText={emailError}
                sx={textFieldSx}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={sendOtp}
                disabled={loading}
                sx={{
                  mt: 2.5,
                  py: 1.1,
                  borderRadius: 1.5,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "none",
                  backgroundColor: PRIMARY,
                  "&:hover": { backgroundColor: PRIMARY_DARK },
                }}
              >
                {loading ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Send OTP"}
              </Button>

              <Divider sx={{ my: 2.5 }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: 12.5, color: "#666" }}>
                  Remember your password?{" "}
                  <Button
                    href="/login"
                    sx={{
                      color: PRIMARY,
                      textTransform: "none",
                      fontWeight: 700,
                      padding: 0,
                      minWidth: 0,
                      fontSize: 12.5,
                      verticalAlign: "baseline",
                      "&:hover": { backgroundColor: "transparent", color: PRIMARY_DARK },
                    }}
                  >
                    Back to Login
                  </Button>
                </Typography>
              </Box>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <Typography sx={{ textAlign: "center", fontSize: 12.5, color: "#444", mb: 0.6 }}>
                OTP sent to <b>{email}</b>
              </Typography>

              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: 12.5,
                  mb: 2,
                  color:
                    timer === 0
                      ? "error.main"
                      : timer < 30
                        ? "warning.main"
                        : "text.secondary",
                }}
              >
                {timer > 0 ? `Expires in ${formatTime(timer)}` : "OTP expired"}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: { xs: 1, sm: 1.5 },
                  mb: 1,
                  flexWrap: "wrap",
                }}
              >
                {otp.map((digit, i) => (
                  <TextField
                    key={i}
                    value={digit}
                    inputRef={(el) => (inputsRef.current[i] = el)}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    error={!!error}
                    inputProps={{
                      maxLength: 1,
                      inputMode: "numeric",
                      style: {
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: 700,
                        padding: "10px 0",
                      },
                    }}
                    sx={{
                      width: { xs: 48, sm: 56 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        "&.Mui-focused fieldset": { borderColor: PRIMARY },
                      },
                    }}
                  />
                ))}
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={verifyOtp}
                disabled={loading || otp.includes("") || timer === 0}
                sx={{
                  mt: 2,
                  py: 1.1,
                  borderRadius: 1.5,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "none",
                  backgroundColor: PRIMARY,
                  "&:hover": { backgroundColor: PRIMARY_DARK },
                }}
              >
                {loading ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Verify OTP"}
              </Button>

              {timer === 0 && (
                <Button
                  fullWidth
                  onClick={sendOtp}
                  sx={{
                    mt: 1,
                    fontSize: 12.5,
                    fontWeight: 600,
                    textTransform: "none",
                    color: PRIMARY,
                    "&:hover": { backgroundColor: "rgba(22,163,74,0.06)" },
                  }}
                >
                  Resend OTP
                </Button>
              )}
            </>
          )}
        </Box>
      </Card>

      <Snackbar
        open={openSnackbar && !!error}
        autoHideDuration={3000}
        onClose={() => {
          setOpenSnackbar(false);
          setError("");
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          severity="error"
          onClose={() => {
            setOpenSnackbar(false);
            setError("");
          }}
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}