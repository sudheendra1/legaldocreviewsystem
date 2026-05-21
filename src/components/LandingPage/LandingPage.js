import React from 'react';
import {
  Container,
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Link,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PanToolIcon from '@mui/icons-material/PanTool';
import DescriptionIcon from '@mui/icons-material/Description';
import EcoIcon from '@mui/icons-material/Eco';
import './LandingPage.css';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#FFFFFF',
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
  padding: '0 24px',
});

const Logo = styled(Typography)({
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1D5A8D',
  marginRight: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&::before': {
    content: '"*"',
    fontSize: '28px',
  },
});

const NavLink = styled(Link)({
  color: '#333333',
  textDecoration: 'none',
  marginRight: '32px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  '&:hover': {
    color: '#1D5A8D',
  },
});

const SignInButton = styled(Button)({
  backgroundColor: '#1D5A8D',
  color: '#FFFFFF',
  padding: '10px 20px',
  borderRadius: '4px',
  textTransform: 'none',
  fontWeight: '600',
  fontSize: '14px',
  '&:hover': {
    backgroundColor: '#1A4A6F',
  },
});

const HeroSection = styled(Box)({
  backgroundColor: '#F5F5F5',
  padding: '80px 0',
  marginTop: '80px',
});

const HeroTitle = styled(Typography)({
  fontSize: '48px',
  fontWeight: 'bold',
  color: '#000000',
  lineHeight: '1.3',
  marginBottom: '24px',
});

const HeroText = styled(Typography)({
  fontSize: '16px',
  color: '#666666',
  lineHeight: '1.6',
  marginBottom: '32px',
  maxWidth: '500px',
});

const DiscoverButton = styled(Button)({
  backgroundColor: '#1D5A8D',
  color: '#FFFFFF',
  padding: '14px 32px',
  borderRadius: '4px',
  textTransform: 'none',
  fontWeight: '600',
  fontSize: '16px',
  '&:hover': {
    backgroundColor: '#1A4A6F',
  },
});

const HeroImage = styled(Box)({
  backgroundColor: '#E8DCC8',
  borderRadius: '8px',
  height: '400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '120px',
});

const ServicesSection = styled(Box)({
  padding: '120px 0',
  backgroundColor: '#FFFFFF',
});

const SectionTitle = styled(Typography)({
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#000000',
  textAlign: 'center',
  marginBottom: '16px',
});

const SectionSubtitle = styled(Typography)({
  fontSize: '16px',
  color: '#666666',
  textAlign: 'center',
  marginBottom: '64px',
});

const ServiceCard = styled(Card)({
  border: 'none',
  boxShadow: 'none',
  backgroundColor: 'transparent',
  textAlign: 'center',
  height: '100%',
  '& .service-icon': {
    fontSize: '48px',
    color: '#1D5A8D',
    marginBottom: '16px',
  },
});

const ServiceTitle = styled(Typography)({
  fontSize: '18px',
  fontWeight: '600',
  color: '#000000',
  marginBottom: '12px',
});

const ServiceDescription = styled(Typography)({
  fontSize: '14px',
  color: '#666666',
  lineHeight: '1.6',
});

const FooterSection = styled(Box)({
  backgroundColor: '#FFFFFF',
  borderTop: '1px solid #EEEEEE',
  padding: '48px 0',
});

const FooterContent = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const FooterLinks = styled(Box)({
  display: 'flex',
  gap: '32px',
});

const FooterLink = styled(Link)({
  color: '#333333',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  '&:hover': {
    color: '#1D5A8D',
  },
});

const SocialIcons = styled(Box)({
  display: 'flex',
  gap: '16px',
});

const SocialIconButton = styled(IconButton)({
  color: '#1D5A8D',
  '&:hover': {
    backgroundColor: '#F5F5F5',
  },
});

const services = [
  {
    icon: BarChartIcon,
    title: 'Financial Advisory',
    description: 'Expert guidance on investment strategies, wealth management, and capital allocation to optimize your financial performance.',
  },
  {
    icon: SecurityIcon,
    title: 'Regulatory Compliance',
    description: 'Navigate complex regulatory landscapes with ease, ensuring adherence to all industry standards and legal requirements.',
  },
  {
    icon: LightbulbIcon,
    title: 'Digital Transformation',
    description: 'Modernize your operations with cutting-edge digital solutions, enhancing efficiency and fostering innovation.',
  },
  {
    icon: PanToolIcon,
    title: 'Risk Management',
    description: 'Identify, assess, and mitigate potential risks to protect your assets and secure your business continuity.',
  },
  {
    icon: DescriptionIcon,
    title: 'Strategic Consulting',
    description: 'Develop robust business strategies tailored to your market, driving growth and competitive advantage.',
  },
  {
    icon: EcoIcon,
    title: 'Sustainability Consulting',
    description: 'Integrate sustainable practices into your business model, enhancing brand reputation and long-term value.',
  },
];

export default function LandingPage() {
  return (
    <Box className="landing-page">
      {/* Navigation Bar */}
      <StyledAppBar position="fixed">
        <Toolbar disableGutters>
          <Logo variant="h6">CorporateNexus</Logo>
          <NavLink>Research</NavLink>
          <NavLink>Contact Us</NavLink>
          <SignInButton variant="contained">Sign In</SignInButton>
        </Toolbar>
      </StyledAppBar>

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <HeroTitle>
                Empowering Corporate Excellence Through Integrated Solutions
              </HeroTitle>
              <HeroText>
                Corporate Nexus is your trusted partner for comprehensive corporate
                management, financial advisory, and strategic insights. We empower
                businesses to navigate complexities, seize opportunities, and achieve
                sustainable growth.
              </HeroText>
              <DiscoverButton variant="contained">
                Discover Your Potential
              </DiscoverButton>
            </Grid>
            <Grid item xs={12} md={6}>
              <HeroImage>
                👋💰
              </HeroImage>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Services Section */}
      <ServicesSection>
        <Container maxWidth="lg">
          <SectionTitle>Our Core Services</SectionTitle>
          <SectionSubtitle>
            At Corporate Nexus, we offer a comprehensive suite of services designed to empower
            businesses and drive sustainable growth.
          </SectionSubtitle>
          <Grid container spacing={4}>
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ServiceCard>
                    <CardContent>
                      <div className="service-icon">
                        <IconComponent />
                      </div>
                      <ServiceTitle>{service.title}</ServiceTitle>
                      <ServiceDescription>{service.description}</ServiceDescription>
                    </CardContent>
                  </ServiceCard>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </ServicesSection>

      {/* Footer */}
      <FooterSection>
        <Container maxWidth="lg">
          <FooterContent>
            <FooterLinks>
              <FooterLink>Company</FooterLink>
              <FooterLink>Resources</FooterLink>
              <FooterLink>Legal</FooterLink>
            </FooterLinks>
            <SocialIcons>
              <SocialIconButton size="small">
                <LinkedInIcon />
              </SocialIconButton>
              <SocialIconButton size="small">
                <TwitterIcon />
              </SocialIconButton>
              <SocialIconButton size="small">
                <FacebookIcon />
              </SocialIconButton>
            </SocialIcons>
          </FooterContent>
        </Container>
      </FooterSection>
    </Box>
  );
}
