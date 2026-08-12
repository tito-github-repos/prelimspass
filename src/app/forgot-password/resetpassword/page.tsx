"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  CheckCircle,
} from "@mui/icons-material";

import Image from "next/image";

/* =========================
   THEME COLORS
========================= */

const PRIMARY = "#16a34a";
const PRIMARY_DARK = "#128a3e";

/* =========================
   YUP VALIDATION SCHEMA
========================= */

const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
      excludeEmptyString: true,
    })
    .matches(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
      excludeEmptyString: true,
    })
    .matches(/\d/, {
      message: "Password must contain at least one number",
      excludeEmptyString: true,
    })
    .matches(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
      excludeEmptyString: true,
    }),

  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  /* =========================
     FIELD VALIDATION
  ========================= */

  const validateField = async (
    field: "password" | "confirmPassword",
    value: string,
    updatedValues?: {
      password?: string;
      confirmPassword?: string;
    },
  ) => {
    try {
      await resetPasswordSchema.validateAt(field, {
        password: updatedValues?.password ?? password,

        confirmPassword: updatedValues?.confirmPassword ?? confirmPassword,
      });

      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        [field]: err.message,
      }));
    }
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);

    try {
      /* Validate */

      await resetPasswordSchema.validate(
        {
          password,
          confirmPassword,
        },
        {
          abortEarly: false,
        },
      );

      /* Get email from URL */

      const params = new URLSearchParams(window.location.search);

      const email = params.get("email");

      if (!email) {
        setSnackbar({
          open: true,
          message: "Invalid password reset request",
          severity: "error",
        });

        setLoading(false);
        return;
      }

      /* API Call */

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSnackbar({
          open: true,
          message: data.error || "Failed to reset password",
          severity: "error",
        });

        setLoading(false);
        return;
      }

      /* Success */

      setSnackbar({
        open: true,
        message: "Password updated successfully!",
        severity: "success",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const fieldErrors: {
          password?: string;
          confirmPassword?: string;
        } = {};

        err.inner.forEach((e: any) => {
          if (!fieldErrors[e.path as keyof typeof fieldErrors]) {
            fieldErrors[e.path as keyof typeof fieldErrors] = e.message;
          }
        });

        setErrors(fieldErrors);
      } else {
        setSnackbar({
          open: true,
          message: "Something went wrong",
          severity: "error",
        });
      }

      setLoading(false);
    }
  };

  /* =========================
     COMMON TEXT FIELD STYLE
  ========================= */

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1.5,
      fontSize: 13,
      backgroundColor: "#fff",

      "&.Mui-focused fieldset": {
        borderColor: PRIMARY,
      },
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: PRIMARY,
    },

    "& .MuiFormHelperText-root": {
      fontSize: 10.5,
      marginLeft: 0,
      marginTop: 0.5,
    },
  };

  /* =========================
     LABEL STYLE
  ========================= */

  const fieldLabelSx = {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#333",
    mb: 0.5,
    mt: 1.5,
  };

  /* =========================
     LEFT PANEL CONTENT
  ========================= */

  const infoPoints = [
    {
      title: "Create a Strong Password",
      text: "Use a secure password to protect your account",
    },
    {
      title: "Keep Your Account Safe",
      text: "Your password helps keep your exam data secure",
    },
    {
      title: "Continue Learning",
      text: "Get back to your exam preparation without interruption",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        p: {
          xs: 1,
          sm: 2,
        },

        backgroundColor: "#fff",
      }}
    >
      {/* =========================================
          MAIN CARD
      ========================================= */}

      <Card
        sx={{
          display: "flex",

          flexDirection: {
            xs: "column",
            md: "row",
          },

          width: "100%",

          maxWidth: 760,

          borderRadius: 2,

          overflow: "hidden",

          boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
        }}
      >
        {/* =========================================
    LEFT PANEL
========================================= */}

        <Box
          sx={{
            flex: 1,
            position: "relative",

            backgroundImage: 'url("/Images/login/bg-img.png")',

            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",

            px: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },

            py: {
              xs: 2.5,
              sm: 3,
              md: 3.5,
            },

            display: "flex",
            flexDirection: "column",
            alignItems: "center",

            minHeight: {
              xs: 280,
              md: 470,
            },
          }}
        >
          {/* LEFT HEADING */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",

              // Move heading slightly downward
              pt: {
                xs: 1,
                md: 2,
              },

              // Space between description and points
              mb: {
                xs: 2.5,
                md: 3,
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,

                fontSize: {
                  xs: 18,
                  sm: 19,
                  md: 20,
                },

                lineHeight: 1.25,

                color: "#111",
              }}
            >
              Reset Your Password
            </Typography>

            <Typography
              sx={{
                color: "#374151",

                fontSize: {
                  xs: 11.5,
                  md: 12,
                },

                mt: 1,
                mb:4,

                lineHeight: 1.55,

                maxWidth: 270,

                textAlign: "center",
              }}
            >
              Create a new password and get back to your Prelims Pass learning
              journey.
            </Typography>
          </Box>

          {/* INFORMATION POINTS */}

          <Box
            sx={{
              width: "100%",
              maxWidth: 275,

              display: "flex",
              flexDirection: "column",

              
            }}
          >
            {infoPoints.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",

                  gap: 1,

                  mb: 1.8,

                  textAlign: "left",

                  "&:last-child": {
                    mb: 0,
                  },
                }}
              >
                {/* CHECK ICON */}

                <Box
                  sx={{
                    width: 20,
                    height: 20,

                    borderRadius: "50%",

                    backgroundColor: PRIMARY,
                    color: "#fff",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    flexShrink: 0,

                    mt: "1px",
                  }}
                >
                  <CheckCircle
                    sx={{
                      fontSize: 14,
                    }}
                  />
                </Box>

                {/* TEXT */}

                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,

                      fontWeight: 700,

                      color: "#1f2d24",

                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 10.5,

                      color: "#4b5563",

                      lineHeight: 1.4,

                      mt: 0.2,
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* =========================================
            RIGHT PANEL
        ========================================= */}

        <Box
          sx={{
            flex: 1.15,

            px: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },

            py: {
              xs: 2.5,
              md: 2.5,
            },

            display: "flex",

            flexDirection: "column",

            justifyContent: "center",
          }}
        >
          {/* =================================
              LOGO + TITLE
          ================================= */}

          <Box
            sx={{
              display: "flex",

              flexDirection: "column",

              alignItems: "center",

              mb: 1.5,
            }}
          >
            <Image
              src="/Images/login/logo-img.png"
              alt="Prelims Pass"
              width={100}
              height={100}
              style={{
                objectFit: "contain",
              }}
            />

            <Typography
              sx={{
                fontWeight: 800,

                mt: 1,

                fontSize: {
                  xs: 20,
                  sm: 24,
                },

                lineHeight: 1.2,
              }}
            >
              <Box
                component="span"
                sx={{
                  color: "#1f2d24",
                }}
              >
                Prelims{" "}
              </Box>

              <Box
                component="span"
                sx={{
                  color: PRIMARY,
                }}
              >
                Pass
              </Box>
            </Typography>

            {/* GREEN LINE */}

            <Box
              sx={{
                width: 42,

                height: 2,

                backgroundColor: PRIMARY,

                borderRadius: 2,

                my: 0.6,
              }}
            />
          </Box>

          {/* =================================
              FORM
          ================================= */}

          <Box component="form" onSubmit={handleSubmit}>
            {/* NEW PASSWORD */}

            <Typography
              sx={{
                ...fieldLabelSx,

                mt: 0,
              }}
            >
              New Password
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="Enter your new password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                const value = e.target.value;

                setPassword(value);

                validateField("password", value, {
                  password: value,
                });

                if (confirmPassword) {
                  validateField("confirmPassword", confirmPassword, {
                    password: value,
                    confirmPassword,
                  });
                }
              }}
              error={!!errors.password}
              helperText={errors.password}
              sx={textFieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined
                      sx={{
                        fontSize: 18,
                        color: "#888",
                      }}
                    />
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
                        <VisibilityOff
                          sx={{
                            fontSize: 19,
                          }}
                        />
                      ) : (
                        <Visibility
                          sx={{
                            fontSize: 19,
                          }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* PASSWORD REQUIREMENT */}

            <Typography
              sx={{
                fontSize: 10,

                color: "#777",

                lineHeight: 1.45,

                mt: 1,

                px: 0.5,
              }}
            >
              Password must contain at least 8 characters, including uppercase,
              lowercase, number and special character.
            </Typography>

            {/* CONFIRM PASSWORD */}

            <Typography
              sx={{
                ...fieldLabelSx,

                mt: 2,
              }}
            >
              Confirm Password
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="Re-enter your new password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                const value = e.target.value;

                setConfirmPassword(value);

                validateField("confirmPassword", value, {
                  password,
                  confirmPassword: value,
                });
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={textFieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined
                      sx={{
                        fontSize: 18,
                        color: "#888",
                      }}
                    />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff
                          sx={{
                            fontSize: 19,
                          }}
                        />
                      ) : (
                        <Visibility
                          sx={{
                            fontSize: 19,
                          }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* UPDATE PASSWORD */}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,

                py: 0.9,

                borderRadius: 1.5,

                fontSize: 12.5,

                fontWeight: 700,

                textTransform: "uppercase",

                backgroundColor: PRIMARY,

                boxShadow: "0 2px 5px rgba(0,0,0,0.15)",

                "&:hover": {
                  backgroundColor: PRIMARY_DARK,
                },

                "&:disabled": {
                  backgroundColor: "rgba(22,163,74,0.5)",
                },
              }}
            >
              {loading ? "Updating Password..." : "UPDATE PASSWORD"}
            </Button>
          </Box>

          {/* =================================
              DIVIDER
          ================================= */}

          <Divider
            sx={{
              my: 1.8,
            }}
          />

          {/* =================================
              BACK TO LOGIN
          ================================= */}

          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 12,

                color: "#666",
              }}
            >
              Remember your password?{" "}
              <Button
                href="/login"
                sx={{
                  color: PRIMARY,

                  textTransform: "none",

                  fontWeight: 700,

                  padding: 0,

                  minWidth: 0,

                  fontSize: 12,

                  verticalAlign: "baseline",

                  "&:hover": {
                    backgroundColor: "transparent",

                    color: PRIMARY_DARK,
                  },
                }}
              >
                Back to Login
              </Button>
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* =========================================
          SNACKBAR
      ========================================= */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar({
            ...snackbar,
            open: false,
          })
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          sx={{
            width: "100%",
          }}
          onClose={() =>
            setSnackbar({
              ...snackbar,
              open: false,
            })
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
