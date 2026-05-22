import React from 'react';
import { Box, Typography, Grid, Paper, Button, LinearProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BarChartIcon from '@mui/icons-material/BarChart';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
// import EcoIcon from '@mui/icons-material/Eco';

const themeColors = {
  navy: '#0d121b',
  gray: '#4a5568',
  royalBlue: '#0f49bd',
  lightGray: '#f8f9fc',
  borderGray: '#e7ebf3'
};

export default function TrainingMain() {
  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", color: themeColors.navy, mb: 1 }}>
          Professional Training & Compliance
        </Typography>
        <Typography variant="body1" sx={{ color: themeColors.gray, maxWidth: '800px' }}>
          Enhance your institutional capabilities with our curated legal and financial certification tracks. Track your progress and stay compliant with evolving global regulations.
        </Typography>
      </Box>

      {/* Bento Tracks Configuration Grid */}
      <Grid container spacing={4}>
        {/* Course 1 Feature Element */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ border: `1px solid ${themeColors.borderGray}`, borderRadius: 3, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ flex: 1, bgcolor: '#e2e8f0', minHeight: 200, backgroundImage: 'url("https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Box sx={{ display: 'inline-block', px: 2, py: 0.5, bgcolor: 'rgba(15,73,189,0.1)', color: themeColors.royalBlue, borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold', mb: 2 }}>
                  Regulatory Compliance
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: themeColors.navy, mb: 1.5 }}>Anti-Money Laundering (AML) Advanced</Typography>
                <Typography variant="body2" sx={{ color: themeColors.gray, mb: 3 }}>Master the frameworks for detecting and preventing financial crimes in a digital-first global economy.</Typography>
              </Box>
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="caption">Progress</Typography><Typography variant="caption" sx={{ fontWeight: 'bold' }}>65%</Typography></Box>
                  <LinearProgress variant="determinate" value={65} sx={{ height: 6, borderRadius: 3, bgcolor: themeColors.lightGray, '& .MuiLinearProgress-bar': { bgcolor: themeColors.navy } }} />
                </Box>
                <Button variant="contained" fullWidth endIcon={<ArrowForwardIcon />} sx={{ bgcolor: themeColors.navy, py: 1.2, textTransform: 'none', borderRadius: 2, '&:hover': { bgcolor: themeColors.royalBlue } }}>Continue Course</Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Course 2 Column */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, border: `1px solid ${themeColors.borderGray}`, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: themeColors.navy, mb: 1.5 }}>Cybersecurity Basics</Typography>
              <Typography variant="body2" sx={{ color: themeColors.gray, mb: 3 }}>Essential protocols for safeguarding sensitive client data and legal documentation.</Typography>
            </Box>
            <Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="caption">Progress</Typography><Typography variant="caption" sx={{ fontWeight: 'bold' }}>12%</Typography></Box>
                <LinearProgress variant="determinate" value={12} sx={{ height: 6, borderRadius: 3, bgcolor: themeColors.lightGray, '& .MuiLinearProgress-bar': { bgcolor: themeColors.navy } }} />
              </Box>
              <Button variant="outlined" fullWidth sx={{ color: themeColors.navy, borderColor: themeColors.navy, textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}>Continue</Button>
            </Box>
          </Paper>
        </Grid>

        {/* Small Module Rows */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, border: `1px solid ${themeColors.borderGray}`, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box><Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Corporate Ethics</Typography><Typography variant="body2" color="textSecondary">Navigating complex ethical dilemmas in global institutional finance and law.</Typography></Box>
            <Box sx={{ mt: 3 }}><Button variant="contained" fullWidth sx={{ bgcolor: themeColors.navy, textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}>Start Course</Button></Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, border: `1px solid ${themeColors.borderGray}`, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box><Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>GDPR & Data Privacy</Typography><Typography variant="body2" color="textSecondary">Comprehensive guide to managing EU data subject rights and compliance audits.</Typography></Box>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="caption">Progress</Typography><Typography variant="caption" sx={{ fontWeight: 'bold' }}>90%</Typography></Box>
              <LinearProgress variant="determinate" value={90} sx={{ height: 6, borderRadius: 3, mb: 2 }} />
              <Button variant="outlined" fullWidth sx={{ textTransform: 'none', borderRadius: 2 }}>Continue</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, bgcolor: themeColors.royalBlue, color: 'white', borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box><Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>ESG & Sustainable Finance</Typography><Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Integrating environmental, social, and governance factors into long-term financial modeling.</Typography></Box>
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}><Button variant="contained" sx={{ bgcolor: 'white', color: themeColors.royalBlue, fontWeight: 'bold', textTransform: 'none', px: 4, flexGrow: 1 }}>Enroll Now</Button><BarChartIcon sx={{ opacity: 0.6 }} /></Box>
          </Paper>
        </Grid>

        {/* Footer Banner Module */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 4, border: `1px solid ${themeColors.borderGray}`, borderRadius: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: themeColors.navy, mb: 0.5 }}>Intellectual Property in Digital Lending</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2, maxWidth: '700px' }}>A deep dive into patent law, trademarks, and copyright protections specifically for fintech and institutional digital assets.</Typography>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', opacity: 0.7 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><ScheduleIcon fontSize="small" /><Typography variant="caption">4.5 Hours</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><BarChartIcon fontSize="small" /><Typography variant="caption">Intermediate</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><VerifiedUserIcon fontSize="small" /><Typography variant="caption">Certified</Typography></Box>
              </Box>
            </Box>
            <Button variant="contained" sx={{ bgcolor: themeColors.navy, py: 1.5, px: 5, textTransform: 'none', fontWeight: 'bold', borderRadius: 2, height: 'fit-content', '&:hover': { bgcolor: themeColors.royalBlue } }}>Start Module</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}