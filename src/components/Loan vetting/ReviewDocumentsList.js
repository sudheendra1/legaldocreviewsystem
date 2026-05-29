"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/config"
import { useHistory, Redirect } from "react-router-dom"
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Box,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Badge,
  Tabs,
  Tab,
  Fade,
} from "@mui/material"
import { useAuth } from "../../contexts/AuthContext"
import SearchIcon from "@mui/icons-material/Search"
import DescriptionIcon from "@mui/icons-material/Description"
import BusinessIcon from "@mui/icons-material/Business"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import RefreshIcon from "@mui/icons-material/Refresh"
import RateReviewIcon from "@mui/icons-material/RateReview"
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"
import PendingActionsIcon from "@mui/icons-material/PendingActions"
import { query, where } from "firebase/firestore"
import CancelIcon from "@mui/icons-material/Cancel"
import api from "../../services/api"

function ReviewDocumentsList() {
  const [submissions, setSubmissions] = useState([])
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [anchorEl, setAnchorEl] = useState(null)
  const { currentUser, loading: authLoading } = useAuth()
  const history = useHistory()
  const [tabValue, setTabValue] = useState(0)
  const [page, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setPageSize] = useState(10);
  

  useEffect(() => {
    if (authLoading) return
    if (!currentUser) return

    fetchSubmissions()
  }, [currentUser, authLoading,page])

  useEffect(() => {
    if (submissions.length > 0) {
      let filtered = [...submissions]

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (submission) =>
            (submission?.borrowerDetails?.borrowerConstitution || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (submission?.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (submission?.submittedBy || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (submission?.submissionName || "").toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Apply tab filter
      if (tabValue === 1) {
        // Pending
        filtered = filtered.filter((submission) => submission.status === "pending-under-review")
      } else if (tabValue === 2) {
        // In Progress
        filtered = filtered.filter((submission) => submission.status === "under-review")
      } else if (tabValue === 3) {
        // Completed
        filtered = filtered.filter((submission) => submission.status === "approved" || submission.status === "rejected")
      }

      setFilteredSubmissions(filtered)
    } else {
      setFilteredSubmissions([])
    }
  }, [searchTerm, submissions, tabValue])

  // const fetchSubmissions = async () => {
  //   setLoading(true)
  //   setError(null)
  //   try {
  //     const q = query(collection(db, "submissions"), where("reviewer", "==", currentUser.uid))
  //     const querySnapshot = await getDocs(q)
  //     const data = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       time: doc.data().time,
  //       submittedBy: doc.data().submittedBy,
  //       status: doc.data().status || "pending",
  //       submissionName: doc.data().name || "Unnamed Submission",
  //       ...doc.data(),
  //       // Add timestamp for sorting if not present
  //       createdAt: doc.data().createdAt || { seconds: 0 },
  //     }))

  //     // Sort by creation date (newest first)
  //     data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)

  //     setSubmissions(data)
  //     setFilteredSubmissions(data)
  //   } catch (err) {
  //     console.error("Error fetching submissions: ", err)
  //     setError("Failed to fetch submissions. Please try again.")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

const fetchSubmissions = async () => {
    setLoading(true)
    setError(null)
    try {
      // Create this endpoint in Spring Boot to get docs assigned to this reviewer
      const response = await api.get(`/vetting/submissions/reviewer/${currentUser.uid}`,{ params: { page, size } });
      const data = response.data;

      let submissionsArray = [];
      let totalPagesCount = 1;
      
      if (data && data.content) {
          submissionsArray = data.content;
          totalPagesCount = data.totalPages;
      } else if (Array.isArray(data)) {
          submissionsArray = data;
      }

      // 2. Safely sort
      if (submissionsArray.length > 0) {
          submissionsArray.sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt));
      }

      // 3. Safely set state
      setSubmissions(submissionsArray || []); // Or setUploads() depending on the file
      setTotalPages(totalPagesCount || 1);
      
      // If you have a filtered state in this file, set it too:
      if (typeof setFilteredSubmissions === 'function') {
          setFilteredSubmissions(submissionsArray || []);
      }
      
      // data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // setSubmissions(data.content)
      // setFilteredSubmissions(data.content)
      // setTotalPages(data.totalPages)
    } catch (err) {
      console.error("Error fetching submissions: ", err)
      setError("Failed to fetch submissions. Please try again.")
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (id) => {
    history.push(`/review/${id}`)
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleRefresh = () => {
    fetchSubmissions()
    handleMenuClose()
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success"
      case "rejected":
        return "error"
      case "pending":
        return "warning"
      case "pending-under-review":
        return "secondary"
      case "under-review":
        return "info"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <AssignmentTurnedInIcon />
      case "rejected":
        return <CancelIcon />
      case "pending":
        return <PendingActionsIcon />
      case "under-review":
        return <RateReviewIcon />
      default:
        return <DescriptionIcon />
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "N/A"
    const date = new Date(timestamp.seconds * 1000)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "100vh", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!currentUser) {
    return <Redirect to="/login" />
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading submissions...
        </Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            My Review Queue
          </Typography>
          <Box>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleRefresh}>
                <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
                Refresh List
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<DescriptionIcon />} iconPosition="start" label="All" />
          <Tab icon={<PendingActionsIcon />} iconPosition="start" label="Pending" />
          <Tab icon={<RateReviewIcon />} iconPosition="start" label="In Progress" />
          <Tab icon={<AssignmentTurnedInIcon />} iconPosition="start" label="Completed" />
        </Tabs>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 4,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <TextField
            placeholder="Search submissions..."
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
            <Button size="small" onClick={fetchSubmissions} sx={{ ml: 2 }}>
              Retry
            </Button>
          </Alert>
        )}

        {filteredSubmissions.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              backgroundColor: "background.default",
              borderRadius: 2,
            }}
          >
            <DescriptionIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No submissions found
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400, mb: 3 }}>
              {searchTerm || tabValue !== 0
                ? "Try adjusting your search or filter criteria"
                : "You don't have any documents assigned for review"}
            </Typography>
            {(searchTerm || tabValue !== 0) && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm("")
                  setTabValue(0)
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredSubmissions.map((submission) => (
              <Grid item xs={12} sm={6} md={4} key={submission.id}>
                <Fade in={true} timeout={300}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 3,
                      },
                      position: "relative",
                      overflow: "visible",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: 20,
                        zIndex: 1,
                      }}
                    >
                      <Badge
                        overlap="circular"
                        badgeContent=" "
                        color={getStatusColor(submission.status)}
                        variant="dot"
                        sx={{
                          "& .MuiBadge-badge": {
                            height: "16px",
                            width: "16px",
                            borderRadius: "50%",
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "background.paper",
                            border: "2px solid",
                            borderColor: (theme) =>
  theme.palette[getStatusColor(submission.status)]?.main || theme.palette.grey[400],

                           caretColorolor: (theme) =>
  theme.palette[getStatusColor(submission.status)]?.main || theme.palette.grey[400],

                          }}
                        >
                          {submission?.submittedBy?.charAt(0).toUpperCase() || "U"}
                        </Avatar>
                      </Badge>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                      <Typography variant="h6" component="h2" gutterBottom noWrap>
                        {submission?.submissionName || "Unnamed Submission"}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <BusinessIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {submission?.borrowerDetails?.borrowerConstitution || "N/A"}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Status
                        </Typography>
                        <Chip
                          label={submission.status || "pending"}
                          color={getStatusColor(submission.status)}
                          size="small"
                          sx={{ fontWeight: "medium" }}
                        />
                      </Box>

                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Submitted
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatDate(submission.submittedAt)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Submitted By:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {submission.submittedBy || "Unnamed Borrower"}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Divider />
                    <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        onClick={() => handleViewDetails(submission.id)}
                        startIcon={<RateReviewIcon />}
                        fullWidth
                      >
                        Review Document
                      </Button>
                    </Box>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pb: 1, px: 2 }}>
            <Button 
                variant="outlined"
                disabled={page === 0} 
                onClick={() => setCurrentPage(prev => prev - 1)}
            >
                Previous
            </Button>

            <Typography variant="body2" color="text.secondary">
                Page {page + 1} of {totalPages === 0 ? 1 : totalPages}
            </Typography>

            <Button 
                variant="outlined"
                disabled={page >= totalPages - 1} 
                onClick={() => setCurrentPage(prev => prev + 1)}
            >
                Next
            </Button>
        </Box>
      </Paper>
      
    </Container>
  )
}

export default ReviewDocumentsList
