import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Button, TextField, Select, 
  MenuItem, FormControl, InputAdornment, IconButton
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

const themeColors = {
  navy: '#0d121b',
  gray: '#4a5568',
  royalBlue: '#0f49bd',
  lightGray: '#f8f9fc',
  borderGray: '#e7ebf3'
};

export default function NotationMain() {
  const [formData, setFormData] = useState({
    entityName: '',
    idNumber: '',
    creditType: '',
    amount: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert(`Credit Report Submitted Successfully.\nReference ID: ECR-2024-${Math.floor(Math.random() * 900000 + 100000)}`);
      setIsSubmitting(false);
      setFormData({ entityName: '', idNumber: '', creditType: '', amount: '', notes: '' });
    }, 1500);
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: '1400px', mx: 'auto' }}>
      
      {/* Page Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", color: themeColors.navy, mb: 1 }}>
          Electronic Credit Reporting
        </Typography>
        <Typography variant="body1" sx={{ color: themeColors.gray, maxWidth: '800px' }}>
          Submit new credit notations and financial reporting data to the global registry. Ensure all identification numbers are verified before submission.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        
        {/* Left Column - Progress & Tips */}
        <Grid item xs={12} lg={3} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Progress Tracker (Sticky) */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${themeColors.borderGray}`, position: 'sticky', top: 100 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: themeColors.navy, letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', mb: 4 }}>
              Reporting Progress
            </Typography>
            
            <Box sx={{ position: 'relative' }}>
              {/* Vertical connecting line */}
              <Box sx={{ position: 'absolute', left: '15px', top: 10, bottom: 10, width: '2px', bgcolor: themeColors.borderGray, zIndex: 0 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', zIndex: 1 }}>
                
                {/* Step 1 - Active */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: themeColors.navy, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem', flexShrink: 0 }}>1</Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: themeColors.navy }}>Entity Details</Typography>
                    <Typography variant="caption" sx={{ color: themeColors.gray }}>Legal name & ID</Typography>
                  </Box>
                </Box>

                {/* Step 2 - Pending */}
                <Box sx={{ display: 'flex', gap: 2, opacity: 0.5 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: themeColors.lightGray, color: themeColors.gray, border: `1px solid ${themeColors.borderGray}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem', flexShrink: 0 }}>2</Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: themeColors.gray }}>Financial Data</Typography>
                    <Typography variant="caption" sx={{ color: themeColors.gray }}>Credit type & sum</Typography>
                  </Box>
                </Box>

                {/* Step 3 - Pending */}
                <Box sx={{ display: 'flex', gap: 2, opacity: 0.5 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: themeColors.lightGray, color: themeColors.gray, border: `1px solid ${themeColors.borderGray}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem', flexShrink: 0 }}>3</Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: themeColors.gray }}>Notes & Submission</Typography>
                    <Typography variant="caption" sx={{ color: themeColors.gray }}>Review details</Typography>
                  </Box>
                </Box>

              </Box>
            </Box>
          </Paper>

          {/* Compliance Tip */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#001f3f', color: 'white', border: '1px solid #001f3f' }}>
            <InfoOutlinedIcon sx={{ mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontFamily: "'Playfair Display', serif" }}>Compliance Tip</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Reporting must be completed within 72 hours of the credit event to maintain firm-level accreditation status.
            </Typography>
          </Paper>
        </Grid>

        {/* Right Column - Main Form Area */}
        <Grid item xs={12} lg={9}>
          <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${themeColors.borderGray}`, overflow: 'hidden' }}>
            
            {/* Form Header Banner */}
            <Box sx={{ height: 140, bgcolor: themeColors.navy, position: 'relative', overflow: 'hidden', p: 4, display: 'flex', flexDirection: 'column', justifycontent: 'flex-end' }}>
              {/* Decorative circles */}
              <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', border: '20px solid rgba(255,255,255,0.05)' }} />
              <Box sx={{ position: 'absolute', bottom: -100, left: '10%', width: 300, height: 300, borderRadius: '50%', border: '10px solid rgba(255,255,255,0.05)' }} />
              
              <Box sx={{ position: 'relative', zIndex: 1, mt: 'auto' }}>
                <Typography variant="caption" sx={{ color: '#d4e3ff', letterSpacing: 2, textTransform: 'uppercase', mb: 0.5, display: 'block' }}>New Notation</Typography>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', fontFamily: "'Playfair Display', serif" }}>Notation ECR Form 2024-A</Typography>
              </Box>
            </Box>

            {/* Form Fields */}
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
              <Grid container spacing={4}>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: themeColors.navy, mb: 1 }}>Entity Name</Typography>
                  <TextField 
                    fullWidth
                    name="entityName"
                    value={formData.entityName}
                    onChange={handleChange}
                    placeholder="e.g. Global Logistics Corp"
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: themeColors.lightGray } }}
                  />
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>Full legal name as registered in the jurisdiction.</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: themeColors.navy, mb: 1 }}>Identification Number</Typography>
                  <TextField 
                    fullWidth
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder="Tax ID, EIN or Registration No."
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <FingerprintIcon sx={{ color: themeColors.gray }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: themeColors.lightGray } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: themeColors.navy, mb: 1 }}>Credit Type</Typography>
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { bgcolor: themeColors.lightGray } }}>
                    <Select
                      name="creditType"
                      displayEmpty
                      value={formData.creditType}
                      onChange={handleChange}
                    >
                      <MenuItem value="" disabled>Select Credit Category</MenuItem>
                      <MenuItem value="commercial">Commercial Loan</MenuItem>
                      <MenuItem value="mortgage">Asset-Backed Mortgage</MenuItem>
                      <MenuItem value="revolving">Revolving Credit Facility</MenuItem>
                      <MenuItem value="mezzanine">Mezzanine Financing</MenuItem>
                      <MenuItem value="syndicated">Syndicated Credit</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: themeColors.navy, mb: 1 }}>Reported Amount (USD)</Typography>
                  <TextField 
                    fullWidth
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: themeColors.lightGray } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: themeColors.navy, mb: 1 }}>Additional Notes</Typography>
                  <TextField 
                    fullWidth
                    name="notes"
                    multiline
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Detail any specific financial covenants or deviations from standard reporting protocols..."
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: themeColors.lightGray } }}
                  />
                </Grid>

              </Grid>

              {/* Form Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 5, pt: 3, borderTop: `1px solid ${themeColors.borderGray}`, flexWrap: 'wrap', gap: 2 }}>
                <Button 
                  startIcon={<CancelOutlinedIcon />} 
                  sx={{ color: themeColors.gray, textTransform: 'none', fontWeight: 'bold', '&:hover': { color: themeColors.navy } }}
                  onClick={() => setFormData({ entityName: '', idNumber: '', creditType: '', amount: '', notes: '' })}
                >
                  Discard Draft
                </Button>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" sx={{ borderColor: themeColors.borderGray, color: themeColors.navy, textTransform: 'none', fontWeight: 'bold', px: 3 }}>
                    Save as Progress
                  </Button>
                  <Button 
                    type="submit"
                    variant="contained" 
                    disabled={isSubmitting}
                    endIcon={<ArrowForwardIcon />} 
                    sx={{ bgcolor: themeColors.navy, color: 'white', textTransform: 'none', fontWeight: 'bold', px: 4, '&:hover': { bgcolor: themeColors.royalBlue } }}
                  >
                    {isSubmitting ? 'Processing...' : 'Submit Report'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Post-Submission Info Cards */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, display: 'flex', gap: 2, bgcolor: themeColors.lightGray, border: `1px solid ${themeColors.borderGray}`, borderRadius: 3 }}>
                <LockOutlinedIcon sx={{ color: themeColors.navy }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: themeColors.navy }}>Data Encryption</Typography>
                  <Typography variant="caption" sx={{ color: themeColors.gray }}>All ECR data is encrypted using AES-256 standards before transmission to the central ledger.</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, display: 'flex', gap: 2, bgcolor: themeColors.lightGray, border: `1px solid ${themeColors.borderGray}`, borderRadius: 3 }}>
                <VerifiedUserOutlinedIcon sx={{ color: themeColors.navy }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: themeColors.navy }}>Validation Engine</Typography>
                  <Typography variant="caption" sx={{ color: themeColors.gray }}>Submissions are cross-referenced with global corporate registries in real-time.</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

        </Grid>
      </Grid>
    </Box>
  );
}