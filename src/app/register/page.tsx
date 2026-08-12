"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Card,
  Button,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  FormControl,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle } from "@mui/icons-material";
import * as yup from "yup";

/* =========================
   THEME COLOR
========================= */
const PRIMARY = "#16a34a";
const PRIMARY_DARK = "#128a3e";

const steps = ["Account", "Personal"];

/* =========================
   VALIDATION SCHEMAS
========================= */
const accountSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .trim("Email should not contain spaces")
    .email("Enter a valid email address")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      "Enter a valid email with proper domain",
    ),

  username: yup
    .string()
    .min(4, "Username must be at least 4 characters")
    .required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/,
      "Password must contain at least one special character",
    ),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

const personalSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  mobile: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, {
      message: "Enter a valid 10-digit mobile number",
      excludeEmptyString: true,
    }),
  dob: yup.string().required("Date of Birth is required"),
  gender: yup.string().required("Gender is required"),
  agree: yup.bool().oneOf([true], "You must agree to terms"),
});

const stepSchemas = [accountSchema, personalSchema];

export default function Register() {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    mobile: "",
    dob: "",
    gender: "",
    agree: false,
  });

  const [errors, setErrors] = useState<any>({});

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

  const handleChange = async (field: string, value: any) => {
    // Update form data
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate current step field
    try {
      await stepSchemas[activeStep].validateAt(field, {
        ...formData,
        [field]: value,
      });
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    } catch (err: any) {
      setErrors((prev: any) => ({ ...prev, [field]: err.message }));
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    if (loading) return; // prevent multiple submissions

    try {
      setLoading(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 201) {
        setAlert({
          open: true,
          message: data.message || "Registration successful! Redirecting...",
          severity: "success",
        });
        console.log("Saved user:", data);
        globalThis.location.href = "/login"; // redirect to login/dashboard
      } else if (res.status === 409) {
        setAlert({
          open: true,
          message: data.error || "User already exists.",
          severity: "error",
        });
        console.log(data.error);
      } else {
        console.log(data.error);
        setAlert({
          open: true,
          message: data.error || "Something went wrong.",
          severity: "error",
        });
      }
    } catch (error: any) {
      console.error("Submit failed:", error);
      setAlert({
        open: true,
        message: "Something went wrong: " + error.message,
        severity: "error",
      });
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Modify handleNext
  const handleNext = async () => {
    try {
      await stepSchemas[activeStep].validate(formData, { abortEarly: false });

      if (activeStep === steps.length - 1) {
        // Last step → call backend API
        await handleSubmit();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } catch (err: any) {
      const newErrors: any = {};
      if (err.inner) {
        for (const e of err.inner) {
          if (e.path) newErrors[e.path] = e.message;
        }
      }
      setErrors(newErrors);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const highlights = [
    "Access to hundreds of practice exams",
    "Detailed performance analytics",
    "Progress tracking and certificates",
    "24/7 availability from any device",
    "Expert-curated question bank",
  ];

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
          maxWidth: 900,
          borderRadius: 2.5,
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        {/* Left Panel */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            backgroundImage: 'url("/Images/login/bg-img.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            px: { xs: 2.5, sm: 3, md: 4 },
            py: { xs: 3, sm: 4, md: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between", // <-- spreads blocks across full height
            textAlign: "center",
            minHeight: { xs: 320, md: "100%" }, // <-- prevents squashing on mobile
            gap: { xs: 2, md: 0 },
          }}
        >
          {/* Top block: logo + heading + description */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
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
              sx={{
                fontWeight: 800,
                mt: 2,
                fontSize: { xs: 18, sm: 20, md: 22 },
                lineHeight: 1.25,
              }}
            >
              Join Our Learning Community
            </Typography>

            <Typography
              sx={{
                color: "#374151",
                fontSize: { xs: 12.5, md: 13.5 },
                mt: 1.2,
                lineHeight: 1.6,
                maxWidth: 320,
              }}
            >
              Register now to access our comprehensive Prelims Pass exam portal
              designed to enhance your learning experience.
            </Typography>

            <Typography
              sx={{
                color: "#374151",
                fontSize: { xs: 12.5, md: 13.5 },
                mt: 1,
                lineHeight: 1.6,
                maxWidth: 320,
              }}
            >
              Take exams, track your progress, and improve your knowledge with
              our interactive platform.
            </Typography>
          </Box>

          {/* Middle block: highlights - now vertically centered and given room to breathe */}
          <Box
            sx={{
              width: "100%",
              maxWidth: 300,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flexGrow: 1,
              py: { xs: 2, md: 3 },
            }}
          >
            {highlights.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.2,
                  mb: 1.6,
                  textAlign: "left",
                  "&:last-of-type": { mb: 0 },
                }}
              >
                <CheckCircle
                  sx={{
                    color: PRIMARY,
                    fontSize: 18,
                    mt: "1px",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: 12.5, md: 13.5 },
                    color: "#1f2d24",
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Optional bottom spacer/footer block for balance */}
          <Box sx={{ width: "100%", height: { xs: 0, md: 8 } }} />
        </Box>

        {/* Form Section */}
        <Box
          sx={{
            flex: 1.15,
            px: { xs: 2.5, sm: 3.5 },
            py: { xs: 2.5, md: 3 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {/* Heading block */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: 20, sm: 26 },
                lineHeight: 1.2,
              }}
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
                my: 0.7,
              }}
            />

            <Typography
              sx={{ color: "#666", fontSize: 12.5, textAlign: "center" }}
            >
              Sign up to start your learning journey
            </Typography>
          </Box>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 1.8,
              "& .MuiStepLabel-label": { fontSize: 12 },
              "& .MuiStepIcon-root.Mui-active": { color: PRIMARY },
              "& .MuiStepIcon-root.Mui-completed": { color: PRIMARY },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 1: Account */}
          {activeStep === 0 && (
            <Box>
              <Typography sx={{ ...fieldLabelSx, mt: 0 }}>Email</Typography>
              <TextField
                fullWidth
                size="small"
                margin="none"
                placeholder="Enter your email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                sx={textFieldSx}
              />

              <Typography sx={fieldLabelSx}>Username</Typography>
              <TextField
                fullWidth
                size="small"
                margin="none"
                placeholder="Choose a username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                error={!!errors.username}
                helperText={errors.username}
                sx={textFieldSx}
              />

              <Typography sx={fieldLabelSx}>Password</Typography>
              <TextField
                fullWidth
                size="small"
                margin="none"
                placeholder="Create a password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
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
                sx={textFieldSx}
              />

              <Typography sx={fieldLabelSx}>Confirm Password</Typography>
              <TextField
                fullWidth
                size="small"
                margin="none"
                placeholder="Re-enter your password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        aria-label="toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff sx={{ fontSize: 18 }} />
                        ) : (
                          <Visibility sx={{ fontSize: 18 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Box>
          )}

          {/* Step 2: Personal */}
          {activeStep === 1 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ ...fieldLabelSx, mt: 0 }}>
                    First Name
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    margin="none"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    sx={textFieldSx}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ ...fieldLabelSx, mt: { xs: 1.2, sm: 0 } }}>
                    Last Name
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    margin="none"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    sx={textFieldSx}
                  />
                </Box>
              </Box>

              <Typography sx={fieldLabelSx}>Mobile Number</Typography>
              <TextField
                fullWidth
                size="small"
                margin="none"
                type="text"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={(e) =>
                  handleChange("mobile", e.target.value.replace(/\D/g, ""))
                }
                error={!!errors.mobile}
                helperText={errors.mobile}
                inputProps={{
                  inputMode: "numeric",
                  maxLength: 10,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontSize: 13, color: "#666" }}>
                        +91
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />

              <Typography sx={fieldLabelSx}>Date of Birth</Typography>
              <TextField
                fullWidth
                size="small"
                margin="none"
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                error={!!errors.dob}
                helperText={errors.dob}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                inputProps={{ max: "9999-12-31" }}
                sx={textFieldSx}
              />

              <Typography sx={fieldLabelSx}>Gender</Typography>
              <FormControl
                fullWidth
                size="small"
                error={!!errors.gender}
                sx={textFieldSx}
              >
                <Select
                  displayEmpty
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  error={!!errors.gender}
                >
                  <MenuItem value="">
                    <Typography sx={{ fontSize: 13, color: "#8a8a8a" }}>
                      Select Gender
                    </Typography>
                  </MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {errors.gender && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ mt: 0.3, ml: 0.5 }}
                  >
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>

              <FormControlLabel
                sx={{ mt: 1.4 }}
                control={
                  <Checkbox
                    size="small"
                    checked={formData.agree}
                    onChange={(e) => handleChange("agree", e.target.checked)}
                    sx={{
                      color: "#8a8a8a",
                      "&.Mui-checked": { color: PRIMARY },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 12.5, color: "#444" }}>
                    I agree to the{" "}
                    <Link href="#" style={{ color: PRIMARY, fontWeight: 600 }}>
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" style={{ color: PRIMARY, fontWeight: 600 }}>
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
              {errors.agree && (
                <Typography
                  color="error"
                  variant="caption"
                  display="block"
                  sx={{ ml: 0.5 }}
                >
                  {errors.agree}
                </Typography>
              )}
            </Box>
          )}

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1.5,
              mt: 2,
            }}
          >
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{
                borderRadius: 1.5,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                borderColor: PRIMARY,
                color: PRIMARY,
                "&:hover": {
                  borderColor: PRIMARY_DARK,
                  backgroundColor: "rgba(22,163,74,0.06)",
                },
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              sx={{
                borderRadius: 1.5,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "none",
                px: 3,
                backgroundColor: PRIMARY,
                "&:hover": { backgroundColor: PRIMARY_DARK },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1, color: "white" }} />
                  Submitting...
                </>
              ) : activeStep === steps.length - 1 ? (
                "Complete Registration"
              ) : (
                "Next"
              )}
            </Button>
          </Box>

          {/* Login Link */}
          <Typography
            variant="body2"
            align="center"
            sx={{ color: "#666", fontSize: 12.5, mt: 1.6 }}
          >
            Already have an account?{" "}
            <Link href="/login" style={{ color: PRIMARY, fontWeight: 700 }}>
              Log in here
            </Link>
          </Typography>
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
