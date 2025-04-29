// "use client"

// import { useState, useEffect } from "react"
// import { collection, getDocs } from "firebase/firestore"
// import { db } from "../firebase/config"
// import { useHistory, Redirect } from "react-router-dom"
// import {
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   CircularProgress,
//   Box,
//   Alert,
//   Chip,
//   TextField,
//   InputAdornment,
//   Divider,
//   Paper,
//   IconButton,
//   Menu,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
// } from "@mui/material"
// import { useAuth } from "../contexts/AuthContext"
// import SearchIcon from "@mui/icons-material/Search"
// import DescriptionIcon from "@mui/icons-material/Description"
// import AccessTimeIcon from "@mui/icons-material/AccessTime"
// import BusinessIcon from "@mui/icons-material/Business"
// import MoreVertIcon from "@mui/icons-material/MoreVert"
// import RefreshIcon from "@mui/icons-material/Refresh"
// import { doc, query, where,updateDoc } from "firebase/firestore"
// import { arrayUnion, increment,decrement } from "firebase/firestore" 


// function AdminDocumentsList() {
//   const [submissions, setSubmissions] = useState([])
//   const [filteredSubmissions, setFilteredSubmissions] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterStatus, setFilterStatus] = useState("all")
//   const [anchorEl, setAnchorEl] = useState(null)
//   const { currentUser, loading: authLoading } = useAuth()
//   const history = useHistory()
//   const [reviewers, setReviewers] = useState([])
//   const [assigningSubmissionId, setAssigningSubmissionId] = useState(null)
//   const [assigningStatus, setAssigningStatus] = useState("pending")
//   const [selectedReviewer, setSelectedReviewer] = useState("")


//   useEffect(() => {
//     if (authLoading) return // Wait until auth is ready
//     if (!currentUser) return // Redirect will happen in render

//     fetchSubmissions()
//     fetchReviewers()
//   }, [currentUser, authLoading])

//   useEffect(() => {
//     // Filter submissions based on search term and filter status
//     if (submissions.length > 0) {
//       let filtered = [...submissions]

//       // Apply search filter
//       if (searchTerm) {
//         filtered = filtered.filter(
//           (submission) =>
//             (submission?.borrowerDetails?.borrowerConstitution || "")
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase()) ||
//             (submission?.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//             (submission?.borrowerDetails?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
//         )
//       }

//       // Apply status filter
//       if (filterStatus !== "all") {
//         filtered = filtered.filter((submission) => (submission?.status || "pending") === filterStatus)
//       }

//       setFilteredSubmissions(filtered)
//     } else {
//       setFilteredSubmissions([])
//     }
//   }, [searchTerm, filterStatus, submissions])

//   const fetchSubmissions = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const querySnapshot = await getDocs(collection(db, "submissions"))
//       const data = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         time:doc.data().time,
//         submittedBy: doc.data().submittedBy,
//         status: doc.data().status,
//         reviewer: doc.data().reviewer,
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


//   const fetchReviewers = async () => {
//     try {
//       const q = query(collection(db, "users"), where("role", "==", "review"))
//       const snapshot = await getDocs(q)
//       const data = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }))
//       setReviewers(data)
//     } catch (error) {
//       console.error("Error fetching reviewers:", error)
//     }
//   }

//   const handleAssignReviewer = async () => {
//     try {
//       await updateDoc(doc(db, "submissions", assigningSubmissionId), {
//         reviewer: selectedReviewer,
//       })

//       await updateDoc(doc(db, "users", selectedReviewer), {
//         assignedCount: increment(1),
//         filesAssigned: arrayUnion(assigningSubmissionId),
//       })

//       fetchSubmissions()
//       setAssigningSubmissionId(null)
//       setSelectedReviewer("")
//     } catch (error) {
//       console.error("Error assigning reviewer:", error)
//       alert("Failed to assign reviewer.")
//     }
//   }

//   const handleAssignStatus = async () => {

//     if (!assigningStatus) {
//       alert("Please select a status.");
//       return;
//     }
//     try {
//       await updateDoc(doc(db, "submissions", assigningSubmissionId), {
//         status: assigningStatus,
//       })

//       // await updateDoc(doc(db, "users", submission.reviewer), {
//       //   assignedCount: decrement(1),
//       //   filesAssigned: arrayUnion(assigningSubmissionId),
//       // })

//       fetchSubmissions()
//       setAssigningSubmissionId(null)
//       // setSelectedReviewer("")
//       setAssigningStatus("")
//     } catch (error) {
//       console.error("Error changing status:", error)
//       alert("Failed to change status.")
//     }
//   }

//   const handleViewDetails = (id) => {
//     history.push(`/review/${id}`)
//   }

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleMenuClose = () => {
//     setAnchorEl(null)
//   }

//   const handleRefresh = () => {
//     fetchSubmissions()
//     handleMenuClose()
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "approved":
//         return "success"
//       case "rejected":
//         return "error"
//       case "pending":
//         return "warning"
//         case "under-review":
//         return "info"
//       default:
//         return "default"
//     }
//   }

//   const formatDate = (timestamp) => {
//     if (!timestamp || !timestamp.seconds) return "N/A"
//     const date = new Date(timestamp.seconds * 1000)
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   if (authLoading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", height: "100vh", alignItems: "center" }}>
//         <CircularProgress />
//       </Box>
//     )
//   }

//   if (!currentUser) {
//     return <Redirect to="/login" />
//   }

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "50vh",
//         }}
//       >
//         <CircularProgress size={60} thickness={4} />
//         <Typography variant="h6" sx={{ mt: 2 }}>
//           Loading submissions...
//         </Typography>
//       </Box>
//     )
//   }

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
//       <Paper
//         elevation={0}
//         sx={{
//           p: 3,
//           borderRadius: 2,
//           backgroundColor: "background.paper",
//           border: "1px solid",
//           borderColor: "divider",
//         }}
//       >
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//           <Typography variant="h4" component="h1" fontWeight="bold">
//             Document Submissions
//           </Typography>
//           <Box>
//             <IconButton onClick={handleMenuClick}>
//               <MoreVertIcon />
//             </IconButton>
//             <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//               <MenuItem onClick={handleRefresh}>
//                 <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
//                 Refresh
//               </MenuItem>
//             </Menu>
//           </Box>
//         </Box>

//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: { xs: "column", sm: "row" },
//             gap: 2,
//             mb: 4,
//             alignItems: { xs: "stretch", sm: "center" },
//           }}
//         >
//           <TextField
//             placeholder="Search submissions..."
//             variant="outlined"
//             fullWidth
//             size="small"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ flexGrow: 1 }}
//           />

//           <FormControl size="small" sx={{ minWidth: 150 }}>
//             <InputLabel id="status-filter-label">Status</InputLabel>
//             <Select
//               labelId="status-filter-label"
//               id="status-filter"
//               value={filterStatus}
//               label="Status"
//               onChange={(e) => setFilterStatus(e.target.value)}
//             >
//               <MenuItem value="all">All Status</MenuItem>
//               <MenuItem value="pending">Pending</MenuItem>
//               <MenuItem value="under-review">Under Review</MenuItem>
//               <MenuItem value="approved">Approved</MenuItem>
//               <MenuItem value="rejected">Rejected</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error}
//             <Button size="small" onClick={fetchSubmissions} sx={{ ml: 2 }}>
//               Retry
//             </Button>
//           </Alert>
//         )}

//         {filteredSubmissions.length === 0 ? (
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               py: 8,
//               backgroundColor: "background.default",
//               borderRadius: 2,
//             }}
//           >
//             <DescriptionIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
//             <Typography variant="h6" color="text.secondary" gutterBottom>
//               No submissions found
//             </Typography>
//             <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400, mb: 3 }}>
//               {searchTerm || filterStatus !== "all"
//                 ? "Try adjusting your search or filter criteria"
//                 : "There are no document submissions to review at this time"}
//             </Typography>
//             {(searchTerm || filterStatus !== "all") && (
//               <Button
//                 variant="outlined"
//                 onClick={() => {
//                   setSearchTerm("")
//                   setFilterStatus("all")
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             )}
//           </Box>
//         ) : (
//           <Grid container spacing={3}>
//             {filteredSubmissions.map((submission) => (
//               <Grid item xs={12} key={submission.id}>
//                 <Card
//                   sx={{
//                     display: "flex",
//                     flexDirection: { xs: "column", md: "row" },
//                     overflow: "hidden",
//                     transition: "transform 0.2s, box-shadow 0.2s",
//                     "&:hover": {
//                       transform: "translateY(-2px)",
//                       boxShadow: 3,
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: { xs: "100%", md: "8px" },
//                       height: { xs: "8px", md: "auto" },
//                       backgroundColor: (theme) => theme.palette[getStatusColor(submission.status)].main,
//                     }}
//                   />
//                   <CardContent sx={{ flexGrow: 1, p: 3 }}>
//                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
//                       <Box>
//                         <Typography variant="h6" component="h2" gutterBottom>
//                           {submission?.submittedBy || "Unnamed Borrower"}
//                         </Typography>
//                         <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                           <BusinessIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
//                           <Typography variant="body2" color="text.secondary">
//                             {submission?.borrowerDetails?.borrowerConstitution || "N/A"}
//                           </Typography>
//                         </Box>
//                       </Box>
//                       <Chip
//                         label={submission.status || "pending"}
//                         color={getStatusColor(submission.status)}
//                         size="small"
//                       />
//                     </Box>

//                     <Divider sx={{ my: 2 }} />

//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6}>
//                         <Box sx={{ display: "flex", alignItems: "center" }}>
//                           <AccessTimeIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
//                           <Typography variant="body2" color="text.secondary">
//                             Submitted: {formatDate(submission.submittedAt)}
//                           </Typography>
//                         </Box>
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <Box sx={{ display: "flex", alignItems: "center" }}>
//                           <DescriptionIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
//                           <Typography variant="body2" color="text.secondary">
//                             ID: {submission.id.substring(0, 8)}...
//                           </Typography>
//                         </Box>
//                       </Grid>
//                     </Grid>
//                   </CardContent>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: { xs: "row", md: "column" },
//                       justifyContent: "center",
//                       alignItems: "justify",
//                       p: 2,
//                       backgroundColor: "background.default",
//                       gap: 1.5,
//                     }}
//                   >
                    
//                     <Button
//                       variant="contained"
//                       onClick={() => setAssigningStatus(submission.id)}
//                       sx={{
//                         minWidth: { xs: "auto", md: "120px" },
//                         width: { xs: "100%", md: "auto" },
//                       }}
//                     >
//                      change Status
//                     </Button>

//                     <Button
//                       variant="contained"
//                       onClick={() => setAssigningSubmissionId(submission.id)}
//                       sx={{
//                         minWidth: { xs: "auto", md: "120px" },
//                         width: { xs: "100%", md: "auto" },
//                       }}
//                     >
//                      Assign Reviewer
//                     </Button>
//                     <Button
//                       variant="contained"
//                       onClick={() => handleViewDetails(submission.id)}
//                       sx={{
//                         minWidth: { xs: "auto", md: "120px" },
//                         width: { xs: "100%", md: "auto" },
//                       }}
//                     >
//                      view Details
//                     </Button>
//                   </Box>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </Paper>

//       {assigningSubmissionId && (
//         <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", bgcolor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <Paper sx={{ p: 4, minWidth: 300 }}>
//             <Typography variant="h6" gutterBottom>Assign Reviewer</Typography>
//             <FormControl fullWidth sx={{ mb: 2 }}>
//               <InputLabel id="reviewer-select-label">Reviewer</InputLabel>
//               <Select
//                 labelId="reviewer-select-label"
//                 value={selectedReviewer}
//                 onChange={(e) => setSelectedReviewer(e.target.value)}
//                 label="Reviewer"
//               >
//                 {reviewers.map((user) => (
//                   <MenuItem key={user.uid} value={user.uid}>
//                     {user.name || user.email || user.uid}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <Button onClick={() => setAssigningSubmissionId(null)}>Cancel</Button>
//               <Button onClick={handleAssignReviewer} variant="contained" disabled={!selectedReviewer}>
//                 Assign
//               </Button>
//             </Box>
//           </Paper>
//         </Box>
//       )}

// {assigningStatus && (
//         <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", bgcolor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <Paper sx={{ p: 4, minWidth: 300 }}>
//             <Typography variant="h6" gutterBottom>Assign status</Typography>
//             <FormControl fullWidth sx={{ mb: 2 }}>
//               <InputLabel id="status-select-label">status</InputLabel>
//               <Select
//                 labelId="status-select-label"
//                 value={assigningStatus?? ""}
//                 onChange={(e) => setAssigningStatus(e.target.value)}
//                 label="status"
//                 displayEmpty
//                 fullWidth
//               >
//               <MenuItem value="" disabled>
//     Select status
//   </MenuItem>
//   <MenuItem key="pending" value="pending">Pending</MenuItem>
//   <MenuItem key="under-review"value="under-review">Under Review</MenuItem>
//   <MenuItem key = "approved"value="approved">Approved</MenuItem>
//   <MenuItem key="rejected"value="rejected">Rejected</MenuItem>
//               </Select>
//             </FormControl>
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <Button onClick={() => setAssigningStatus(null)}>Cancel</Button>
//               <Button onClick={handleAssignStatus} variant="contained" disabled={!assigningStatus}>
//                 Set
//               </Button>
//             </Box>
//           </Paper>
//         </Box>
//       )}
//     </Container>
//   )

  
// }

// export default AdminDocumentsList


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
import { doc, query, where, updateDoc } from "firebase/firestore"
import { arrayUnion, increment } from "firebase/firestore"

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
      await updateDoc(doc(db, "submissions", assigningSubmissionId), {
        reviewer: selectedReviewer,
      })

      await updateDoc(doc(db, "users", selectedReviewer), {
        assignedCount: increment(1),
        filesAssigned: arrayUnion(assigningSubmissionId),
      })

      fetchSubmissions()
      setAssigningSubmissionId(null)
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

      fetchSubmissions()
      setAssigningSubmissionId(null)
      setAssigningStatus("")
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
                            ID: {submission.id.substring(0, 8)}...
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
                      alignItems: "justify",
                      p: 2,
                      backgroundColor: "background.default",
                      gap: 1.5,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        setAssigningSubmissionId(submission.id)
                        setAssigningStatus("pending")
                      }}
                      sx={{
                        minWidth: { xs: "auto", md: "120px" },
                        width: { xs: "100%", md: "auto" },
                      }}
                    >
                      Change Status
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => setAssigningSubmissionId(submission.id)}
                      sx={{
                        minWidth: { xs: "auto", md: "120px" },
                        width: { xs: "100%", md: "auto" },
                      }}
                    >
                      Assign Reviewer
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleViewDetails(submission.id)}
                      sx={{
                        minWidth: { xs: "auto", md: "120px" },
                        width: { xs: "100%", md: "auto" },
                      }}
                    >
                      view Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {assigningSubmissionId && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper sx={{ p: 4, minWidth: 300 }}>
            <Typography variant="h6" gutterBottom>
              Assign Reviewer
            </Typography>
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
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button onClick={() => setAssigningSubmissionId(null)}>Cancel</Button>
              <Button onClick={handleAssignReviewer} variant="contained" disabled={!selectedReviewer}>
                Assign
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {assigningSubmissionId && assigningStatus && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper sx={{ p: 4, minWidth: 300 }}>
            <Typography variant="h6" gutterBottom>
              Assign status
            </Typography>
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
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={() => {
                  setAssigningSubmissionId(null)
                  setAssigningStatus("")
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAssignStatus} variant="contained">
                Set
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  )
}

export default AdminDocumentsList
