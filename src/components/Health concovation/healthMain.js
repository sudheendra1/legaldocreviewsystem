import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Button, Avatar, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, TextField, IconButton 
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';

const themeColors = {
  navy: '#0d121b',
  gray: '#4a5568',
  royalBlue: '#0f49bd',
  lightGray: '#f8f9fc',
  borderGray: '#e7ebf3'
};

export default function HealthMain() {
  const [selectedDay, setSelectedDay] = useState(4);
  const [selectedTime, setSelectedTime] = useState('11:30 AM');

  const timeSlots = ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'];

  const historyData = [
    { date: 'Sep 28, 2024', doctor: 'Dr. Sarah Miller', status: 'Completed', color: 'success' },
    { date: 'Sep 15, 2024', doctor: 'Dr. Julian Vance', status: 'Completed', color: 'success' },
    { date: 'Oct 04, 2024', doctor: 'Dr. Julian Vance', status: 'Scheduled', color: 'primary' },
    { date: 'Aug 30, 2024', doctor: 'Dr. Sarah Miller', status: 'Completed', color: 'success' },
  ];

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: '1400px', mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", color: themeColors.navy, mb: 1 }}>
          Health Consultation
        </Typography>
        <Typography variant="body1" sx={{ color: themeColors.gray, maxWidth: '800px' }}>
          Access professional health guidance tailored for high-performance corporate legal environments. Schedule 1-on-1 sessions with our certified specialists.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Layout - Booking Engine */}
        <Grid item xs={12} lg={7} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${themeColors.borderGray}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: themeColors.navy }}>Book a Session</Typography>
              <Box>
                <IconButton size="small"><ChevronLeftIcon /></IconButton>
                <IconButton size="small"><ChevronRightIcon /></IconButton>
              </Box>
            </Box>

            <Grid container spacing={4}>
              {/* Calendar Grid */}
              <Grid item xs={12} md={7}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>October 2024</Typography>
                <Grid container columns={7} sx={{ textAlign: 'center', mb: 1, opacity: 0.5 }}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <Grid item xs={1} key={i}><Typography variant="caption" sx={{ fontWeight: 'bold' }}>{d}</Typography></Grid>
                  ))}
                </Grid>
                <Grid container columns={7} spacing={1}>
                  <Grid item xs={1}><Box sx={{ py: 1, textCenter: 'center', opacity: 0.2 }}>30</Box></Grid>
                  {[...Array(15).keys()].map((day) => {
                    const dayNum = day + 1;
                    const isSelected = selectedDay === dayNum;
                    return (
                      <Grid item xs={1} key={dayNum}>
                        <Button 
                          fullWidth 
                          onClick={() => setSelectedDay(dayNum)}
                          variant={isSelected ? "contained" : "text"}
                          sx={{ 
                            minWidth: 0, py: 1, borderRadius: 2, fontWeight: isSelected ? 'bold' : 500,
                            bgcolor: isSelected ? themeColors.navy : 'transparent',
                            color: isSelected ? 'white' : themeColors.navy,
                            '&:hover': { bgcolor: isSelected ? themeColors.navy : 'rgba(15,73,189,0.1)' }
                          }}
                        >
                          {dayNum}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>

              {/* Time Slots */}
              <Grid item xs={12} md={5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Available Times</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <Button
                        key={time}
                        fullWidth
                        onClick={() => setSelectedTime(time)}
                        variant="outlined"
                        endIcon={isSelected ? <CheckCircleIcon sx={{ color: isSelected ? 'white' : themeColors.royalBlue }} /> : null}
                        sx={{
                          justifyContent: 'space-between', py: 1.5, px: 3, borderRadius: 2, textTransform: 'none', fontSize: '0.95rem',
                          borderColor: isSelected ? themeColors.royalBlue : themeColors.borderGray,
                          bgcolor: isSelected ? themeColors.royalBlue : 'transparent',
                          color: isSelected ? 'white' : themeColors.navy,
                          '&:hover': { borderColor: themeColors.royalBlue, bgcolor: isSelected ? themeColors.royalBlue : 'transparent' }
                        }}
                      >
                        {time}
                      </Button>
                    );
                  })}
                </Box>
              </Grid>
            </Grid>

            {/* Selection Confirm Strip */}
            <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${themeColors.borderGray}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">Selected Slot</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: themeColors.navy }}>Friday, Oct {selectedDay} • {selectedTime}</Typography>
              </Box>
              <Button variant="contained" disableElevation sx={{ bgcolor: themeColors.royalBlue, px: 4, py: 1.5, textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}>
                Confirm Booking
              </Button>
            </Box>
          </Paper>

          {/* Marketing/Banner Card */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: themeColors.navy, color: 'white', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ relative: 'z-index: 2', maxWidth: '70%' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", mb: 1 }}>Mental Wellness Webinar</Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>Join us this Thursday for an exclusive session on "Ergonomics & Stress Management" tailored for legal professionals.</Typography>
              <Button variant="contained" sx={{ bgcolor: 'white', color: themeColors.navy, textTransform: 'none', fontWeight: 'bold', '&:hover': { bgcolor: '#e5e7eb' } }}>Join waitlist</Button>
            </Box>
            <Box sx={{ position: 'absolute', right: -40, bottom: -40, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(15,73,189,0.15)' }} />
          </Paper>
        </Grid>

        {/* Right Layout - Profiles and History */}
        <Grid item xs={12} lg={5} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Doctor Card */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${themeColors.borderGray}`, bgcolor: '#fdfdfd' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: themeColors.royalBlue, fontSize: '1.5rem', fontWeight: 'bold' }}>JV</Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: themeColors.navy }}>Dr. Julian Vance</Typography>
                <Typography variant="body2" color="textSecondary">Occupational Specialist</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1, bgcolor: themeColors.lightGray, p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary">Rating</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>4.9 / 5.0</Typography>
              </Box>
              <Box sx={{ flex: 1, bgcolor: themeColors.lightGray, p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary">Experience</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>12+ Yrs</Typography>
              </Box>
            </Box>
          </Paper>

          {/* History Table */}
          <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${themeColors.borderGray}`, overflow: 'hidden' }}>
            <Box sx={{ p: 3, px: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${themeColors.borderGray}` }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Consultation History</Typography>
              <Button size="small" startIcon={<DownloadIcon />} sx={{ color: themeColors.navy, fontWeight: 'bold', textTransform: 'none' }}>Export</Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: themeColors.lightGray }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: themeColors.gray }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: themeColors.gray }}>Consultant</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: themeColors.gray }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyData.map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell sx={{ fontWeight: 500, color: themeColors.navy }}>{row.date}</TableCell>
                      <TableCell sx={{ color: themeColors.gray }}>{row.doctor}</TableCell>
                      <TableCell><Chip size="small" label={row.status} color={row.color} sx={{ fontWeight: 'bold', fontSize: '0.75rem' }} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ p: 2, textAlign: 'center', bgcolor: themeColors.lightGray }}>
              <Button size="small" sx={{ color: themeColors.gray, textTransform: 'none' }}>View all history (14)</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}