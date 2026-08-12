"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Menu as MuiMenu,
  MenuItem,
  IconButton,
  Drawer,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  Person,
  Menu as MenuIcon,
  Close,
  Assignment,
  BarChart,
  History,
  QuestionAnswer,
  KeyboardArrowDown,
  Settings,
  Logout,
} from "@mui/icons-material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { logout } from "@/utils/auth";

interface Props {
  onShowNavigationWarning?: (route: string) => void;
}

const navItems = [
  { text: "Dashboard", icon: <HomeOutlinedIcon sx={{ fontSize: 18 }} />, route: "/student-pages" },
  { text: "My Exams", icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />, route: "/student-pages/my_exams" },
  { text: "PYQ Exams", icon: <Assignment sx={{ fontSize: 18 }} />, route: "/student-pages/previous_year_questions" },
  { text: "Exam History", icon: <History sx={{ fontSize: 18 }} />, route: "/student-pages/exam_history" },
  { text: "Progress", icon: <BarChart sx={{ fontSize: 18 }} />, route: "/student-pages/student_progress" },
];

const DRAWER_WIDTH = 260;

const StudentHeader: React.FC<Props> = ({ onShowNavigationWarning }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [username, setUsername] = useState<string>("Student");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const profileOpen = Boolean(profileAnchor);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || sessionStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleNav = (route: string) => {
    setMobileOpen(false);
    if (pathname === "/student-pages/exam_taking" && onShowNavigationWarning) {
      onShowNavigationWarning(route);
    } else {
      router.push(route);
    }
  };

  const handleLogout = () => {
    setProfileAnchor(null);
    setMobileOpen(false);
    logout();
  };

  const renderNavLinks = (vertical = false) =>
    navItems.map((item) => {
      const active = pathname === item.route;
      return (
        <Button
          key={item.text}
          fullWidth={vertical}
          onClick={() => handleNav(item.route)}
          startIcon={item.icon}
          sx={
            vertical
              ? {
                  justifyContent: "flex-start",
                  textTransform: "none",
                  color: active ? "var(--primary)" : "text.primary",
                  fontWeight: active ? 700 : 500,
                  bgcolor: active ? "var(--primary-light)" : "transparent",
                  borderRadius: "10px",
                  py: 1.2,
                  px: 1.5,
                  mb: 0.5,
                  "&:hover": { bgcolor: "var(--primary-light)", color: "var(--primary)" },
                }
              : {
                  position: "relative",
                  textTransform: "none",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--primary)" : "text.secondary",
                  borderRadius: "10px",
                  px: 1.5,
                  py: 1,
                  "&:hover": { bgcolor: "var(--primary-light)", color: "var(--primary)" },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 2,
                    left: "50%",
                    width: "40px",
                    height: "3px",
                    borderRadius: "2px",
                    backgroundColor: "var(--primary)",
                    transform: active ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0)",
                    opacity: active ? 1 : 0,
                    transition: "transform 0.2s ease, opacity 0.2s ease",
                  },
                }
          }
        >
          {item.text}
        </Button>
      );
    });

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "background.paper",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "10px 16px" : "12px 32px",
            maxWidth: "1600px",
            margin: "0 auto",
          }}
        >
          {/* Left: logo */}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
            onClick={() => handleNav("/student-pages")}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #1a6b3c 0%, #16a34a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(26,107,60,0.30)",
                flexShrink: 0,
              }}
            >
              <AutoStoriesIcon sx={{ color: "var(--white)", fontSize: 21 }} />
            </Box>
            <Typography
              component="span"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.35rem", md: "1.9rem" },
                letterSpacing: "-0.5px",
                color: "var(--black)",
                lineHeight: 1,
                "& span": { color: "var(--primary)" },
              }}
            >
              Prelims<span>Pass</span>
            </Typography>
          </Box>

          {/* Desktop nav */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {renderNavLinks(false)}
            </Box>
          )}

          {/* Right side: profile (desktop) OR hamburger (mobile) */}
          {isMobile ? (
            <IconButton onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                  borderRadius: "999px",
                  px: 1,
                  py: 0.5,
                  transition: "background-color 0.2s ease",
                  bgcolor: profileOpen ? "var(--primary-light)" : "transparent",
                  "&:hover": { bgcolor: "var(--primary-light)" },
                }}
                onClick={(e) => setProfileAnchor(e.currentTarget)}
              >
                <Avatar sx={{ bgcolor: "var(--primary)", width: 36, height: 36 }}>
                  <Person sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600, ml: 0.5 }}>
                  {username}
                </Typography>
                <KeyboardArrowDown
                  sx={{
                    fontSize: 20,
                    color: profileOpen ? "var(--primary)" : "text.secondary",
                    transition: "transform 0.2s ease, color 0.2s ease",
                    transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </Box>

              <MuiMenu
                anchorEl={profileAnchor}
                open={profileOpen}
                onClose={() => setProfileAnchor(null)}
                disableScrollLock
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.2,
                    minWidth: 220,
                    borderRadius: "14px",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.14)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    overflow: "visible",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -6,
                      right: 18,
                      width: 12,
                      height: 12,
                      bgcolor: "background.paper",
                      transform: "rotate(45deg)",
                      borderLeft: "1px solid rgba(0,0,0,0.06)",
                      borderTop: "1px solid rgba(0,0,0,0.06)",
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => { setProfileAnchor(null); handleNav("/student-pages/profile_settings"); }}
                  sx={{
                    py: 1.2,
                    px: 2,
                    gap: 1.5,
                    bgcolor: "transparent",
                    "&:hover": {
                      bgcolor: "var(--primary-light)",
                      color: "var(--primary)",
                      "& .MuiSvgIcon-root": { color: "var(--primary)" },
                    },
                  }}
                >
                  <Settings sx={{ fontSize: 20, color: "text.secondary" }} />
                  <Typography variant="body2">My Profile</Typography>
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.2,
                    px: 2,
                    gap: 1.5,
                    color: "error.main",
                    bgcolor: "transparent",
                    "&:hover": { bgcolor: "rgba(211,47,47,0.08)" },
                  }}
                >
                  <Logout sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Logout</Typography>
                </MenuItem>
              </MuiMenu>
            </>
          )}
        </Box>
      </Box>

      {/* Mobile sidebar drawer */}
      <Drawer
        anchor="left"
        open={isMobile && mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: DRAWER_WIDTH, p: 2, display: "flex", flexDirection: "column" } }}
      >
        {/* Drawer header: logo + close */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, px: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #1a6b3c 0%, #16a34a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <AutoStoriesIcon sx={{ color: "var(--white)", fontSize: 16 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--black)" }}>
              Prelims<span style={{ color: "var(--primary)" }}>Pass</span>
            </Typography>
          </Box>
          <IconButton onClick={() => setMobileOpen(false)} size="small">
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 1 }} />

        {/* Nav links */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {renderNavLinks(true)}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Profile actions pinned at bottom */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Button
            fullWidth
            startIcon={<Settings sx={{ fontSize: 18 }} />}
            onClick={() => handleNav("/student-pages/profile_settings")}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              color: "text.primary",
              fontWeight: 500,
              borderRadius: "10px",
              py: 1.2,
              px: 1.5,
              mb: 0.5,
              "&:hover": { bgcolor: "var(--primary-light)", color: "var(--primary)" },
            }}
          >
            My Profile
          </Button>
          <Button
            fullWidth
            startIcon={<Logout sx={{ fontSize: 18 }} />}
            onClick={handleLogout}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              color: "error.main",
              fontWeight: 600,
              borderRadius: "10px",
              py: 1.2,
              px: 1.5,
              "&:hover": { bgcolor: "rgba(211,47,47,0.08)" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default StudentHeader;