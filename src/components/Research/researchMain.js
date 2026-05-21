import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const themeColors = {
  navy: '#0d121b',
  gray: '#4a5568',
  royalBlue: '#0f49bd',
  lightGray: '#f8f9fc',
  borderGray: '#e7ebf3'
};

export default function ResearchMain() {
  const [selectedTopics, setSelectedTopics] = useState({ Finance: true, Legal: true, MarketTrends: true });
  const [selectedYear, setSelectedYear] = useState('2024');

  const reports = [
    { title: 'Liquidity Risk Management in Neo-Banking', author: 'Dr. Alistair Thorne, Chief Economist', date: 'Oct 12, 2024', tag: 'Finance', size: '3.2 MB' },
    { title: 'Cross-Border Compliance in Digital Assets', author: 'Helena Vance, JD', date: 'Oct 05, 2024', tag: 'Legal', size: '1.8 MB' },
    { title: 'Annual FinTech Adoption Survey: Institutional Insights', author: 'Market Research Division', date: 'Sep 28, 2024', tag: 'Market Trends', size: '5.4 MB' },
    { title: 'Quantitative Analysis of Yield Curve Shifts', author: 'Marcus Zheng, CFA', date: 'Sep 15, 2024', tag: 'Finance', size: '2.1 MB' }
  ];

  const handleTopicChange = (event) => {
    setSelectedTopics({ ...selectedTopics, [event.target.name]: event.target.checked });
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 5, borderBottom: `1px solid ${themeColors.borderGray}`, pb: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", color: themeColors.navy, mb: 1 }}>
          Institutional Research
        </Typography>
        <Typography variant="body1" sx={{ color: themeColors.gray }}>
          Expert insights at the intersection of global finance and legal compliance.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Filters Sticky Sidebar */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 100 }}>
            {/* Topic Filter */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1.5, color: themeColors.navy }}>Topic</Typography>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={selectedTopics.Finance} onChange={handleTopicChange} name="Finance" />} label="Finance" />
                <FormControlLabel control={<Checkbox checked={selectedTopics.Legal} onChange={handleTopicChange} name="Legal" />} label="Legal" />
                <FormControlLabel control={<Checkbox checked={selectedTopics.MarketTrends} onChange={handleTopicChange} name="MarketTrends" />} label="Market Trends" />
              </FormGroup>
            </Box>

            {/* Year Filter */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1.5, color: themeColors.navy }}>Year</Typography>
              <RadioGroup value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <FormControlLabel value="2024" control={<Radio />} label="2024" />
                <FormControlLabel value="2023" control={<Radio />} label="2023" />
                <FormControlLabel value="Archive" control={<Radio />} label="Archive" />
              </RadioGroup>
            </Box>

            <Button variant="outlined" fullWidth sx={{ borderColors: themeColors.navy, color: themeColors.navy, fontWeight: 'bold', textTransform: 'none', py: 1 }}>
              Reset Filters
            </Button>
          </Box>
        </Grid>

        {/* Content Lists Grid */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {reports.map((report, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, height: '100%', border: `1px solid ${themeColors.borderGray}`, borderRadius: 3,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    transition: 'border-color 0.2s', '&:hover': { borderColor: themeColors.royalBlue }
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ px: 2, py: 0.5, bgcolor: themeColors.lightGray, borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {report.tag}
                      </Box>
                      <Typography variant="caption" color="textSecondary">{report.date}</Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1.5, color: themeColors.navy, lineHeight: 1.3 }}>
                      {report.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.gray, mb: 4 }}>{report.author}</Typography>
                  </Box>

                  <Box sx={{ pt: 2, borderTop: `1px solid ${themeColors.borderGray}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary">PDF ({report.size})</Typography>
                    <Button size="small" endIcon={<DownloadIcon />} sx={{ color: themeColors.navy, fontWeight: 'bold', textTransform: 'none' }}>
                      Download PDF
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}