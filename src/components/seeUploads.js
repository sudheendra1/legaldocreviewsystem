
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
} from "@mui/material"
import { useAuth } from "../contexts/AuthContext"
import SearchIcon from "@mui/icons-material/Search"
import DescriptionIcon from "@mui/icons-material/Description"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import BusinessIcon from "@mui/icons-material/Business"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import RefreshIcon from "@mui/icons-material/Refresh"
import { doc, getDoc, query, where } from "firebase/firestore"


function SeeUploads() {
  const [submissions, setSubmissions] = useState([])
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [anchorEl, setAnchorEl] = useState(null)
  const { currentUser, loading: authLoading } = useAuth()
  const history = useHistory()

  useEffect(() => {
    if (authLoading) return // Wait until auth is ready
    if (!currentUser) return // Redirect will happen in render

    fetchSubmissions()
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
            (submission?.borrowerDetails?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Apply status filter
      if (filterStatus !== "all") {
        filtered = filtered.filter((submission) => (submission?.status || "pending") === filterStatus)
      }

      setFilteredSubmissions(filtered)
    } else {
      setFilteredSubmissions([])
    }
  }, [searchTerm, filterStatus, submissions])

//   const fetchSubmissions = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//         const q = query(
//             collection(db, "submissions"),
//             where("userId", "==", currentUser.uid)
//           )
//           const querySnapshot = await getDocs(q)
//       const data = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         time:doc.data().time,
//         submittedBy: doc.data().submittedBy,
//         status: doc.data().status,
//         ...doc.data(),
//         // Add default status if not present
//         status: doc.data().status || "pending",
//         // Add timestamp for sorting if not present
//         createdAt: doc.data().createdAt || { seconds: 0 },
//       }))

//       // Sort by creation date (newest first)
//       data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)

//       setSubmissions(data)
//       setFilteredSubmissions(data)
//     } catch (err) {
//       console.error("Error fetching submissions: ", err)
//       setError("Failed to fetch submissions. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

const fetchSubmissions = async () => {
    setLoading(true)
    setError(null)
    try {
      const q = query(
        collection(db, "submissions"),
        where("userId", "==", currentUser.uid)
      )
      const querySnapshot = await getDocs(q)
  
      const data = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const docData = docSnap.data()
          let reviewerName = null
  
          if (docData.reviewer) {
            try {
              const reviewerDoc = await getDoc(doc(db, "users", docData.reviewer))
              if (reviewerDoc.exists()) {
                reviewerName = reviewerDoc.data().name || null
              }
            } catch (err) {
              console.warn(`Error fetching reviewer info for ${docData.reviewer}:`, err)
            }
          }
          console.log("id:,", docSnap.id)
  
          return {
            id: docSnap.id,
            time: docData.time,
            submittedBy: docData.submittedBy,
            status: docData.status || "pending",
            createdAt: docData.createdAt || { seconds: 0 },
            reviewerName,
            ...docData,
          }
        })
      )
  
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
  

  const handleViewDetails = (id) => {
    console.log("Navigating to:", `/seeUploads/${id}`) 
    history.push(`/seeUploads/${id}`)
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

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success"
      case "rejected":
        return "error"
      case "pending":
        return "warning"
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
            Document Submissions
          </Typography>
          <Box>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleRefresh}>
                <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
                Refresh
              </MenuItem>
            </Menu>
          </Box>
        </Box>

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
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
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
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "There are no document submissions to review at this time"}
            </Typography>
            {(searchTerm || filterStatus !== "all") && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("all")
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
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    overflow: "hidden",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
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
                          {submission?.submittedBy || "Unnamed Borrower"}
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
                            Reviewer: {submission.reviewerName}...
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
                      alignItems: "center",
                      p: 2,
                      backgroundColor: "background.default",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleViewDetails(submission.id)}
                      sx={{
                        minWidth: { xs: "auto", md: "120px" },
                        width: { xs: "100%", md: "auto" },
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  )
}

export default SeeUploads
