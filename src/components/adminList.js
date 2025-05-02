"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase/config"
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
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Fade,
} from "@mui/material"
import { useAuth } from "../contexts/AuthContext"
import SearchIcon from "@mui/icons-material/Search"
import DescriptionIcon from "@mui/icons-material/Description"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import BusinessIcon from "@mui/icons-material/Business"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import RefreshIcon from "@mui/icons-material/Refresh"
import FilterListIcon from "@mui/icons-material/FilterList"
import PersonIcon from "@mui/icons-material/Person"
import VisibilityIcon from "@mui/icons-material/Visibility"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import UpdateIcon from "@mui/icons-material/Update"
import CloseIcon from "@mui/icons-material/Close"
import { doc, query, where, updateDoc } from "firebase/firestore"
import { arrayUnion, increment,arrayRemove} from "firebase/firestore"

function AdminDocumentsList() {
  const [submissions, setSubmissions] = useState([])
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [anchorEl, setAnchorEl] = useState(null)
  const { currentUser, loading: authLoading } = useAuth()
  const history = useHistory()
  const [reviewers, setReviewers] = useState([])
  const [assigningSubmissionId, setAssigningSubmissionId] = useState(null)
  const [assigningStatus, setAssigningStatus] = useState("pending")
  const [selectedReviewer, setSelectedReviewer] = useState("")
  const [tabValue, setTabValue] = useState(0)
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const [openReviewerDialog, setOpenReviewerDialog] = useState(false)
  const [currentSubmission, setCurrentSubmission] = useState(null)

  useEffect(() => {
    if (authLoading) return // Wait until auth is ready
    if (!currentUser) return // Redirect will happen in render

    fetchSubmissions()
    fetchReviewers()
  }, [currentUser, authLoading])

  useEffect(() => {
    // Filter submissions based on search term and filter status
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
            (submission?.borrowerDetails?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (submission?.submittedBy || "").toLowerCase().includes(searchTerm.toLowerCase())||
            (submission?.submissionName || "").toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Apply status filter
      if (filterStatus !== "all") {
        filtered = filtered.filter((submission) => (submission?.status || "pending") === filterStatus)
      }

      // Apply tab filter
      if (tabValue === 1) {
        // Assigned
        filtered = filtered.filter((submission) => submission?.reviewer)
      } else if (tabValue === 2) {
        // Unassigned
        filtered = filtered.filter((submission) => !submission?.reviewer)
      }

      setFilteredSubmissions(filtered)
    } else {
      setFilteredSubmissions([])
    }
  }, [searchTerm, filterStatus, submissions, tabValue])

  const fetchSubmissions = async () => {
    setLoading(true)
    setError(null)
    try {
      const querySnapshot = await getDocs(collection(db, "submissions"))
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        time: doc.data().time,
        submittedBy: doc.data().submittedBy,
        status: doc.data().status,
        reviewer: doc.data().reviewer,
        submissionName: doc.data().name||"Unnamed Submission",
        ...doc.data(),
        // Add default status if not present
        status: doc.data().status || "pending",
        // Add timestamp for sorting if not present
        createdAt: doc.data().createdAt || { seconds: 0 },
      }))

      // Sort by creation date (newest first)
      data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)

      setSubmissions(data)
      setFilteredSubmissions(data)
    } catch (err) {
      console.error("Error fetching submissions: ", err)
      setError("Failed to fetch submissions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchReviewers = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "review"))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }))
      setReviewers(data)
    } catch (error) {
      console.error("Error fetching reviewers:", error)
    }
  }

  const handleAssignReviewer = async () => {
    try {
      const submissionDoc = doc(db, "submissions", assigningSubmissionId)
      const newReviewerDoc = doc(db, "users", selectedReviewer)


      if (currentSubmission.reviewer && currentSubmission.reviewer !== selectedReviewer) {
        const oldReviewerDoc = doc(db, "users", currentSubmission.reviewer)
        await updateDoc(oldReviewerDoc, {
          assignedCount: increment(-1),
          filesAssigned: arrayRemove(assigningSubmissionId),
          inProgress: increment(-1), // 👈 also decrement inProgress count
        })
      }

      await updateDoc(submissionDoc, {
        reviewer: selectedReviewer,
        status: "under-review",
      })

      await updateDoc(newReviewerDoc, {
        assignedCount: increment(1),
        filesAssigned: arrayUnion(assigningSubmissionId),
        inProgress: increment(1), // 👈 increment inProgress count
      })

      // await updateDoc(doc(db, "submissions", assigningSubmissionId), {
      //   reviewer: selectedReviewer,
      //   status: "under-review",
      // })

      // await updateDoc(doc(db, "users", selectedReviewer), {
      //   assignedCount: increment(1),
      //   filesAssigned: arrayUnion(assigningSubmissionId),
      // })

      fetchSubmissions()
      setOpenReviewerDialog(false)
      setSelectedReviewer("")
    } catch (error) {
      console.error("Error assigning reviewer:", error)
      alert("Failed to assign reviewer.")
    }
  }

  const handleAssignStatus = async () => {
    if (!assigningStatus) {
      alert("Please select a status.")
      return
    }
    try {
      await updateDoc(doc(db, "submissions", assigningSubmissionId), {
        status: assigningStatus,
      })

      if (currentSubmission.reviewer) {
        const reviewerDoc = doc(db, "users", currentSubmission.reviewer)
  
        if (["approved", "rejected"].includes(assigningStatus)) {
          await updateDoc(reviewerDoc, {
            assignedCount: increment(-1),
            filesAssigned: arrayRemove(assigningSubmissionId),
            inProgress: increment(-1),
            [assigningStatus]: increment(1), 
          })
        } else if (assigningStatus === "completed") {
          await updateDoc(reviewerDoc, {
            inProgress: increment(-1),
            completed: increment(1), 
          })
        }
      }

      fetchSubmissions()
      setOpenStatusDialog(false)
      setAssigningStatus("pending")
    } catch (error) {
      console.error("Error changing status:", error)
      alert(`Error changing status: ${error}`)
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

  const handleOpenStatusDialog = (submission) => {
    setCurrentSubmission(submission)
    setAssigningSubmissionId(submission.id)
    setAssigningStatus(submission.status || "pending")
    setOpenStatusDialog(true)
  }

  const handleOpenReviewerDialog = (submission) => {
    setCurrentSubmission(submission)
    setAssigningSubmissionId(submission.id)
    setSelectedReviewer(submission.reviewer || "")
    setOpenReviewerDialog(true)
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
      case "under-review":
        return "info"
      default:
        return "default"
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

  const getReviewerName = (reviewerId) => {
    if (!reviewerId) return "Unassigned"
    const reviewer = reviewers.find((r) => r.uid === reviewerId)
    return reviewer ? reviewer.name || reviewer.email : "Unknown Reviewer"
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
            Document Submissions
          </Typography>
          <Box>
            <Tooltip title="More options">
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleRefresh}>
                <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
                Refresh
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
          <Tab label="All Documents" />
          <Tab label="Assigned" />
          <Tab label="Unassigned" />
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

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="under-review">Under Review</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
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
              {searchTerm || filterStatus !== "all" || tabValue !== 0
                ? "Try adjusting your search or filter criteria"
                : "There are no document submissions to review at this time"}
            </Typography>
            {(searchTerm || filterStatus !== "all" || tabValue !== 0) && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("all")
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
              <Grid item xs={12} key={submission.id}>
                <Fade in={true} timeout={300}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      overflow: "hidden",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 3,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "100%", md: "8px" },
                        height: { xs: "8px", md: "auto" },
                        backgroundColor: (theme) => theme.palette[getStatusColor(submission.status)].main,
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box>
                          <Typography variant="h6" component="h2" gutterBottom>
                            {submission?.submissionName || "Unnamed Borrower"}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <BusinessIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {submission?.borrowerDetails?.borrowerConstitution || "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={submission.status || "pending"}
                          color={getStatusColor(submission.status)}
                          size="small"
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AccessTimeIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              Submitted: {formatDate(submission.submittedAt)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <DescriptionIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              ID: {submission.id.substring(0, 8)}...
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <PersonIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              Reviewer: {getReviewerName(submission.reviewer)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "row", md: "column" },
                        justifyContent: "center",
                        alignItems: "stretch",
                        p: 2,
                        backgroundColor: "background.default",
                        gap: 1.5,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenStatusDialog(submission)}
                        startIcon={<UpdateIcon />}
                        sx={{
                          minWidth: { xs: "auto", md: "150px" },
                          width: { xs: "100%", md: "auto" },
                        }}
                      >
                        Status
                      </Button>

                      <Button
                        variant="outlined"
                        onClick={() => handleOpenReviewerDialog(submission)}
                        startIcon={<AssignmentIndIcon />}
                        sx={{
                          minWidth: { xs: "auto", md: "150px" },
                          width: { xs: "100%", md: "auto" },
                        }}
                      >
                        Assign
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleViewDetails(submission.id)}
                        startIcon={<VisibilityIcon />}
                        sx={{
                          minWidth: { xs: "auto", md: "150px" },
                          width: { xs: "100%", md: "auto" },
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Status Change Dialog */}
      <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Update Document Status
            <IconButton onClick={() => setOpenStatusDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Document ID: {currentSubmission?.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submitted by: {currentSubmission?.submittedBy}
            </Typography>
          </Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={assigningStatus}
              onChange={(e) => setAssigningStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="under-review">Under Review</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleAssignStatus} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reviewer Assignment Dialog */}
      <Dialog open={openReviewerDialog} onClose={() => setOpenReviewerDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Assign Reviewer
            <IconButton onClick={() => setOpenReviewerDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Document ID: {currentSubmission?.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submitted by: {currentSubmission?.submittedBy}
            </Typography>
          </Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="reviewer-select-label">Reviewer</InputLabel>
            <Select
              labelId="reviewer-select-label"
              value={selectedReviewer}
              onChange={(e) => setSelectedReviewer(e.target.value)}
              label="Reviewer"
            >
              {reviewers.map((user) => (
                <MenuItem key={user.uid} value={user.uid}>
                  {user.name || user.email || user.uid}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenReviewerDialog(false)}>Cancel</Button>
          <Button onClick={handleAssignReviewer} variant="contained" disabled={!selectedReviewer}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AdminDocumentsList
