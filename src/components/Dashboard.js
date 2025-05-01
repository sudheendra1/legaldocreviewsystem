"use client"

import { useState, useEffect } from "react"
import { Link, Redirect,useHistory} from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { doc, getDoc } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { auth, db } from "../firebase/config"
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Divider,
  Skeleton,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { UploadIcon, FileTextIcon, LogOutIcon, MenuIcon, UsersIcon, HomeIcon, CheckSquareIcon } from "lucide-react"
import PersonAddIcon from "@mui/icons-material/PersonAdd"

const drawerWidth = 240

function Dashboard() {
  const { currentUser, loading } = useAuth()
  const [role, setRole] = useState(null)
  const [roleLoading, setRoleLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const history = useHistory()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    const fetchRole = async () => {
      if (!currentUser) {
        setRole(null)
        setRoleLoading(false)
        return
      }

      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const userData = docSnap.data()
            setRole(userData.role || null)
          }
        } catch (error) {
          console.error("Error fetching role:", error)
        } finally {
          setRoleLoading(false)
        }
      }
    }
    if (!loading) {
      fetchRole()
    }
  }, [currentUser, loading])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      history.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  if (loading || roleLoading) {
    return <LoadingSkeleton />
  }

  if (!loading && !currentUser) {
    history.push("/login")
    return null
  }

  const getRoleColor = () => {
    switch (role) {
      case "admin":
        return "error"
      case "review":
        return "warning"
      case "user":
        return "success"
      default:
        return "default"
    }
  }

  const getRoleLabel = () => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "review":
        return "Reviewer"
      case "user":
        return "User"
      default:
        return "Unknown Role"
    }
  }

  const drawer = (
    <Box sx={{ overflow: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: theme.palette.primary.main,
            mb: 1,
          }}
        >
          {currentUser?.email?.charAt(0).toUpperCase() || "U"}
        </Avatar>
        <Typography variant="subtitle1" fontWeight="bold">
          {currentUser?.email?.split("@")[0]}
        </Typography>
        <Chip label={getRoleLabel()} color={getRoleColor()} size="small" sx={{ mt: 1 }} />
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon>
            <HomeIcon size={20} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {role === "user" && (
          <>
            <ListItem button component={Link} to="/upload">
              <ListItemIcon>
                <UploadIcon size={20} />
              </ListItemIcon>
              <ListItemText primary="Upload Documents" />
            </ListItem>
            <ListItem button component={Link} to="/seeUploads">
              <ListItemIcon>
                <FileTextIcon size={20} />
              </ListItemIcon>
              <ListItemText primary="My Uploads" />
            </ListItem>
          </>
        )}

        {role === "review" && (
          <ListItem button component={Link} to="/review">
            <ListItemIcon>
              <CheckSquareIcon size={20} />
            </ListItemIcon>
            <ListItemText primary="Review Documents" />
          </ListItem>
        )}

        {role === "admin" && (
          <>
            <ListItem button component={Link} to="/adminDocs">
              <ListItemIcon>
                <FileTextIcon size={20} />
              </ListItemIcon>
              <ListItemText primary="All Documents" />
            </ListItem>
            <ListItem button component={Link} to="/reviewers">
              <ListItemIcon>
                <UsersIcon size={20} />
              </ListItemIcon>
              <ListItemText primary="Manage Employees" />
            </ListItem>
            <ListItem button component={Link} to="/createUser">
              <ListItemIcon>
                <PersonAddIcon size={20} />
              </ListItemIcon>
              <ListItemText primary="Create User" />
            </ListItem>
          </>
        )}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogOutIcon size={20} color={theme.palette.error.main} />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ color: "error" }} />
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Legal Document Review System
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to your Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Here's what you can do based on your role:
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {role === "user" && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <ActionCard
                  title="Upload Documents"
                  description="Submit new documents for review"
                  icon={<UploadIcon size={40} />}
                  to="/upload"
                  buttonText="Upload Now"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <ActionCard
                  title="View Your Uploads"
                  description="Check the status of your submitted documents"
                  icon={<FileTextIcon size={40} />}
                  to="/seeUploads"
                  buttonText="View Uploads"
                />
              </Grid>
            </>
          )}

          {role === "review" && (
            <Grid item xs={12} sm={6} md={6}>
              <ActionCard
                title="Review Documents"
                description="Review and process submitted documents"
                icon={<CheckSquareIcon size={40} />}
                to="/review"
                buttonText="Start Reviewing"
              />
            </Grid>
          )}

          {role === "admin" && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <ActionCard
                  title="Manage Documents"
                  description="View and manage all documents in the system"
                  icon={<FileTextIcon size={40} />}
                  to="/adminDocs"
                  buttonText="View Documents"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <ActionCard
                  title="Manage Employees"
                  description="View and manage employee accounts and permissions"
                  icon={<UsersIcon size={40} />}
                  to="/reviewers"
                  buttonText="Manage Employees"
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  )
}

function ActionCard({ title, description, icon, to, buttonText }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            color: "primary.main",
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={to} variant="contained" color="primary" fullWidth>
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
        }}
      >
        <Box sx={{ width: drawerWidth }}>
          <Box sx={{ p: 2 }}>
            <Skeleton variant="circular" width={64} height={64} sx={{ mx: "auto" }} />
            <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
            <Skeleton variant="rectangular" height={24} sx={{ mt: 1 }} width="60%" />
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} height={48} sx={{ my: 1 }} />
            ))}
          </Box>
        </Box>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
        }}
      >
        <Skeleton variant="text" height={60} width="50%" />
        <Skeleton variant="text" height={30} width="70%" sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {[1, 2].map((item) => (
            <Grid item xs={12} sm={6} key={item}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default Dashboard
