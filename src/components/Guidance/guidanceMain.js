import React from 'react';
import { Box, Typography, Grid, Paper, Button, Card, CardContent, Link, Avatar } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PaymentsIcon from '@mui/icons-material/Payments';

const themeColors = {
  navy: '#0d121b',
  gray: '#4a5568',
  royalBlue: '#0f49bd',
  lightGray: '#f8f9fc',
  borderGray: '#e7ebf3'
};

export default function GuidanceMain() {
  const advisors = [
    { name: 'Arthur Sterling', role: 'Senior Partner, Corporate Law', exp: 'M&A, Multi-national structuring, and Board Governance.', initial: 'AS' },
    { name: 'Dr. Elena Vance', role: 'Head of IP Strategy', exp: 'Patent portfolios, Bio-tech regulation, and Trade Secrets.', initial: 'EV' },
    { name: 'Marcus Chen', role: 'Venture Capital Consultant', exp: 'Series A/B fundraising, Valuation, and Exit Planning.', initial: 'MC' }
  ];

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", color: themeColors.navy, mb: 1 }}>
          Guidance to Startups
        </Typography>
        <Typography variant="body1" sx={{ color: themeColors.gray, maxWidth: '800px' }}>
          Strategic legal and financial frameworks tailored for high-growth ventures. Navigate complexity with institutional-grade expertise.
        </Typography>
      </Box>

      {/* Bento Grid */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Resource Library</Typography>
          <Link href="#" underline="hover" sx={{ color: themeColors.royalBlue, fontWeight: 'bold' }}>View All Resources</Link>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 5, height: '100%', border: `1px solid ${themeColors.borderGray}`, display: 'flex', flexDirection: 'column', justifycontent: 'space-between', borderRadius: 4 }}>
              <Box>
                <Box sx={{ width: 48, height: 48, bgcolor: 'rgba(15,73,189,0.1)', color: themeColors.royalBlue, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, mb: 3 }}>
                  <GavelIcon />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Legal Formation</Typography>
                <Typography sx={{ color: themeColors.gray, maxW: '500px', lineHeight: 1.6 }}>
                  Comprehensive guidance on entity selection, jurisdiction compliance, and foundational governance structures for new enterprises.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
                <Chip label="Compliance" size="small" />
                <Chip label="Governance" size="small" />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 5, height: '100%', border: `1px solid ${themeColors.borderGray}`, borderRadius: 4 }}>
              <Box sx={{ width: 48, height: 48, bgcolor: 'rgba(15,73,189,0.1)', color: themeColors.royalBlue, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, mb: 3 }}>
                <VerifiedUserIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>IP Protection</Typography>
              <Typography sx={{ color: themeColors.gray, lineHeight: 1.6 }}>Securing your intellectual assets through rigorous patent and trademark strategies.</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 5, height: '100%', border: `1px solid ${themeColors.borderGray}`, borderRadius: 4 }}>
              <Box sx={{ width: 48, height: 48, bgcolor: 'rgba(15,73,189,0.1)', color: themeColors.royalBlue, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, mb: 3 }}>
                <PaymentsIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Funding Strategies</Typography>
              <Typography sx={{ color: themeColors.gray, lineHeight: 1.6 }}>From Seed to Series B: Mastering the landscape of institutional capital and equity distribution.</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 5, bgcolor: themeColors.navy, color: 'white', borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", mb: 2 }}>Advanced Startup Audit</Typography>
              <Typography sx={{ color: '#9ca3af', mb: 4, maxWidth: '500px' }}>Access our premium diagnostic tool to evaluate your startup's legal health and investor readiness.</Typography>
              <Box><Button variant="contained" sx={{ bgcolor: 'white', color: themeColors.navy, fontWeight: 'bold', textTransform: 'none', px: 4, py: 1.2, borderRadius: 2, '&:hover': { bgcolor: '#e5e7eb' } }}>Start Assessment</Button></Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Mentorship Section */}
      <Box>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", mb: 1 }}>Mentorship Booking</Typography>
          <Typography variant="body1" color="textSecondary">Connect directly with industry veterans for specialized guidance.</Typography>
        </Box>

        <Grid container spacing={4}>
          {advisors.map((advisor, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card elevation={0} sx={{ height: '100%', border: `1px solid ${themeColors.borderGray}`, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: 140, bgcolor: themeColors.lightGray, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Avatar sx={{ width: 72, height: 72, bgcolor: themeColors.royalBlue, fontSize: '1.5rem', fontWeight: 'bold' }}>{advisor.initial}</Avatar>
                  {index === 0 && <Chip label="Available Today" size="small" color="success" sx={{ position: 'absolute', bottom: 12, left: 12, fontWeight: 'bold' }} />}
                </Box>
                <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{advisor.name}</Typography>
                    <Typography variant="subtitle2" sx={{ color: themeColors.royalBlue, fontWeight: 600, mb: 2 }}>{advisor.role}</Typography>
                    <Typography variant="body2" sx={{ color: themeColors.gray, lineHeight: 1.6 }}>
                      <strong>Expertise:</strong> {advisor.exp}
                    </Typography>
                  </Box>
                  <Button variant="contained" fullWidth sx={{ bgcolor: themeColors.navy, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 'bold', '&:hover': { bgcolor: themeColors.royalBlue } }}>
                    Book Session
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

// Minimal wrapper helper
function Chip({ label, size, color }) {
  return <Box sx={{ px: 2, py: 0.5, bgcolor: color === 'success' ? '#dcfce7' : themeColors.lightGray, color: color === 'success' ? '#15803d' : themeColors.gray, borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>{label}</Box>;
}