import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  AppBar, 
  Toolbar, 
  Link,
  IconButton
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MenuIcon from '@mui/icons-material/Menu';
import { useHistory } from 'react-router-dom';

const LandingPage = () => {
  const history = useHistory();

  const themeColors = {
    navy: '#0d121b',
    gray: '#4a5568',
    royalBlue: '#0f49bd',
    lightGray: '#f8f9fc',
    borderGray: '#e7ebf3'
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    history.push('/login');
  };

  const services = [
    {
      icon: <AccountBalanceIcon fontSize="large" />,
      title: 'Financial Planning',
      description: 'Comprehensive financial planning for individuals and families.'
    },
    {
      icon: <AccountBalanceWalletIcon fontSize="large" />,
      title: 'Estate Planning',
      description: 'Expert estate planning services to secure your legacy.'
    },
    {
      icon: <BusinessCenterIcon fontSize="large" />,
      title: 'Business Law',
      description: 'Legal support for businesses of all sizes.'
    },
    {
      icon: <MonetizationOnIcon fontSize="large" />,
      title: 'Tax Advisory',
      description: 'Strategic tax advisory services to optimize your financial position.'
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', bgcolor: themeColors.lightGray, color: themeColors.navy, overflowX: 'hidden' }}>
      
      {/* Header - Full Width */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(248, 249, 252, 0.9)', backdropFilter: 'blur(4px)', borderBottom: `1px solid ${themeColors.borderGray}` }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 8, xl: 12 } }}>
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <svg height="32" width="32" style={{ color: themeColors.royalBlue }} fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <Typography variant="h6" sx={{ color: themeColors.navy, fontWeight: 'bold', fontFamily: "'Playfair Display', serif" }}>
                JuraTech Solutions
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 6 }}>
              <Link href="#services" underline="none" sx={{ color: themeColors.gray, fontWeight: 500, fontSize: '1.1rem', '&:hover': { color: themeColors.royalBlue } }}>Services</Link>
              <Link href="#research" underline="none" sx={{ color: themeColors.gray, fontWeight: 500, fontSize: '1.1rem', '&:hover': { color: themeColors.royalBlue } }}>Research</Link>
              <Link href="#contact" underline="none" sx={{ color: themeColors.gray, fontWeight: 500, fontSize: '1.1rem', '&:hover': { color: themeColors.royalBlue } }}>Contact</Link>
              <Button 
                onClick={handleLoginClick}
                sx={{ ml: 2, bgcolor: themeColors.borderGray, color: themeColors.navy, fontWeight: 'bold', textTransform: 'none', px: 4, py: 1, fontSize: '1.1rem', '&:hover': { bgcolor: '#d1d5db' } }}
              >
                Sign In
              </Button>
            </Box>

            <IconButton sx={{ display: { xs: 'flex', md: 'none' }, color: themeColors.navy }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section - Full Width */}
      <Box sx={{ position: 'relative', minHeight: { xs: '60vh', md: '75vh' }, display: 'flex', alignItems: 'center', color: 'white', py: 10 }}>
        <Box sx={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: 'linear-gradient(rgba(13, 18, 27, 0.5) 0%, rgba(13, 18, 27, 0.8) 100%), url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2560&q=80")',
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 
        }} />
        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 8, xl: 12 } }}>
          <Box sx={{ width: '100%', textAlign: 'left' }}>
            <Typography variant="h1" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", mb: 3, fontSize: { xs: '3rem', md: '4.5rem', lg: '6rem' } }}>
              Empowering Your Financial <br/>and Legal Future
            </Typography>
            <Typography variant="h4" sx={{ color: '#e5e7eb', mb: 6, fontWeight: 400, maxWidth: '60%', lineHeight: 1.6 }}>
              We provide comprehensive financial and legal services tailored to your unique needs. Our team of experts is dedicated to helping you achieve your goals with confidence and clarity.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Button href="#services" variant="contained" sx={{ bgcolor: themeColors.royalBlue, px: 6, py: 2.5, fontWeight: 'bold', textTransform: 'none', fontSize: '1.25rem', borderRadius: 2 }}>
                Explore Services
              </Button>
              <Button href="#contact" variant="contained" sx={{ bgcolor: themeColors.lightGray, color: themeColors.navy, px: 6, py: 2.5, fontWeight: 'bold', textTransform: 'none', fontSize: '1.25rem', borderRadius: 2, '&:hover': { bgcolor: 'white' } }}>
                Contact Us
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* About Section - Full Width */}
      <Box id="about" sx={{ py: { xs: 10, sm: 12, lg: 16 } }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 8, xl: 12 } }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", mb: 4 }}>
              About Apex Financial & Legal
            </Typography>
            <Typography variant="h5" sx={{ color: themeColors.gray, fontWeight: 400, lineHeight: 1.8 }}>
              Apex Financial & Legal is a leading provider of integrated financial and legal services. With a commitment to excellence and client satisfaction, we offer a wide range of solutions to individuals, families, and businesses. Our experienced professionals combine their expertise to deliver strategic guidance and support, ensuring your financial and legal well-being.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Services Section - Full Width Grid */}
      <Box id="services" sx={{ bgcolor: 'white', py: { xs: 10, sm: 12, lg: 16 } }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 8, xl: 12 } }}>
          <Box sx={{ mb: 10 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", mb: 2 }}>
              Our Services
            </Typography>
            <Typography variant="h5" sx={{ color: themeColors.gray, fontWeight: 400 }}>
              Tailored solutions to meet your specific financial and legal needs.
            </Typography>
          </Box>
          <Grid container spacing={6}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper elevation={0} sx={{ p: 4, height: '100%', border: `1px solid ${themeColors.borderGray}`, borderRadius: 4, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 4 } }}>
                  <Box sx={{ 
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
                    width: 80, height: 80, borderRadius: '50%', bgcolor: themeColors.royalBlue, color: 'white', mb: 4, boxShadow: 3 
                  }}>
                    {service.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>{service.title}</Typography>
                  <Typography sx={{ color: themeColors.gray, fontSize: '1.2rem', lineHeight: 1.6 }}>{service.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Research Section - Full Width Split */}
      <Box id="research" sx={{ py: { xs: 10, sm: 12, lg: 16 } }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 8, xl: 12 } }}>
          <Box sx={{ mb: 10 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", mb: 2 }}>
              Research Highlights
            </Typography>
            <Typography variant="h5" sx={{ color: themeColors.gray, fontWeight: 400 }}>
              In-depth analysis to guide your decisions.
            </Typography>
          </Box>
          <Paper elevation={4} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden', borderRadius: 4 }}>
            <Box sx={{ p: { xs: 4, md: 8, lg: 12 }, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", mb: 4 }}>
                Market Trends and Investment Strategies
              </Typography>
              <Typography sx={{ color: themeColors.gray, fontSize: '1.5rem', mb: 6, lineHeight: 1.7 }}>
                Stay informed with our latest research on market trends and investment strategies. Our analysis provides valuable insights to help you make informed decisions.
              </Typography>
              <Box>
                <Link href="#" underline="hover" sx={{ color: themeColors.royalBlue, fontWeight: 'bold', fontSize: '1.25rem', display: 'inline-flex', alignItems: 'center' }}>
                  Read More →
                </Link>
              </Box>
            </Box>
            <Box sx={{ 
              flex: 1, minHeight: { xs: 400, md: 'auto' }, 
              backgroundImage: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80")', 
              backgroundSize: 'cover', backgroundPosition: 'center' 
            }} />
          </Paper>
        </Container>
      </Box>

      {/* Contact Section - Full Width Form */}
      <Box id="contact" sx={{ bgcolor: 'white', py: { xs: 10, sm: 12, lg: 16 } }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 8, xl: 12 } }}>
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", mb: 3 }}>
                Get in Touch
              </Typography>
              <Typography variant="h5" sx={{ color: themeColors.gray, fontWeight: 400 }}>
                We're here to help. Reach out to us for a consultation.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box component="form" sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <TextField fullWidth placeholder="Your Name" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { bgcolor: themeColors.borderGray, fontSize: '1.2rem' } }} />
                <TextField fullWidth placeholder="Your Email" type="email" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { bgcolor: themeColors.borderGray, fontSize: '1.2rem' } }} />
                <TextField fullWidth placeholder="Your Message" multiline rows={6} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { bgcolor: themeColors.borderGray, fontSize: '1.2rem' } }} />
                <Button variant="contained" size="large" sx={{ bgcolor: themeColors.royalBlue, py: 2.5, fontWeight: 'bold', textTransform: 'none', fontSize: '1.25rem' }}>
                  Send Message
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer - Full Width Grid */}
      <Box component="footer" sx={{ bgcolor: themeColors.navy, color: 'white', pt: 12, pb: 6, borderTop: `1px solid ${themeColors.borderGray}` }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 8, xl: 12 } }}>
          <Grid container spacing={8} sx={{ mb: 10 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", mb: 3 }}>
                Apex Financial & Legal
              </Typography>
              <Typography sx={{ color: '#9ca3af', fontSize: '1.25rem', maxWidth: '600px' }}>
                Your trusted partner in financial and legal excellence.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={4}>
                <Grid item xs={6} sm={4}>
                  <Typography sx={{ fontWeight: 'bold', color: '#d1d5db', textTransform: 'uppercase', mb: 3, letterSpacing: 1 }}>Navigation</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Link href="#services" sx={{ color: '#9ca3af', textDecoration: 'none', fontSize: '1.1rem', '&:hover': { color: 'white' } }}>Services</Link>
                    <Link href="#research" sx={{ color: '#9ca3af', textDecoration: 'none', fontSize: '1.1rem', '&:hover': { color: 'white' } }}>Research</Link>
                    <Link href="#contact" sx={{ color: '#9ca3af', textDecoration: 'none', fontSize: '1.1rem', '&:hover': { color: 'white' } }}>Contact</Link>
                    <Link href="#" onClick={handleLoginClick} sx={{ color: '#9ca3af', textDecoration: 'none', fontSize: '1.1rem', '&:hover': { color: 'white' } }}>Sign In</Link>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography sx={{ fontWeight: 'bold', color: '#d1d5db', textTransform: 'uppercase', mb: 3, letterSpacing: 1 }}>Legal</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', fontSize: '1.1rem', '&:hover': { color: 'white' } }}>Privacy Policy</Link>
                    <Link href="#" sx={{ color: '#9ca3af', textDecoration: 'none', fontSize: '1.1rem', '&:hover': { color: 'white' } }}>Terms of Service</Link>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                   <Typography sx={{ fontWeight: 'bold', color: '#d1d5db', textTransform: 'uppercase', mb: 3, letterSpacing: 1 }}>Connect</Typography>
                   <Typography sx={{ color: '#9ca3af', fontSize: '1.1rem' }}>LinkedIn | Twitter</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid #374151', pt: 6, textAlign: 'center' }}>
            <Typography sx={{ color: '#9ca3af', fontSize: '1.1rem' }}>
              © {new Date().getFullYear()} Apex Financial & Legal. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default LandingPage;