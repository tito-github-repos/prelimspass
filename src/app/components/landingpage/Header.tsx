"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Insights", href: "/upsc-insights" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contacts" },
];

const Logo: React.FC = () => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={1.2}
    component={Link}
    href="/"
    sx={{
      textDecoration: "none",
      flexShrink: 0,
    }}
  >
    <Box
      sx={{
        width: 42,
        height: 42,
        borderRadius: "12px",
        background: "linear-gradient(135deg, #1a6b3c 0%, #16a34a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 14px rgba(26,107,60,0.30)",
        flexShrink: 0,
      }}
    >
      <AutoStoriesIcon
        sx={{
          color: "#fff",
          fontSize: 22,
        }}
      />
    </Box>

    <Typography
      component="span"
      sx={{
        fontWeight: 800,
        fontSize: {
          xs: "1.35rem",
          md: "2rem",
        },
        letterSpacing: "-0.5px",
        color: "#111827",
        lineHeight: 1,

        "& span": {
          color: "#16a34a",
        },
      }}
    >
      Prelims<span>Pass</span>
    </Typography>
  </Stack>
);

interface DesktopNavItemProps {
  item: NavItem;
  isActive: boolean;
}

const DesktopNavItem: React.FC<DesktopNavItemProps> = ({ item, isActive }) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Link
        href={item.href}
        style={{
          textDecoration: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",

            color: isActive ? "#16a34a" : "#374151",

            fontWeight: isActive ? 700 : 500,
            fontSize: "1rem",
            letterSpacing: "-0.01em",

            px: 1.6,
            py: 0.95,

            borderRadius: "10px",

            transition: "all 0.2s ease",

            position: "relative",

            "&:hover": {
              color: "#16a34a",
              background: "rgba(26,107,60,0.08)",
            },

            "&::after": isActive
              ? {
                  content: '""',
                  position: "absolute",
                  bottom: -2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "55%",
                  height: "3px",
                  borderRadius: "999px",
                  background: "#16a34a",
                }
              : {},
          }}
        >
          {item.label}
        </Box>
      </Link>
    </Box>
  );
};

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  open,
  onClose,
  pathname,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "min(320px, 85vw)",
          background: "#fff",
          borderLeft: "none",
          boxShadow: "-4px 0 40px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Logo />

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#374151",
            background: "#f9fafb",
            borderRadius: "10px",

            "&:hover": {
              background: "#f0faf4",
              color: "#16a34a",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Mobile Nav */}
      <List sx={{ px: 1.5, pt: 1.5 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <ListItem disablePadding key={item.label} sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={onClose}
                sx={{
                  borderRadius: "12px",
                  px: 2,
                  py: 1.2,

                  background: isActive ? "rgba(26,107,60,0.08)" : "transparent",

                  "&:hover": {
                    background: "rgba(26,107,60,0.06)",
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.95rem",
                    color: isActive ? "#16a34a" : "#374151",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider
        sx={{
          mx: 2.5,
          my: 2,
          borderColor: "#f0f0f0",
        }}
      />

      {/* Mobile CTA */}
      <Box sx={{ px: 2.5, pb: 3 }}>
        <Button
          fullWidth
          variant="contained"
          component={Link}
          href="/login"
          sx={{
            fontWeight: 700,
            fontSize: "0.92rem",
            borderRadius: "12px",
            py: 1.2,
            textTransform: "none",
            background: "linear-gradient(135deg, #16a34a 0%, #16a34a 100%)",
            boxShadow: "0 8px 24px rgba(26,107,60,0.28)",

            "&:hover": {
              background: "linear-gradient(135deg, #16a34a 0%, #1a6b3c 100%)",
            },
          }}
        >
          Log In
        </Button>
      </Box>
    </Drawer>
  );
};

const Header: React.FC = () => {
  const theme = useTheme();
  const pathname = usePathname();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isMobile && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isMobile, drawerOpen]);

  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen((prev) => !prev);
  }, []);

  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 0,
          left: 0,
          right: 0,

          background: scrolled
            ? "rgba(255,255,255,0.92)"
            : "rgba(255,255,255,0.88)",

          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",

          borderBottom: "1px solid rgba(0,0,0,0.06)",

          boxShadow: scrolled
            ? "0 6px 24px rgba(0,0,0,0.08)"
            : "0 2px 12px rgba(0,0,0,0.04)",

          transition: "all 0.3s ease",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: "100% !important",

            px: {
              xs: 2,
              sm: 3,
              lg: 5,
            },
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              minHeight: {
                xs: 72,
                md: 82,
              },

              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            {!isMobile && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  ml: "auto",
                  mr: 4,
                }}
              >
                {NAV_ITEMS.map((item) => (
                  <DesktopNavItem
                    key={item.label}
                    item={item}
                    isActive={pathname === item.href}
                  />
                ))}
              </Stack>
            )}

            {/* Desktop Login */}
            {!isMobile && (
              <Button
                component={Link}
                href="/login"
                variant="contained"
                disableElevation
                sx={{
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.15,

                  background:
                    "linear-gradient(135deg, #1a6b3c 0%, #16a34a 100%)",

                  transition: "all 0.25s ease",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #16a34a 0%, #1a6b3c 100%)",

                    transform: "translateY(-2px)",
                  },
                }}
              >
                Log In
              </Button>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <IconButton
                onClick={handleDrawerToggle}
                size="medium"
                sx={{
                  color: "#374151",

                  background: drawerOpen ? "rgba(26,107,60,0.08)" : "#ffffff",

                  borderRadius: "12px",

                  border: "1px solid #e5e7eb",

                  transition: "all 0.2s ease",

                  "&:hover": {
                    background: "rgba(26,107,60,0.08)",
                    color: "#16a34a",
                  },
                }}
              >
                {drawerOpen ? (
                  <CloseIcon fontSize="small" />
                ) : (
                  <MenuIcon fontSize="small" />
                )}
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Spacer */}
      <Box
        sx={{
          height: {
            xs: 72,
            md: 82,
          },
        }}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
      />
    </>
  );
};

export default Header;
