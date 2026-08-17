"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
  useTheme,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as yup from "yup";
import { Snackbar, Alert } from "@mui/material";

/* ---- Shared design tokens (matched to Exam History / Progress pages) ---- */
const TEXT_SECONDARY = "#64748b";
const TEXT_PRIMARY = "#1e293b";

// Themes every TextField / Select focus & hover state to the brand color
// instead of MUI's default blue.
const FIELD_SX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0.5,
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--primary-light)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--primary)",
      borderWidth: "1px",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--primary)",
  },
};

// Hover/selected styling for dropdown menus (e.g. Gender) — same pattern as
// the Subject filter dropdown on the Exam History page. This targets the
// menu's Paper (rendered in a portal), so it must be passed via
// MenuProps.PaperProps.sx on the Select, not sx on the Select itself.
const MENU_ITEM_SX = {
  "& .MuiMenuItem-root:hover": {
    backgroundColor: "var(--primary-light)",
    color: "var(--primary)",
  },
  "& .MuiMenuItem-root.Mui-selected": {
    backgroundColor: "var(--primary-light)",
    color: "var(--primary)",
  },
  "& .MuiMenuItem-root.Mui-selected:hover": {
    backgroundColor: "var(--primary-light)",
    color: "var(--primary)",
  },
};

const PRIMARY_BTN_SX = {
  borderRadius: 0.25,
  textTransform: "none" as const,
  backgroundColor: "var(--primary)",
  boxShadow: "none",
  fontWeight: 600,
  transition: "background-color 0.3s, color 0.3s",
  "&:hover": {
    backgroundColor: "var(--primary)",
    opacity: 0.92,
    boxShadow: "none",
  },
  "&.Mui-disabled": {
    backgroundColor: "#e2e8f0",
    color: "#94a3b8",
  },
};

/* ---- Validation for Personal Information -- */
const personalInformationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .required("Email is required")
    .trim("Email should not contain spaces")
    .email("Enter a valid email address")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      "Enter a valid email with proper domain",
    ),
  mobile: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, {
      message: "Enter a valid 10-digit mobile number",
      excludeEmptyString: true,
    }),
  birthDate: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
});

/* ---- Validation Schema for Account Settings ---- */
const accountSettingsSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(4, "Username must be at least 4 characters"),

  currentPassword: yup.string().when("newPassword", {
    is: (val: string) => !!val,
    then: (schema) => schema.required("Current password is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  newPassword: yup
    .string()
    .nullable()
    .test(
      "password-rules",
      "Password must be at least 8 characters, include uppercase, lowercase, number and special character",
      (value) => {
        if (!value) return true; // no password change
        return (
          value.length >= 8 &&
          /[A-Z]/.test(value) &&
          /[a-z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
        );
      },
    ),

  confirmPassword: yup.string().when("newPassword", {
    is: (val: string) => !!val,
    then: (schema) =>
      schema
        .required("Confirm password is required")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

/* ---- Tab Panel Component ---- */
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

/* ----- Personal Information Tab Component ---- */
const PersonalInformationTab = ({
  personalInfo,
  setPersonalInfo,
  isMobile,
  fetchUserData,
  loading,
}: any) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const validatePersonalField = async (
    field: string,
    value: any,
    updatedInfo: any,
  ) => {
    try {
      await personalInformationSchema.validateAt(field, updatedInfo);
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    } catch (err: any) {
      setErrors((prev: any) => ({ ...prev, [field]: err.message }));
    }
  };

  const handlePersonalInfoChange = async (field: string, value: string) => {
    const updatedInfo = {
      ...personalInfo,
      [field]: value,
    };

    setPersonalInfo(updatedInfo);

    await validatePersonalField(field, value, updatedInfo);
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true); // disable button
    try {
      await personalInformationSchema.validate(personalInfo, {
        abortEarly: false,
      });
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(personalInfo),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Update failed");
      }

      await fetchUserData();

      setSnackbar({
        open: true,
        message: "Personal information updated successfully!",
        severity: "success",
      });
      setErrors({});
    } catch (err: any) {
      if (err.inner) {
        const formErrors: any = {};
        err.inner?.forEach((e: any) => (formErrors[e.path] = e.message));
        setErrors(formErrors);
      } else {
        setSnackbar({
          open: true,
          message: err.message || "Update failed",
          severity: "error",
        });
      }
    } finally {
      setLoadingSubmit(false); // re-enable button
    }
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 0.5,
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
          position: "relative",
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255,255,255,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              borderRadius: 0.5,
            }}
          >
            <CircularProgress sx={{ color: "var(--primary)" }} />
          </Box>
        )}
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#2c3e50",
              fontSize: { xs: 16, sm: 17, md: 19 },
              mb: 0.25,
            }}
          >
            Personal Information
          </Typography>
          <Typography variant="body2" sx={{ color: TEXT_SECONDARY, mb: 2.5 }}>
            Your basic details, contact info, and demographic information.
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handlePersonalInfoSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={personalInfo.email}
                  disabled
                  onChange={(e) =>
                    handlePersonalInfoChange("email", e.target.value)
                  }
                  size={isMobile ? "small" : "medium"}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={FIELD_SX}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  type="text"
                  label="Mobile Number"
                  value={personalInfo.mobile}
                  onChange={(e) =>
                    handlePersonalInfoChange(
                      "mobile",
                      e.target.value.replace(/\D/g, ""),
                    )
                  }
                  size={isMobile ? "small" : "medium"}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  inputProps={{
                    inputMode: "numeric", // mobile keyboard numbers
                    maxLength: 10,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+91</InputAdornment>
                    ),
                  }}
                  sx={FIELD_SX}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={personalInfo.firstName}
                  onChange={(e) =>
                    handlePersonalInfoChange("firstName", e.target.value)
                  }
                  size={isMobile ? "small" : "medium"}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  sx={FIELD_SX}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={personalInfo.lastName}
                  onChange={(e) =>
                    handlePersonalInfoChange("lastName", e.target.value)
                  }
                  size={isMobile ? "small" : "medium"}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  sx={FIELD_SX}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={personalInfo.birthDate}
                  onChange={(e) =>
                    handlePersonalInfoChange("birthDate", e.target.value)
                  }
                  size={isMobile ? "small" : "medium"}
                  error={!!errors.birthDate}
                  helperText={errors.birthDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ max: "9999-12-31" }}
                  sx={FIELD_SX}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormControl
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                  error={!!errors.gender}
                  sx={FIELD_SX}
                >
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    value={personalInfo.gender}
                    onChange={(e) =>
                      handlePersonalInfoChange("gender", e.target.value)
                    }
                    MenuProps={{ PaperProps: { sx: MENU_ITEM_SX } }}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {errors.gender && (
                    <FormHelperText>{errors.gender}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loadingSubmit}
                startIcon={
                  loadingSubmit ? (
                    <CircularProgress size={16} sx={{ color: "#94a3b8" }} />
                  ) : undefined
                }
                sx={{
                  ...PRIMARY_BTN_SX,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  px: { xs: 2, sm: 3 },
                }}
              >
                {loadingSubmit ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

/* ----- Account Settings Tab Component ---- */
const AccountSettingsTab = ({
  accountSettings,
  setAccountSettings,
  handleChange,
  isMobile,
  userData,
  fetchUserData,
  loading,
}: any) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  const validateAccountField = async (
    field: string,
    value: any,
    updatedSettings: any,
  ) => {
    try {
      await accountSettingsSchema.validateAt(field, updatedSettings);
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    } catch (err: any) {
      setErrors((prev: any) => ({ ...prev, [field]: err.message }));
    }
  };

  const handleAccountChange =
    (field: string) => async (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      const updatedSettings = {
        ...accountSettings,
        [field]: value,
      };

      setAccountSettings(updatedSettings);

      await validateAccountField(field, value, updatedSettings);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true); // disable button

    try {
      await accountSettingsSchema.validate(accountSettings, {
        abortEarly: false,
      });
      setErrors({});

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      // Determine what to update
      const updateUsername = accountSettings.username !== userData.username;
      const updatePassword = !!accountSettings.newPassword;

      if (!updateUsername && !updatePassword) {
        setSnackbar({
          open: true,
          message: "No changes to update",
          severity: "info",
        });
        return;
      }

      let successMessages: string[] = [];
      let errorMessages: string[] = [];
      let usernameUpdated = false;
      let passwordUpdated = false;

      // 1️⃣ Try updating username independently
      if (accountSettings.username !== userData?.username) {
        try {
          const res = await fetch("/api/users/update-username", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ username: accountSettings.username }),
          });
          const data = await res.json();

          if (!res.ok) throw new Error(data.error || "Username update failed");
          usernameUpdated = true;
          successMessages.push("Username updated successfully!");
        } catch (err: any) {
          errorMessages.push(err.message);
        }
      }

      // 2️⃣ Try updating password independently
      if (accountSettings.newPassword) {
        try {
          const res = await fetch("/api/users/update-password", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              currentPassword: accountSettings.currentPassword,
              newPassword: accountSettings.newPassword,
            }),
          });
          const data = await res.json();

          if (!res.ok) throw new Error(data.error || "Password update failed");
          passwordUpdated = true;
          successMessages.push("Password updated successfully!");
        } catch (err: any) {
          errorMessages.push(err.message);
        }
      }

      // 3️⃣ Show SUCCESS snackbar (even if errors exist)
      if (successMessages.length > 0) {
        setSnackbar({
          open: true,
          severity: "success",
          message: successMessages.join(" "),
        });
      }

      // Show ERROR snackbar (even if success exists)
      if (errorMessages.length > 0) {
        setTimeout(
          () => {
            setSnackbar({
              open: true,
              severity: "error",
              message: errorMessages.join(" "),
            });
          },
          successMessages.length > 0 ? 1200 : 0,
        );
      }

      // 4️⃣ Clear password fields if updated successfully
      if (passwordUpdated) {
        setAccountSettings((prev: any) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }

      // 5️⃣ Refresh user data
      await fetchUserData();
    } catch (err: any) {
      if (err.inner) {
        const formErrors: any = {};
        err.inner.forEach((e: any) => (formErrors[e.path] = e.message));
        setErrors(formErrors);
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: err.message || "Update failed",
        });
      }
    } finally {
      setLoadingSubmit(false); // re-enable button
    }
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 0.5,
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
          position: "relative",
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255,255,255,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              borderRadius: 0.5,
            }}
          >
            <CircularProgress sx={{ color: "var(--primary)" }} />
          </Box>
        )}
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#2c3e50",
              fontSize: { xs: 16, sm: 17, md: 19 },
              mb: 0.25,
            }}
          >
            Account Settings
          </Typography>
          <Typography variant="body2" sx={{ color: TEXT_SECONDARY, mb: 2.5 }}>
            Update your username and manage your password.
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={accountSettings.username}
              onChange={handleChange("username")}
              disabled
              sx={{ mb: 2, ...FIELD_SX }}
              size={isMobile ? "small" : "medium"}
              error={!!errors.username}
              helperText={
                errors.username ||
                "This is how you'll appear to others on the platform"
              }
            />
            <TextField
              fullWidth
              label="Current Password"
              type={showCurrent ? "text" : "password"}
              value={accountSettings.currentPassword}
              onChange={handleAccountChange("currentPassword")}
              sx={{ mb: 2, ...FIELD_SX }}
              size={isMobile ? "small" : "medium"}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => setShowCurrent(!showCurrent)}
                    >
                      {showCurrent ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showNew ? "text" : "password"}
              value={accountSettings.newPassword}
              onChange={handleAccountChange("newPassword")}
              sx={{ mb: 1, ...FIELD_SX }}
              size={isMobile ? "small" : "medium"}
              error={!!errors.newPassword}
              helperText={
                errors.newPassword ||
                "Password must be at least 8 characters with letters and numbers"
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => setShowNew(!showNew)}
                    >
                      {showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirm ? "text" : "password"}
              value={accountSettings.confirmPassword}
              onChange={handleAccountChange("confirmPassword")}
              sx={{ mb: 3, ...FIELD_SX }}
              size={isMobile ? "small" : "medium"}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loadingSubmit}
                startIcon={
                  loadingSubmit ? (
                    <CircularProgress size={16} sx={{ color: "#94a3b8" }} />
                  ) : undefined
                }
                sx={{
                  ...PRIMARY_BTN_SX,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  px: { xs: 2, sm: 3 },
                }}
              >
                {loadingSubmit ? "Updating..." : "Update Account"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

/* ----- Main Profile Page Component ---- */
const ProfilePage = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    birthDate: "",
    gender: "",
  });

  const [accountSettings, setAccountSettings] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) return;

      const res = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!json.success)
        throw new Error(json.error || "Failed to fetch user data");
      const user = json.data;

      setUserData(user);

      setPersonalInfo({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        mobile: user.mobile_number || "",
        birthDate: user.student_details?.dob
          ? user.student_details.dob.split("T")[0]
          : "",
        gender: user.student_details?.gender || "",
      });

      setAccountSettings((prev) => ({
        ...prev,
        username: user.username,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePersonalInfoChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPersonalInfo({ ...personalInfo, [field]: event.target.value });
    };

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setAccountSettings({ ...accountSettings, [field]: event.target.value });
    };

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia(theme.breakpoints.down("md"));
    setIsMobile(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme.breakpoints]);

  if (!mounted) {
    return null; // Prevent hydration mismatch by not rendering until mounted
  }

  const fullName = [personalInfo.firstName, personalInfo.lastName]
    .filter(Boolean)
    .join(" ");
  const initials =
    `${personalInfo.firstName?.[0] || ""}${personalInfo.lastName?.[0] || ""}`.toUpperCase() ||
    "?";

  const TABS = ["Personal Information", "Account Settings"];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: {
          xs: "60px 8px 16px",
          sm: "70px 16px 24px",
          md: "16px 24px 32px",
          lg: "24px 32px 40px",
        },
      }}
    >
      <Box sx={{ maxWidth: 860, mx: "auto" }}>
        {/* Page Header */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: 22, sm: 26, md: 30 },
              color: "#2c3e50",
            }}
          >
            Profile Settings
          </Typography>
          <Typography
            sx={{
              color: TEXT_SECONDARY,
              fontSize: { xs: 13, sm: 14 },
              mt: 0.5,
            }}
          >
            Manage your personal information and account security.
          </Typography>
        </Box>

        {/* Tab Switcher */}
        <Box
          sx={{
            display: "inline-flex",
            gap: 0.5,
            p: 0.5,
            mb: 0.5,
            bgcolor: "#eef1f5",
            borderRadius: 999,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {TABS.map((label, index) => (
            <Button
              key={label}
              onClick={() => setActiveTab(index)}
              disableRipple
              sx={{
                flex: { xs: 1, sm: "unset" },
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: 12.5, sm: 13.5 },
                px: { xs: 1.5, sm: 2.5 },
                py: 0.9,
                color: activeTab === index ? "#fff" : TEXT_SECONDARY,
                backgroundColor:
                  activeTab === index ? "var(--primary)" : "transparent",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor:
                    activeTab === index ? "var(--primary)" : "#e2e8f0",
                  opacity: activeTab === index ? 0.92 : 1,
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {/* Personal Information */}
        <TabPanel value={activeTab} index={0}>
          <PersonalInformationTab
            personalInfo={personalInfo}
            handlePersonalInfoChange={handlePersonalInfoChange}
            isMobile={isMobile}
            setPersonalInfo={setPersonalInfo}
            fetchUserData={fetchUserData}
            loading={loading}
          />
        </TabPanel>

        {/* Account Settings */}
        <TabPanel value={activeTab} index={1}>
          <AccountSettingsTab
            accountSettings={accountSettings}
            setAccountSettings={setAccountSettings}
            userData={userData}
            fetchUserData={fetchUserData}
            handleChange={handleChange}
            isMobile={isMobile}
            loading={loading}
          />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default ProfilePage;
