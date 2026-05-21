// "use client"

// import { useState, useEffect } from "react"
// import { Link, Redirect,useHistory} from "react-router-dom"
// import { useAuth } from "../contexts/AuthContext"
// import { doc, getDoc } from "firebase/firestore"
// import { signOut } from "firebase/auth"
// import { auth, db } from "../firebase/config"
// import {
//   Box,
//   Typography,
//   Button,
//   AppBar,
//   Toolbar,
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Avatar,
//   Card,
//   CardContent,
//   CardActions,
//   Grid,
//   Chip,
//   Divider,
//   Skeleton,
//   IconButton,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material"
// import { UploadIcon, FileTextIcon, LogOutIcon, MenuIcon, UsersIcon, HomeIcon, CheckSquareIcon } from "lucide-react"
// import PersonAddIcon from "@mui/icons-material/PersonAdd"
// import ReviewDocumentsList from "./Loan vetting/ReviewDocumentsList"

// const drawerWidth = 240

// function Dashboard() {
//   const { currentUser, loading } = useAuth()
//   const [role, setRole] = useState(null)
//   const [roleLoading, setRoleLoading] = useState(true)
//   const [mobileOpen, setMobileOpen] = useState(false)
//   const history = useHistory()
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"))

//   useEffect(() => {
//     const fetchRole = async () => {
//       if (!currentUser) {
//         setRole(null)
//         setRoleLoading(false)
//         return
//       }

//       if (currentUser) {
//         try {
//           const docRef = doc(db, "users", currentUser.uid)
//           const docSnap = await getDoc(docRef)
//           if (docSnap.exists()) {
//             const userData = docSnap.data()
//             setRole(userData.role || null)
//           }
//         } catch (error) {
//           console.error("Error fetching role:", error)
//         } finally {
//           setRoleLoading(false)
//         }
//       }
//     }
//     if (!loading) {
//       fetchRole()
//     }
//   }, [currentUser, loading])

//   const handleLogout = async () => {
//     try {
//       await signOut(auth)
//       history.push("/login")
//     } catch (error) {
//       console.error("Error signing out:", error)
//     }
//   }

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen)
//   }

//   if (loading || roleLoading) {
//     return <LoadingSkeleton />
//   }

//   if (!loading && !currentUser) {
//     history.push("/landing")
//     return null
//   }

//   const getRoleColor = () => {
//     switch (role) {
//       case "admin":
//         return "error"
//       case "review":
//         return "warning"
//       case "user":
//         return "success"
//       default:
//         return "default"
//     }
//   }

//   const getRoleLabel = () => {
//     switch (role) {
//       case "admin":
//         return "Administrator"
//       case "review":
//         return "Reviewer"
//       case "user":
//         return "User"
//       default:
//         return "Unknown Role"
//     }
//   }

//   const drawer = (
//     <Box sx={{ overflow: "auto" }}>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           p: 2,
//         }}
//       >
//         <Avatar
//           sx={{
//             width: 64,
//             height: 64,
//             bgcolor: theme.palette.primary.main,
//             mb: 1,
//           }}
//         >
//           {currentUser?.email?.charAt(0).toUpperCase() || "U"}
//         </Avatar>
//         <Typography variant="subtitle1" fontWeight="bold">
//           {currentUser?.email?.split("@")[0]}
//         </Typography>
//         <Chip label={getRoleLabel()} color={getRoleColor()} size="small" sx={{ mt: 1 }} />
//       </Box>
//       <Divider />
//       <List>
//         <ListItem button component={Link} to="/dashboard">
//           <ListItemIcon>
//             <HomeIcon size={20} />
//           </ListItemIcon>
//           <ListItemText primary="Dashboard" />
//         </ListItem>

//         {role === "user" && (
//           <>
//             <ListItem button component={Link} to="/upload">
//               <ListItemIcon>
//                 <UploadIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Vetting of loan documents" />
//             </ListItem>
//             <ListItem button component={Link} to="/seeUploads">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="My Uploads" />
//             </ListItem>
//             <ListItem button component={Link} to="/litigation">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Litigation Monitoring" />
//             </ListItem>
//             <ListItem button component={Link} to="/training">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Training" />
//             </ListItem>
//             <ListItem button component={Link} to="/health">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Health consultation" />
//             </ListItem>
//             <ListItem button component={Link} to="/guidance">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Guidance to startups" />
//             </ListItem>
//             <ListItem button component={Link} to="/research">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Research" />
//             </ListItem>
//             <ListItem button component={Link} to="/notation">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Nation's Enemy" />
//             </ListItem>
//           </>
//         )}

//         {role === "review" && (
//           <>
//           <ListItem button component={Link} to="/review">
//             <ListItemIcon>
//               <CheckSquareIcon size={20} />
//             </ListItemIcon>
//             <ListItemText primary="Review Documents" />
//           </ListItem>
//           <ListItem button component={Link} to="/willFullDefaulter">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="WillFull Defaulter" />
//             </ListItem>
          
//           </>
          
//         )}

//         {role === "admin" && (
//           <>
//             <ListItem button component={Link} to="/adminDocs">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Vetting of loan documents" />
//             </ListItem>
//             <ListItem button component={Link} to="/litigation">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Litigation Monitoring" />
//             </ListItem>
//             <ListItem button component={Link} to="/training">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Training" />
//             </ListItem>
//             <ListItem button component={Link} to="/willFullDefaulterDashboard">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="WillFull Defaulter" />
//             </ListItem>
//             <ListItem button component={Link} to="/health">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Health consultation" />
//             </ListItem>
//             <ListItem button component={Link} to="/guidance">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Guidance to startups" />
//             </ListItem>
//             <ListItem button component={Link} to="/research">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Research" />
//             </ListItem>
//             <ListItem button component={Link} to="/notation">
//               <ListItemIcon>
//                 <FileTextIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Notation ecr" />
//             </ListItem>
//             <ListItem button component={Link} to="/reviewers">
//               <ListItemIcon>
//                 <UsersIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Manage Employees" />
//             </ListItem>
//             <ListItem button component={Link} to="/createUser">
//               <ListItemIcon>
//                 <PersonAddIcon size={20} />
//               </ListItemIcon>
//               <ListItemText primary="Create User" />
//             </ListItem>
//           </>
//         )}
//       </List>
//       <Divider />
//       <List>
//         <ListItem button onClick={handleLogout}>
//           <ListItemIcon>
//             <LogOutIcon size={20} color={theme.palette.error.main} />
//           </ListItemIcon>
//           <ListItemText primary="Logout" primaryTypographyProps={{ color: "error" }} />
//         </ListItem>
//       </List>
//     </Box>
//   )

//   return (
//     <Box sx={{ display: "flex" }}>
//       <AppBar
//         position="fixed"
//         sx={{
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           ml: { sm: `${drawerWidth}px` },
//         }}
//       >
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: "none" } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div">
//             JuraTech
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
//         <Drawer
//           variant={isMobile ? "temporary" : "permanent"}
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true, // Better open performance on mobile
//           }}
//           sx={{
//             display: { xs: "block", sm: "block" },
//             "& .MuiDrawer-paper": {
//               boxSizing: "border-box",
//               width: drawerWidth,
//             },
//           }}
//         >
//           {drawer}
//         </Drawer>
//       </Box>
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           mt: "64px",
//         }}
//       >
//         <Typography variant="h4" gutterBottom>
//           Welcome to your Dashboard
//         </Typography>
//         <Typography variant="body1" color="text.secondary" paragraph>
//           Here's what you can do based on your role:
//         </Typography>

//         <Grid container spacing={3} sx={{ mt: 2 }}>
//           {role === "user" && (
//             <>
//               <Grid item xs={12} sm={6} md={6}>
//                 <ActionCard
//                   title="Upload Documents"
//                   description="Submit new documents for review"
//                   icon={<UploadIcon size={40} />}
//                   to="/upload"
//                   buttonText="Upload Now"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={6}>
//                 <ActionCard
//                   title="View Your Uploads"
//                   description="Check the status of your submitted documents"
//                   icon={<FileTextIcon size={40} />}
//                   to="/seeUploads"
//                   buttonText="View Uploads"
//                 />
//               </Grid>
//             </>
//           )}

//           {role === "review" && (
//             // <Grid item xs={12} sm={6} md={6}>
//             //   <ActionCard
//             //     title="Review Documents"
//             //     description="Review and process submitted documents"
//             //     icon={<CheckSquareIcon size={40} />}
//             //     to="/review"
//             //     buttonText="Start Reviewing"
//             //   />
//             // </Grid>
             
//     <ReviewDocumentsList />
  
//           )}

//           {role === "admin" && (
//             <>
//               <Grid item xs={12} sm={6} md={6}>
//                 <ActionCard
//                   title="Manage Documents"
//                   description="View and manage all documents in the system"
//                   icon={<FileTextIcon size={40} />}
//                   to="/adminDocs"
//                   buttonText="View Documents"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={6}>
//                 <ActionCard
//                   title="Manage Employees"
//                   description="View and manage employee accounts and permissions"
//                   icon={<UsersIcon size={40} />}
//                   to="/reviewers"
//                   buttonText="Manage Employees"
//                 />
//               </Grid>
//             </>
//           )}
//         </Grid>
//       </Box>
//     </Box>
//   )
// }

// function ActionCard({ title, description, icon, to, buttonText }) {
//   return (
//     <Card
//       sx={{
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         transition: "transform 0.2s, box-shadow 0.2s",
//         "&:hover": {
//           transform: "translateY(-4px)",
//           boxShadow: 4,
//         },
//       }}
//     >
//       <CardContent sx={{ flexGrow: 1 }}>
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             mb: 2,
//             color: "primary.main",
//           }}
//         >
//           {icon}
//         </Box>
//         <Typography variant="h6" component="h2" gutterBottom>
//           {title}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {description}
//         </Typography>
//       </CardContent>
//       <CardActions>
//         <Button component={Link} to={to} variant="contained" color="primary" fullWidth>
//           {buttonText}
//         </Button>
//       </CardActions>
//     </Card>
//   )
// }

// function LoadingSkeleton() {
//   return (
//     <Box sx={{ display: "flex" }}>
//       <Box
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           display: { xs: "none", sm: "block" },
//         }}
//       >
//         <Box sx={{ width: drawerWidth }}>
//           <Box sx={{ p: 2 }}>
//             <Skeleton variant="circular" width={64} height={64} sx={{ mx: "auto" }} />
//             <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
//             <Skeleton variant="rectangular" height={24} sx={{ mt: 1 }} width="60%" />
//           </Box>
//           <Divider />
//           <Box sx={{ p: 2 }}>
//             {[1, 2, 3, 4].map((item) => (
//               <Skeleton key={item} height={48} sx={{ my: 1 }} />
//             ))}
//           </Box>
//         </Box>
//       </Box>
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           mt: "64px",
//         }}
//       >
//         <Skeleton variant="text" height={60} width="50%" />
//         <Skeleton variant="text" height={30} width="70%" sx={{ mb: 3 }} />

//         <Grid container spacing={3}>
//           {[1, 2].map((item) => (
//             <Grid item xs={12} sm={6} key={item}>
//               <Skeleton variant="rectangular" height={200} />
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//   )
// }

// export default Dashboard

"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { doc, getDoc, collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/config"
import {
  Box, Typography, Button, Card, CardContent, CardActions,
  Grid, Divider, Skeleton, Paper, List, ListItem, ListItemText
} from "@mui/material"
import { UploadIcon, FileTextIcon, UsersIcon } from "lucide-react"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import EventIcon from "@mui/icons-material/Event"

import ReviewDocumentsList from "./Loan vetting/ReviewDocumentsList"

// Theme Colors
const themeColors = {
  navy: '#0d121b',
  gray: '#4a5568',
  royalBlue: '#0f49bd',
  lightGray: '#f8f9fc',
  borderGray: '#e7ebf3'
};

function Dashboard() {
  const { currentUser, loading } = useAuth()
  const [role, setRole] = useState(null)
  const [roleLoading, setRoleLoading] = useState(true)
  
  // Real-time activity states for multiple collections
  const [loanActivities, setLoanActivities] = useState([]);
  const [litigationActivities, setLitigationActivities] = useState([]);
  const [defaulterActivities, setDefaulterActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // 1. Fetch User Role
  useEffect(() => {
    const fetchRole = async () => {
      if (!currentUser) {
        setRole(null)
        setRoleLoading(false)
        return
      }
      try {
        const docRef = doc(db, "users", currentUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setRole(docSnap.data().role || null)
        }
      } catch (error) {
        console.error("Error fetching role:", error)
      } finally {
        setRoleLoading(false)
      }
    }
    if (!loading) fetchRole()
  }, [currentUser, loading])

  // 2. Fetch Real-time Activities from Multiple Collections
  useEffect(() => {
    if (!currentUser || !role) return;

    const getQuery = (colName) => {
      const ref = collection(db, colName);
      if (role === "admin") {
        return query(ref, orderBy("createdAt", "desc"), limit(10));
      } else {
        return query(ref, where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"), limit(10));
      }
    };

    // Listener 1: Loans
    const unsubLoans = onSnapshot(getQuery("loan_documents"), (snapshot) => {
      const activities = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: 'upload', 
          user: data.userName || data.email || 'A user', 
          text: `Uploaded a loan document ${data.documentName ? `(${data.documentName})` : ''}`, 
          timestamp: data.createdAt?.toMillis() || 0,
          time: data.createdAt ? formatTimeAgo(data.createdAt.toDate()) : 'Just now'
        };
      });
      setLoanActivities(activities);
    }, (error) => console.error("Error fetching loans:", error));

    // Listener 2: Litigations
    const unsubLitigations = onSnapshot(getQuery("litigations"), (snapshot) => {
      const activities = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: 'approval', 
          user: data.userName || data.email || 'A user',
          text: `Updated litigation case ${data.caseNumber || ''}`, 
          timestamp: data.createdAt?.toMillis() || 0,
          time: data.createdAt ? formatTimeAgo(data.createdAt.toDate()) : 'Just now'
        };
      });
      setLitigationActivities(activities);
    }, (error) => console.error("Error fetching litigations:", error));

    // Listener 3: Wilful Defaulters
    const unsubDefaulters = onSnapshot(getQuery("wilful_defaulters"), (snapshot) => {
      const activities = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: 'alert', 
          user: data.userName || data.email || 'A user',
          text: `Added willful defaulter record for ${data.companyName || 'an entity'}`, 
          timestamp: data.createdAt?.toMillis() || 0,
          time: data.createdAt ? formatTimeAgo(data.createdAt.toDate()) : 'Just now'
        };
      });
      setDefaulterActivities(activities);
    }, (error) => console.error("Error fetching defaulters:", error));

    setActivitiesLoading(false);

    return () => {
      unsubLoans();
      unsubLitigations();
      unsubDefaulters();
    };
  }, [currentUser, role]);

  // --- UI Helpers ---
  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload': return <FileUploadIcon />;
      case 'approval': return <CheckCircleIcon />;
      case 'alert': return <WarningAmberIcon />;
      case 'meeting': return <EventIcon />;
      default: return <FileTextIcon />;
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const getRoleLabel = () => {
    switch (role) {
      case "admin": return "Administrator"
      case "review": return "Reviewer"
      case "user": return "User"
      default: return "Unknown Role"
    }
  }

  const getMetrics = () => {
    if (role === 'admin') return [
      { title: 'Total Active Litigations', value: '142', trend: '+12% this month', positive: true },
      { title: 'Pending DRT Cases', value: '38', trend: '-5% this month', positive: true },
      { title: 'System Alerts', value: '7', trend: '+2 new today', positive: false }
    ];
    if (role === 'review') return [
      { title: 'My Pending Reviews', value: '12', trend: '-3 since yesterday', positive: true },
      { title: 'Tasks Completed', value: '45', trend: '+8% vs last week', positive: true },
      { title: 'Urgent Flagged', value: '2', trend: 'Requires attention', positive: false }
    ];
    return [
      { title: 'Documents Uploaded', value: '8', trend: 'All processed', positive: true },
      { title: 'Active Applications', value: '2', trend: 'Awaiting review', positive: true },
      { title: 'Upcoming Consultations', value: '1', trend: 'Tomorrow at 10AM', positive: true }
    ];
  };

  if (loading || roleLoading) return <LoadingSkeleton />;
  if (!loading && !currentUser) return null; // Redirection is handled by Layout/PrivateRoute

  // Combine all fetched collections, sort by newest first, and take the top 10
  const activityFeed = [...loanActivities, ...litigationActivities, ...defaulterActivities]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: '1400px', mx: 'auto' }}>
      
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', fontFamily: "'Playfair Display', serif", color: themeColors.navy }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: themeColors.gray }}>
          Welcome back, {currentUser?.email?.split("@")[0]}. Here's what you can do based on your {getRoleLabel()} role.
        </Typography>
      </Box>

      {/* OVERVIEW METRICS */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: themeColors.navy }}>Overview</Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {getMetrics().map((metric, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${themeColors.borderGray}`, transition: 'all 0.2s', '&:hover': { borderColor: themeColors.royalBlue, transform: 'translateY(-4px)' } }}>
              <Typography variant="body2" sx={{ color: themeColors.gray, fontWeight: 500, mb: 1 }}>{metric.title}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: themeColors.navy, mb: 1 }}>{metric.value}</Typography>
              <Typography variant="caption" sx={{ color: metric.positive ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{metric.trend}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* QUICK ACTIONS */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: themeColors.navy }}>Quick Actions</Typography>
      
      {role === "review" && (
         <Box sx={{ mb: 6 }}>
           <ReviewDocumentsList />
         </Box>
      )}

      {role !== "review" && (
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {role === "user" && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <ActionCard title="Upload Documents" description="Submit new documents for review" icon={<UploadIcon size={32} />} to="/upload" buttonText="Upload Now" />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <ActionCard title="View Your Uploads" description="Check the status of your submitted documents" icon={<FileTextIcon size={32} />} to="/seeUploads" buttonText="View Uploads" />
              </Grid>
            </>
          )}

          {role === "admin" && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <ActionCard title="Manage Documents" description="View and manage all documents in the system" icon={<FileTextIcon size={32} />} to="/adminDocs" buttonText="View Documents" />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <ActionCard title="Manage Employees" description="View and manage employee accounts and permissions" icon={<UsersIcon size={32} />} to="/reviewers" buttonText="Manage Employees" />
              </Grid>
            </>
          )}
        </Grid>
      )}

      {/* DYNAMIC RECENT ACTIVITY FEED */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: themeColors.navy }}>Recent Activity</Typography>
      <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${themeColors.borderGray}`, overflow: 'hidden' }}>
        {activitiesLoading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}><Typography sx={{color: themeColors.gray}}>Loading activity...</Typography></Box>
        ) : activityFeed.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}><Typography sx={{color: themeColors.gray}}>No recent activity found.</Typography></Box>
        ) : (
          <List disablePadding>
            {activityFeed.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <ListItem sx={{ py: 2.5, px: 3 }}>
                  <Box sx={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, height: 40, borderRadius: '50%', mr: 2, 
                      bgcolor: activity.type === 'alert' ? '#fee2e2' : activity.type === 'approval' ? '#dcfce7' : '#e0e7ff', 
                      color: activity.type === 'alert' ? '#dc2626' : activity.type === 'approval' ? '#16a34a' : themeColors.royalBlue 
                    }}>
                    {getActivityIcon(activity.type)}
                  </Box>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 500, color: themeColors.navy }}>
                        {role === 'admin' && activity.user ? <span style={{fontWeight: 'bold', color: themeColors.royalBlue}}>{activity.user} </span> : ''}
                        {role === 'admin' && activity.user && activity.text ? activity.text.replace(activity.user + ' ', '') : activity.text}
                      </Typography>
                    }
                    secondary={<Typography variant="caption" sx={{ color: themeColors.gray, mt: 0.5 }}>{activity.time}</Typography>}
                  />
                </ListItem>
                {index < activityFeed.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  )
}

function ActionCard({ title, description, icon, to, buttonText }) {
  return (
    <Card elevation={0} sx={{ height: "100%", display: "flex", flexDirection: "column", border: `1px solid ${themeColors.borderGray}`, borderRadius: 3, transition: "transform 0.2s, box-shadow 0.2s", "&:hover": { transform: "translateY(-4px)", boxShadow: 3, borderColor: themeColors.royalBlue } }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: 'center', mb: 2, color: themeColors.royalBlue, bgcolor: themeColors.lightGray, p: 1.5, borderRadius: 2 }}>
          {icon}
        </Box>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: themeColors.navy, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: themeColors.gray }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button component={Link} to={to} variant="contained" disableElevation fullWidth sx={{ bgcolor: themeColors.navy, py: 1, textTransform: 'none', fontWeight: 'bold', borderRadius: 2, '&:hover': { bgcolor: themeColors.royalBlue } }}>
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: '1400px', mx: 'auto' }}>
      <Skeleton variant="text" height={60} width="40%" />
      <Skeleton variant="text" height={30} width="60%" sx={{ mb: 4 }} />
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} md={4} key={item}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
    </Box>
  )
}

export default Dashboard