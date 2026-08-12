"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import * as Yup from "yup";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  MailOutline,
  LockOutlined,
  MenuBookOutlined,
  TrendingUpOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";

/* =========================
   THEME COLOR
========================= */
const PRIMARY = "#16a34a";
const PRIMARY_DARK = "#128a3e";

/* =========================
   YUP VALIDATION SCHEMA
========================= */
const loginSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .trim()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid email address",
    ),

  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  /* =========================
     FIELD LEVEL VALIDATION
  ========================= */
  const validateField = async (field: "email" | "password", value: string) => {
    try {
      await loginSchema.validateAt(field, {
        email,
        password,
        [field]: value,
      });

      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };

  /* =========================
     LOGIN HANDLER
  ========================= */
  const handleLogin = async () => {
    if (loading) return; // prevent multiple submissions

    try {
      setLoading(true);
      setErrors({});

      await loginSchema.validate({ email, password }, { abortEarly: false });

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlert({
          open: true,
          message: data.error || "Login failed",
          severity: "error",
        });
        return;
      }

      const sessionStartTime = Date.now().toString();

      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        localStorage.setItem("sessionStartTime", sessionStartTime);
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("sessionStartTime", sessionStartTime);
      }

      setAlert({
        open: true,
        message: data.message || "Login successful! Redirecting...",
        severity: "success",
      });

      if (data.role === "admin") {
        router.push("/admin-pages");
      } else if (data.role === "student") {
        router.push("/student-pages");
      } else {
        setAlert({
          open: true,
          message: "Invalid user role. Please contact support.",
          severity: "error",
        });
      }
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const fieldErrors: any = {};
        err.inner.forEach((e: any) => {
          fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error("Login Error:", err);
        setAlert({
          open: true,
          message: "Something went wrong. Try again.",
          severity: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <MenuBookOutlined sx={{ color: "#fff", fontSize: 15 }} />,
      title: "Practice Unlimited MCQs",
      subtitle: "Topic-wise & Subject-wise Tests",
    },
    {
      icon: <TrendingUpOutlined sx={{ color: "#fff", fontSize: 15 }} />,
      title: "Track Your Progress",
      subtitle: "Detailed Performance Analytics",
    },
    {
      icon: <VerifiedUserOutlined sx={{ color: "#fff", fontSize: 15 }} />,
      title: "Secure & Reliable",
      subtitle: "Your Data, Our Priority",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: mounted && isMobile ? "column" : "row",
          width: mounted && isMobile ? "100%" : 720,
          borderRadius: 2.5,
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        {/* Left Panel - fills full height using space-between, anchored from top */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            backgroundImage: 'url("/Images/login/bg-img.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            px: 3,
            py: 3.5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "center",
            minHeight: mounted && isMobile ? "auto" : 460,
          }}
        >
          {/* Top: logo, heading, tagline */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* <Image
              src="/Images/login/logo-img.png"
              alt="Prelims Pass"
              width={84}
              height={84}
              style={{ objectFit: "contain" }}
            /> */}

            <Typography
              sx={{ fontWeight: 800, mt: 4, fontSize: 22, lineHeight: 1.2 }}
            >
              <Box component="span" sx={{ color: "#1f2d24" }}>
                Welcome{" "}
              </Box>
              <Box component="span" sx={{ color: PRIMARY }}>
                Back !!!
              </Box>
            </Typography>

            <Box
              sx={{
                width: 44,
                height: 2,
                backgroundColor: PRIMARY,
                borderRadius: 2,
                my: 0.9,
              }}
            />

            <Typography
              sx={{
                color: "#374151",
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
              Your Path to Success in{" "}
              <Box component="span" sx={{ color: PRIMARY, fontWeight: 700 }}>
                Competitive Exams
              </Box>
            </Typography>
          </Box>

          {/* Middle: feature list */}
          <Box sx={{ width: "100%", maxWidth: 240 }}>
            {features.map((f, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  mb: 2.4,
                  textAlign: "left",
                  "&:last-of-type": { mb: 0 },
                }}
              >
                <Box
                  sx={{
                    width: 25,
                    height: 25,
                    minWidth: 25,
                    borderRadius: "50%",
                    backgroundColor: PRIMARY,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {f.icon}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 12,
                      color: "#1f2d24",
                      lineHeight: 1.3,
                    }}
                  >
                    {f.title}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 10.5, color: "#4a5a4f", lineHeight: 1.3 }}
                  >
                    {f.subtitle}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Bottom: book illustration */}
          <Box sx={{ width: "100%", maxWidth: 140 }}>
            <Image
              src="/Images/login/book-image.png"
              alt="Books"
              width={160}
              height={120}
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
            />
          </Box>
        </Box>

        {/* Form Section - anchored from top with SAME py as left so logos align */}
        <Box
          sx={{
            flex: 1,
            px: 3.5,
            py: 3.5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Image
              src="/Images/login/logo-img.png"
              alt="Prelims Pass"
              width={100}
              height={100}
              style={{ objectFit: "contain" }}
            />
            <Typography
              sx={{ fontWeight: 900, mt: 1, fontSize: 26, lineHeight: 1.2 }}
            >
              <Box component="span" sx={{ color: "#1f2d24" }}>
                Prelims{" "}
              </Box>
              <Box component="span" sx={{ color: PRIMARY }}>
                Pass
              </Box>
            </Typography>
            <Box
              sx={{
                width: 44,
                height: 2,
                backgroundColor: PRIMARY,
                borderRadius: 2,
                my: 0.9,
              }}
            />
            <Typography sx={{ color: "#666", mt: 0.3, mb: 2, fontSize: 12.5 }}>
              Login to continue your learning journey
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {/* Email field - label on its own line above the box */}
            <Typography
              sx={{ fontSize: 12.5, fontWeight: 600, color: "#333", mb: 0.5 }}
            >
              Email ID
            </Typography>
            <TextField
              margin="none"
              fullWidth
              size="small"
              placeholder="Enter Email ID"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline sx={{ color: "#8a8a8a", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1.6,
                "& .MuiOutlinedInput-root": { borderRadius: 1.5, fontSize: 13 },
              }}
            />

            {/* Password field - label on its own line above the box */}
            <Typography
              sx={{ fontSize: 12.5, fontWeight: 600, color: "#333", mb: 0.5 }}
            >
              Password
            </Typography>
            <TextField
              margin="none"
              fullWidth
              size="small"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "#8a8a8a", fontSize: 18 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ fontSize: 18 }} />
                      ) : (
                        <Visibility sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 1.5, fontSize: 13 },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: 0.6,
                mb: 1.2,
              }}
            >
              <Link
                href="/forgot-password"
                style={{
                  textDecoration: "none",
                  color: PRIMARY,
                  fontWeight: 500,
                  fontSize: 12.5,
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mb: 1.8,
                py: 1,
                fontWeight: 700,
                fontSize: 13.5,
                borderRadius: 1.5,
                backgroundColor: PRIMARY,
                "&:hover": { backgroundColor: PRIMARY_DARK },
              }}
            >
              {loading ? (
                <span
                  style={{
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress size={16} sx={{ mr: 1, color: "white" }} />
                  Logging in...
                </span>
              ) : (
                "LOGIN"
              )}
            </Button>

            <Typography
              variant="body2"
              align="center"
              sx={{ color: "#666", fontSize: 12.5 }}
            >
              Don't have an account?{" "}
              <Link
                href="/register"
                style={{ color: PRIMARY, fontWeight: 700 }}
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Card>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
