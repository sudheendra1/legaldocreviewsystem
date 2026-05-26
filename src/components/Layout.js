import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  Box, Typography, AppBar, Toolbar, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Avatar, Chip, Divider, Skeleton, IconButton, useTheme, useMediaQuery
} from "@mui/material";

// Icons
import { UploadIcon, FileTextIcon, LogOutIcon, UsersIcon, HomeIcon, CheckSquareIcon } from "lucide-react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

const drawerWidth = 260;

const themeColors = {
  navy: '#0d121b',
  gray: '#4a5568',
  royalBlue: '#0f49bd',
  lightGray: '#f8f9fc',
  borderGray: '#e7ebf3'
};

export default function Layout({ children }) {
  const { currentUser, role: contextRole, loading } = useAuth();
  // const [role, setRole] = useState(null);
  // const [roleLoading, setRoleLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const history = useHistory();
  const location = useLocation(); // To track current URL
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const role = contextRole ? contextRole.toLowerCase().replace("reviewer", "review") : null;

  // useEffect(() => {
  //   const fetchRole = async () => {
  //     if (!currentUser) {
  //       setRole(null);
  //       setRoleLoading(false);
  //       return;
  //     }
  //     try {
  //       const docRef = doc(db, "users", currentUser.uid);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         setRole(docSnap.data().role || null);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching role:", error);
  //     } finally {
  //       setRoleLoading(false);
  //     }
  //   };
  //   if (!loading) fetchRole();
  // }, [currentUser, loading]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.push("/landing");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const getRoleColor = () => {
    switch (role) {
      case "admin": return "error";
      case "review": return "warning";
      case "user": return "success";
      default: return "default";
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case "admin": return "Administrator";
      case "review": return "Reviewer";
      case "user": return "User";
      default: return "Unknown Role";
    }
  };

  // if (loading || roleLoading) return <LoadingSkeleton />;
   if (loading) return <LoadingSkeleton />;
  if (!currentUser) { history.push("/landing"); return null; }

  // Sidebar Link Helper - Automatically highlights active route
  const SidebarLink = ({ to, icon, text }) => {
    const isActive = location.pathname === to;
    return (
      <ListItem button component={Link} to={to} onClick={() => isMobile && setMobileOpen(false)} sx={{ 
        borderRadius: 2, mb: 0.5, 
        bgcolor: isActive ? 'rgba(15,73,189,0.1)' : 'transparent',
        borderRight: isActive ? `4px solid ${themeColors.royalBlue}` : '4px solid transparent',
        '&:hover': { bgcolor: isActive ? 'rgba(15,73,189,0.15)' : 'rgba(255,255,255,0.05)' } 
      }}>
        <ListItemIcon sx={{ color: isActive ? themeColors.royalBlue : themeColors.gray, minWidth: 40 }}>{icon}</ListItemIcon>
        <ListItemText primary={text} primaryTypographyProps={{ color: isActive ? themeColors.royalBlue : '#e2e8f0', fontSize: '0.9rem', fontWeight: isActive ? 'bold' : 'normal' }} />
      </ListItem>
    );
  };

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: themeColors.navy, color: 'white', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 3, pt: 4, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: themeColors.royalBlue, mb: 1 }}>
          {currentUser?.email?.charAt(0).toUpperCase() || "U"}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif" }}>
          {currentUser?.name || currentUser?.email?.split("@")[0]}
        </Typography>
        <Chip label={getRoleLabel()} color={getRoleColor()} size="small" sx={{ mt: 1, fontWeight: 'bold' }} />
      </Box>
      
      <List sx={{ px: 2, flexGrow: 1, mt: 2 }}>
        <SidebarLink to="/dashboard" icon={<HomeIcon size={20} />} text="Dashboard" />

        {role === "user" && (
          <>
            <SidebarLink to="/upload" icon={<UploadIcon size={20} />} text="Vetting of loan documents" />
            <SidebarLink to="/seeUploads" icon={<FileTextIcon size={20} />} text="My Uploads" />
            <SidebarLink to="/litigation" icon={<FileTextIcon size={20} />} text="Litigation Monitoring" />
            <SidebarLink to="/training" icon={<FileTextIcon size={20} />} text="Training" />
            <SidebarLink to="/health" icon={<FileTextIcon size={20} />} text="Health consultation" />
            <SidebarLink to="/guidance" icon={<FileTextIcon size={20} />} text="Guidance to startups" />
            <SidebarLink to="/research" icon={<FileTextIcon size={20} />} text="Research" />
            <SidebarLink to="/notation" icon={<FileTextIcon size={20} />} text="Notation ECR" />
          </>
        )}

        {role === "review" && (
          <>
            <SidebarLink to="/review" icon={<CheckSquareIcon size={20} />} text="Review Documents" />
            <SidebarLink to="/willFullDefaulter" icon={<FileTextIcon size={20} />} text="WillFull Defaulter" />
          </>
        )}

        {role === "admin" && (
          <>
            <SidebarLink to="/adminDocs" icon={<FileTextIcon size={20} />} text="Vetting of loan documents" />
            <SidebarLink to="/litigation" icon={<FileTextIcon size={20} />} text="Litigation Monitoring" />
            <SidebarLink to="/training" icon={<FileTextIcon size={20} />} text="Training" />
            <SidebarLink to="/willFullDefaulterDashboard" icon={<FileTextIcon size={20} />} text="WillFull Defaulter" />
            <SidebarLink to="/health" icon={<FileTextIcon size={20} />} text="Health consultation" />
            <SidebarLink to="/guidance" icon={<FileTextIcon size={20} />} text="Guidance to startups" />
            <SidebarLink to="/research" icon={<FileTextIcon size={20} />} text="Research" />
            <SidebarLink to="/notation" icon={<FileTextIcon size={20} />} text="Notation ECR" />
            <SidebarLink to="/reviewers" icon={<UsersIcon size={20} />} text="Manage Employees" />
            <SidebarLink to="/createUser" icon={<PersonAddIcon size={20} />} text="Create User" />
          </>
        )}
      </List>
      
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <List disablePadding>
          <ListItem button onClick={handleLogout} sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}>
            <ListItemIcon sx={{ minWidth: 40 }}><LogOutIcon size={20} color="#ef4444" /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ color: "#ef4444", fontWeight: 600 }} />
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: '100vh', bgcolor: themeColors.lightGray }}>
      <AppBar position="fixed" elevation={0} sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` }, bgcolor: 'white', borderBottom: `1px solid ${themeColors.borderGray}`, color: themeColors.navy }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: "none" } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", display: { xs: 'none', sm: 'block' } }}>
              JuraTech Solutions
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <IconButton sx={{ color: themeColors.gray }}>
                <NotificationsIcon />
              </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: 'none' } }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* THIS IS WHERE YOUR PAGE CONTENT INJECTS */}
      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth}px)` }, mt: "64px" }}>
        {children}
      </Box>

    </Box>
  );
}

function LoadingSkeleton() {
  return (
    <Box sx={{ display: "flex", minHeight: '100vh', bgcolor: themeColors.lightGray }}>
      <Box sx={{ width: drawerWidth, flexShrink: 0, display: { xs: "none", md: "block" }, bgcolor: themeColors.navy }}>
        <Box sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Skeleton variant="circular" width={64} height={64} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Skeleton variant="text" height={30} width="60%" sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
        </Box>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: "64px" }}>
        <Skeleton variant="text" height={60} width="40%" />
        <Skeleton variant="text" height={30} width="60%" sx={{ mb: 4 }} />
      </Box>
    </Box>
  )
}