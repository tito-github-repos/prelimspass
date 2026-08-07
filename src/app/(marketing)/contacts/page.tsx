'use client';


import React from 'react';
import './contacts.css';
import { useRouter } from 'next/navigation';

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ContactPage = () => {
 const router = useRouter();

  return (
    <Box className="contact-page">
      
        {/* TOP SECTION */}
        <Grid
          container
          spacing={6}
          alignItems="center"
          className="contact-top-section"
        >
          {/* LEFT CONTENT */}
          <Grid size = {{xs: 12, md: 6}}>
            <Box className="contact-left-content">
              <Typography variant="h3" className="contact-title">
                CONTACT US
              </Typography>

              <Box className="title-line" />

              <Typography className="contact-subtitle">
                We are here to help you prepare for UPSC Exams
              </Typography>

              <Typography className="contact-description">
                Have questions or need guidance? Our team is ready to provide
                expert mentorship, preparation strategy, and personalized
                support to help you crack the UPSC Civil Services Examination
                with confidence.
              </Typography>

              {/* FEATURES */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                className="feature-stack"
              >
                <Card className="feature-card">
                  <CardContent>
                    <SupportAgentIcon className="feature-icon" />

                    <Typography className="feature-title">
                      Expert Guidance
                    </Typography>

                    <Typography className="feature-text">
                      Personalized UPSC mentorship
                    </Typography>
                  </CardContent>
                </Card>

                <Card className="feature-card">
                  <CardContent>
                    <LocationOnIcon className="feature-icon" />

                    <Typography className="feature-title">
                      Strategy Support
                    </Typography>

                    <Typography className="feature-text">
                      Smart preparation planning
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>

              {/* BUTTON */}
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                className="journey-btn"
               onClick={() => router.push('/login')}
              >
                Start Your UPSC Journey
              </Button>
            </Box>
          </Grid>

          {/* RIGHT IMAGE */}
          <Grid size = {{xs: 12, md: 6}}>
            <Box className="contact-image-wrapper">
              <img
                src="/Images/contact-us.png"
                alt="Contact Us"
                className="contact-image"
              />
            </Box>
          </Grid>
        </Grid>

        {/* BOTTOM SECTION */}
        <Grid container spacing={4}>
          {/* MAP */}
          <Grid size = {{xs: 12, md: 6}}>
            <Card className="map-card">
              <iframe
                title="office-location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8123456789!2d80.1985!3d13.0678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526f4d6c5c5c5c%3A0x5c5c5c5c5c5c5c5c!2sRamapuram%2C%20Chennai%2C%20Tamil%20Nadu%2C%20India!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </Card>
          </Grid>

          {/* CONTACT INFO */}  
          <Grid size = {{xs: 12, md: 6}}>
            <Card className="info-card">
              <Typography className="info-title">
                Contact Information
              </Typography>

              <Stack spacing={4}>
                {/* Payment */}
                {/* <Box className="info-item">
                  <PhoneIcon className="info-icon" />

                  <Box>
                    <Typography className="info-heading">
                      Payment (GPay)
                    </Typography>

                    <Typography className="info-text">
                      +91 9499953256
                    </Typography>
                  </Box>
                </Box> */}

                {/* Enquiry */}
                <Box className="info-item">
                  <SupportAgentIcon className="info-icon" />

                  <Box>
                    <Typography className="info-heading">
                      For Enquiry
                    </Typography>

                    <Typography className="info-text">
                      +91 9499953256 , +91 9344271134
                    </Typography>
                  </Box>
                </Box>

                {/* Email */}
                <Box className="info-item">
                  <EmailIcon className="info-icon" />

                  <Box>
                    <Typography className="info-heading">
                      Email
                    </Typography>

                    <Typography className="info-text">
                      prelimspass@gmail.com
                    </Typography>
                  </Box>
                </Box>

                {/* Location */}
                <Box className="info-item">
                  <LocationOnIcon className="info-icon" />

                  <Box>
                    <Typography className="info-heading">
                      Chennai Office
                    </Typography>

                    <Typography className="info-text">
                      B4, Lumiers Enclave,
                      <br />
                      #5/1092, Giri Nagar Main Road,
                      <br />
                      Ramapuram, Chennai - 600089
                    </Typography>
                  </Box>
                </Box>

                {/* Timing */}
<Box className="info-item">
  <AccessTimeIcon className="info-icon" />

  <Box>
    <Typography className="info-heading">
      Timing
    </Typography>

    <Typography className="info-text">
      Mon – Fri | 9:00 AM – 6:00 PM
    </Typography>
  </Box>
</Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
     
    </Box>
  );
};

export default ContactPage;