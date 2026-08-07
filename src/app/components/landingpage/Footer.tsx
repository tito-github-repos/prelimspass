"use client";

import React from "react";
import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
  color: string;
}

interface ContactItem {
  icon: React.ReactNode;
  text: string;
  href?: string;
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "/pricing" },
      { label: "Mentorship", href: "/mentorship" },
      { label: "Contact", href: "/contacts" },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "Prelims", href: "/programs/prelims" },
      { label: "Mains", href: "/programs/mains" },
      { label: "Test Series", href: "/programs/test-series" },
      { label: "PYQ Practice", href: "/programs/pyq" },
    ],
  },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: <LinkedInIcon fontSize="small" />,
    href: "https://www.linkedin.com/in/prelims-pass-51b4a1392/",
    label: "LinkedIn",
    color: "",
  },
  {
    icon: <InstagramIcon fontSize="small" />,
    href: "https://www.instagram.com/prelims.pass/",
    label: "Instagram",
    color: "#E1306C",
  },
  {
    icon: <FacebookIcon fontSize="small" />,
    href: "https://www.facebook.com/profile.php?id=61583998232154",
    label: "Facebook",
    color: "#1877F2",
  },
];

const CONTACT_ITEMS: ContactItem[] = [
  {
    icon: <EmailOutlinedIcon sx={{ fontSize: 15 }} />,
    text: "prelimspass@gmail.com",
    href: "mailto:prelimspass@gmail.com",
  },
  {
    icon: <PhoneOutlinedIcon sx={{ fontSize: 15 }} />,
    text: "+91 93442 71134",
    href: "tel:+919344271134",
  },
  {
    icon: <LocationOnOutlinedIcon sx={{ fontSize: 15, width: 28 }} />,
    text: "B4, Lumiers Enclave, #5/1092, Giri Nagar Main Road, Ramapuram, Chennai 600089",
  },
];

const COLORS = {
  bg: "#0c1510",
  bgCard: "#111a14",
  border: "rgba(255,255,255,0.07)",
  green: "#16a34a",
  greenMuted: "rgba(37,163,90,0.12)",
  textPrimary: "#f0f7f2",
  textSecondary: "#8aa898",
  textMuted: "#526858",
} as const;

const FooterLogo: React.FC = () => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={1.25}
    component="a"
    href="/"
    sx={{ textDecoration: "none", display: "inline-flex" }}
  >
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: "11px",
        background: "linear-gradient(135deg, #1a6b3c 0%, #16a34a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 0 0 1px rgba(37,163,90,0.3), 0 4px 14px rgba(26,107,60,0.4)",
      }}
    >
      <AutoStoriesIcon sx={{ color: "#fff", fontSize: 19 }} />
    </Box>

    <Typography
      sx={{
        fontWeight: 700,
        fontSize: "1.5rem",
        letterSpacing: "-0.3px",
        color: COLORS.textPrimary,
        "& span": { color: COLORS.green },
      }}
    >
      Prelims<span>Pass</span>
    </Typography>
  </Stack>
);

interface LinkColumnProps {
  column: FooterColumn;
}

const LinkColumn: React.FC<LinkColumnProps> = ({ column }) => (
  <Box>
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: "0.8rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: COLORS.green,
        mb: 2.5,
      }}
    >
      {column.title}
    </Typography>

    <Stack spacing={1.35}>
      {column.links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          underline="none"
          sx={{
            fontSize: "0.875rem",
            color: COLORS.textSecondary,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            transition: "all 0.18s ease",

            "& .arrow": {
              opacity: 0,
              transform: "translateX(-4px)",
              transition: "all 0.18s ease",
              fontSize: "0.75rem",
              color: COLORS.green,
            },

            "&:hover": {
              color: COLORS.textPrimary,
              gap: 1,

              "& .arrow": {
                opacity: 1,
                transform: "translateX(0)",
              },
            },
          }}
        >
          {link.label}
          <ArrowForwardIcon className="arrow" />
        </Link>
      ))}
    </Stack>
  </Box>
);

const Footer: React.FC = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="footer"
      sx={{
        background: COLORS.bg,
        borderTop: `1px solid ${COLORS.border}`,
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 4, md: 5 } }}>
        {/* TOP */}
        <Box sx={{ py: 5 }}>
          <Grid container spacing={5} alignItems="flex-start">
            {/* BRAND */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FooterLogo />

              <Typography
                sx={{
                  mt: 2,
                  fontSize: "0.85rem",
                  color: COLORS.textSecondary,
                  lineHeight: 1.7,
                }}
              >
                India's focused UPSC Prelims platform for serious aspirants
                aiming to crack it in first attempt.
              </Typography>

              <Stack direction="row" spacing={1.2} sx={{ mt: 2.5 }}>
                {SOCIAL_LINKS.map((social) => (
                  <IconButton
                    key={social.label}
                    component="a"
                    href={social.href}
                    target="_blank"
                    size="small"
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      background: COLORS.bgCard,
                      border: `1px solid ${COLORS.border}`,
                      color: COLORS.textSecondary,
                      "&:hover": {
                        background: `${social.color}18`,
                        color: social.color,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Grid>

            {/* QUICK LINKS */}
            <Grid size={{ xs: 6, sm: 6, md: 2 }}>
              <LinkColumn column={FOOTER_COLUMNS[0]} />
            </Grid>

            {/* PROGRAMS (TEXT ONLY) */}
            <Grid size={{ xs: 6, sm: 6, md: 2 }}>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: COLORS.green,
                    mb: 2.5,
                  }}
                >
                  Programs
                </Typography>

                <Stack spacing={1.35}>
                  {FOOTER_COLUMNS[1].links.map((item) => (
                    <Typography
                      key={item.label}
                      sx={{
                        fontSize: "0.875rem",
                        color: COLORS.textSecondary,
                      }}
                    >
                      {item.label}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* CONTACT */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: COLORS.green,
                  mb: 2,
                }}
              >
                Contact
              </Typography>

              <Stack spacing={1.5}>
                {CONTACT_ITEMS.map((item, idx) => (
                  <Stack
                    key={idx}
                    direction="row"
                    spacing={1.2}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "8px",
                        background: COLORS.greenMuted,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: COLORS.green,
                      }}
                    >
                      {item.icon}
                    </Box>

                    {item.href ? (
                      <Link
                        href={item.href}
                        underline="none"
                        sx={{
                          fontSize: "0.82rem",
                          color: COLORS.textSecondary,
                          "&:hover": { color: COLORS.textPrimary },
                        }}
                      >
                        {item.text}
                      </Link>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "0.82rem",
                          color: COLORS.textSecondary,
                        }}
                      >
                        {item.text}
                      </Typography>
                    )}
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: COLORS.border }} />

        {/* BOTTOM */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1.5}
          sx={{ py: 3 }}
        >
          <Typography sx={{ fontSize: "0.8rem", color: COLORS.textMuted }}>
            © {new Date().getFullYear()} PrelimsPass. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={3}>
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                underline="none"
                sx={{
                  fontSize: "0.8rem",
                  color: COLORS.textMuted,
                  "&:hover": { color: COLORS.textSecondary },
                }}
              >
                {item}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
