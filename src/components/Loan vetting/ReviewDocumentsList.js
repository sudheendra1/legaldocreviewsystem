// // "use client"

// // import { useState, useEffect } from "react"
// // import { collection, getDocs } from "firebase/firestore"
// // import { db } from "../firebase/config"
// // import { useHistory, Redirect } from "react-router-dom"
// // import {
// //   Container,
// //   Typography,
// //   Grid,
// //   Card,
// //   CardContent,
// //   Button,
// //   CircularProgress,
// //   Box,
// //   Alert,
// //   Chip,
// //   TextField,
// //   InputAdornment,
// //   Divider,
// //   Paper,
// //   IconButton,
// //   Menu,
// //   MenuItem,
// //   Select,
// //   FormControl,
// //   InputLabel,
// // } from "@mui/material"
// // import { useAuth } from "../contexts/AuthContext"
// // import SearchIcon from "@mui/icons-material/Search"
// // import DescriptionIcon from "@mui/icons-material/Description"
// // import AccessTimeIcon from "@mui/icons-material/AccessTime"
// // import BusinessIcon from "@mui/icons-material/Business"
// // import MoreVertIcon from "@mui/icons-material/MoreVert"
// // import RefreshIcon from "@mui/icons-material/Refresh"
// // import { doc, getDoc, query, where } from "firebase/firestore"

// // function ReviewDocumentsList() {
// //   const [submissions, setSubmissions] = useState([])
// //   const [filteredSubmissions, setFilteredSubmissions] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState(null)
// //   const [searchTerm, setSearchTerm] = useState("")
// //   const [filterStatus, setFilterStatus] = useState("all")
// //   const [anchorEl, setAnchorEl] = useState(null)
// //   const { currentUser, loading: authLoading } = useAuth()
// //   const history = useHistory()

// //   useEffect(() => {
// //     if (authLoading) return
// //     if (!currentUser) return 

// //     fetchSubmissions()
// //   }, [currentUser, authLoading])

// //   useEffect(() => {
  
// //     if (submissions.length > 0) {
// //       let filtered = [...submissions]

    
// //       if (searchTerm) {
// //         filtered = filtered.filter(
// //           (submission) =>
// //             (submission?.borrowerDetails?.borrowerConstitution || "")
// //               .toLowerCase()
// //               .includes(searchTerm.toLowerCase()) ||
// //             (submission?.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
// //             (submission?.borrowerDetails?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
// //         )
// //       }

      
// //       if (filterStatus !== "all") {
// //         filtered = filtered.filter((submission) => (submission?.status || "pending") === filterStatus)
// //       }

// //       setFilteredSubmissions(filtered)
// //     } else {
// //       setFilteredSubmissions([])
// //     }
// //   }, [searchTerm, filterStatus, submissions])

// //   const fetchSubmissions = async () => {
// //     setLoading(true)
// //     setError(null)
// //     try {
// //       // const querySnapshot = await getDocs(collection(db, "submissions"))
// //       const q = query(
// //               collection(db, "submissions"),
// //               where("reviewer", "==", currentUser.uid)
// //             )
// //             const querySnapshot = await getDocs(q)
// //       const data = querySnapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         time:doc.data().time,
// //         submittedBy: doc.data().submittedBy,
// //         status: doc.data().status,
// //         ...doc.data(),
// //         // Add default status if not present
// //         status: doc.data().status || "pending",
// //         // Add timestamp for sorting if not present
// //         createdAt: doc.data().createdAt || { seconds: 0 },
// //       }))

// //       // Sort by creation date (newest first)
// //       data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)

// //       setSubmissions(data)
// //       setFilteredSubmissions(data)
// //     } catch (err) {
// //       console.error("Error fetching submissions: ", err)
// //       setError("Failed to fetch submissions. Please try again.")
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handleViewDetails = (id) => {
// //     history.push(`/review/${id}`)
// //   }

// //   const handleMenuClick = (event) => {
// //     setAnchorEl(event.currentTarget)
// //   }

// //   const handleMenuClose = () => {
// //     setAnchorEl(null)
// //   }

// //   const handleRefresh = () => {
// //     fetchSubmissions()
// //     handleMenuClose()
// //   }

// //   const getStatusColor = (status) => {
// //     switch (status) {
// //       case "approved":
// //         return "success"
// //       case "rejected":
// //         return "error"
// //       case "pending":
// //         return "warning"
// //       case "under-review":
// //         return "info"
// //       default:
// //         return "default"
// //     }
// //   }

// //   const formatDate = (timestamp) => {
// //     if (!timestamp || !timestamp.seconds) return "N/A"
// //     const date = new Date(timestamp.seconds * 1000)
// //     return date.toLocaleDateString("en-US", {
// //       year: "numeric",
// //       month: "short",
// //       day: "numeric",
// //     })
// //   }

// //   if (authLoading) {
// //     return (
// //       <Box sx={{ display: "flex", justifyContent: "center", height: "100vh", alignItems: "center" }}>
// //         <CircularProgress />
// //       </Box>
// //     )
// //   }

// //   if (!currentUser) {
// //     return <Redirect to="/login" />
// //   }

// //   if (loading) {
// //     return (
// //       <Box
// //         sx={{
// //           display: "flex",
// //           flexDirection: "column",
// //           justifyContent: "center",
// //           alignItems: "center",
// //           height: "50vh",
// //         }}
// //       >
// //         <CircularProgress size={60} thickness={4} />
// //         <Typography variant="h6" sx={{ mt: 2 }}>
// //           Loading submissions...
// //         </Typography>
// //       </Box>
// //     )
// //   }

// //   return (
// //     <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
// //       <Paper
// //         elevation={0}
// //         sx={{
// //           p: 3,
// //           borderRadius: 2,
// //           backgroundColor: "background.paper",
// //           border: "1px solid",
// //           borderColor: "divider",
// //         }}
// //       >
// //         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
// //           <Typography variant="h4" component="h1" fontWeight="bold">
// //             Document Submissions
// //           </Typography>
// //           <Box>
// //             <IconButton onClick={handleMenuClick}>
// //               <MoreVertIcon />
// //             </IconButton>
// //             <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
// //               <MenuItem onClick={handleRefresh}>
// //                 <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
// //                 Refresh
// //               </MenuItem>
// //             </Menu>
// //           </Box>
// //         </Box>

// //         <Box
// //           sx={{
// //             display: "flex",
// //             flexDirection: { xs: "column", sm: "row" },
// //             gap: 2,
// //             mb: 4,
// //             alignItems: { xs: "stretch", sm: "center" },
// //           }}
// //         >
// //           <TextField
// //             placeholder="Search submissions..."
// //             variant="outlined"
// //             fullWidth
// //             size="small"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             InputProps={{
// //               startAdornment: (
// //                 <InputAdornment position="start">
// //                   <SearchIcon />
// //                 </InputAdornment>
// //               ),
// //             }}
// //             sx={{ flexGrow: 1 }}
// //           />

// //           <FormControl size="small" sx={{ minWidth: 150 }}>
// //             <InputLabel id="status-filter-label">Status</InputLabel>
// //             <Select
// //               labelId="status-filter-label"
// //               id="status-filter"
// //               value={filterStatus}
// //               label="Status"
// //               onChange={(e) => setFilterStatus(e.target.value)}
// //             >
// //               <MenuItem value="all">All Status</MenuItem>
// //               <MenuItem value="pending">Pending</MenuItem>
// //               <MenuItem value="approved">Approved</MenuItem>
// //               <MenuItem value="rejected">Rejected</MenuItem>
// //             </Select>
// //           </FormControl>
// //         </Box>

// //         {error && (
// //           <Alert severity="error" sx={{ mb: 3 }}>
// //             {error}
// //             <Button size="small" onClick={fetchSubmissions} sx={{ ml: 2 }}>
// //               Retry
// //             </Button>
// //           </Alert>
// //         )}

// //         {filteredSubmissions.length === 0 ? (
// //           <Box
// //             sx={{
// //               display: "flex",
// //               flexDirection: "column",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               py: 8,
// //               backgroundColor: "background.default",
// //               borderRadius: 2,
// //             }}
// //           >
// //             <DescriptionIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
// //             <Typography variant="h6" color="text.secondary" gutterBottom>
// //               No submissions found
// //             </Typography>
// //             <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400, mb: 3 }}>
// //               {searchTerm || filterStatus !== "all"
// //                 ? "Try adjusting your search or filter criteria"
// //                 : "There are no document submissions to review at this time"}
// //             </Typography>
// //             {(searchTerm || filterStatus !== "all") && (
// //               <Button
// //                 variant="outlined"
// //                 onClick={() => {
// //                   setSearchTerm("")
// //                   setFilterStatus("all")
// //                 }}
// //               >
// //                 Clear Filters
// //               </Button>
// //             )}
// //           </Box>
// //         ) : (
// //           <Grid container spacing={3}>
// //             {filteredSubmissions.map((submission) => (
// //               <Grid item xs={12} key={submission.id}>
// //                 <Card
// //                   sx={{
// //                     display: "flex",
// //                     flexDirection: { xs: "column", md: "row" },
// //                     overflow: "hidden",
// //                     transition: "transform 0.2s, box-shadow 0.2s",
// //                     "&:hover": {
// //                       transform: "translateY(-2px)",
// //                       boxShadow: 3,
// //                     },
// //                   }}
// //                 >
// //                   <Box
// //                     sx={{
// //                       width: { xs: "100%", md: "8px" },
// //                       height: { xs: "8px", md: "auto" },
// //                       backgroundColor: (theme) => theme.palette[getStatusColor(submission.status)].main,
// //                     }}
// //                   />
// //                   <CardContent sx={{ flexGrow: 1, p: 3 }}>
// //                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
// //                       <Box>
// //                         <Typography variant="h6" component="h2" gutterBottom>
// //                           {submission?.submittedBy || "Unnamed Borrower"}
// //                         </Typography>
// //                         <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
// //                           <BusinessIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
// //                           <Typography variant="body2" color="text.secondary">
// //                             {submission?.borrowerDetails?.borrowerConstitution || "N/A"}
// //                           </Typography>
// //                         </Box>
// //                       </Box>
// //                       <Chip
// //                         label={submission.status || "pending"}
// //                         color={getStatusColor(submission.status)}
// //                         size="small"
// //                       />
// //                     </Box>

// //                     <Divider sx={{ my: 2 }} />

// //                     <Grid container spacing={2}>
// //                       <Grid item xs={12} sm={6}>
// //                         <Box sx={{ display: "flex", alignItems: "center" }}>
// //                           <AccessTimeIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
// //                           <Typography variant="body2" color="text.secondary">
// //                             Submitted: {formatDate(submission.submittedAt)}
// //                           </Typography>
// //                         </Box>
// //                       </Grid>
// //                       <Grid item xs={12} sm={6}>
// //                         <Box sx={{ display: "flex", alignItems: "center" }}>
// //                           <DescriptionIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
// //                           <Typography variant="body2" color="text.secondary">
// //                             ID: {submission.id.substring(0, 8)}...
// //                           </Typography>
// //                         </Box>
// //                       </Grid>
// //                     </Grid>
// //                   </CardContent>
// //                   <Box
// //                     sx={{
// //                       display: "flex",
// //                       flexDirection: { xs: "row", md: "column" },
// //                       justifyContent: "center",
// //                       alignItems: "center",
// //                       p: 2,
// //                       backgroundColor: "background.default",
// //                     }}
// //                   >
// //                     <Button
// //                       variant="contained"
// //                       onClick={() => handleViewDetails(submission.id)}
// //                       sx={{
// //                         minWidth: { xs: "auto", md: "120px" },
// //                         width: { xs: "100%", md: "auto" },
// //                       }}
// //                     >
// //                       Review
// //                     </Button>
// //                   </Box>
// //                 </Card>
// //               </Grid>
// //             ))}
// //           </Grid>
// //         )}
// //       </Paper>
// //     </Container>
// //   )
// // }

// // export default ReviewDocumentsList


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
//   Tooltip,
//   Avatar,
//   Badge,
//   Tabs,
//   Tab,
//   Fade,
// } from "@mui/material"
// import { useAuth } from "../contexts/AuthContext"
// import SearchIcon from "@mui/icons-material/Search"
// import DescriptionIcon from "@mui/icons-material/Description"
// import BusinessIcon from "@mui/icons-material/Business"
// import MoreVertIcon from "@mui/icons-material/MoreVert"
// import RefreshIcon from "@mui/icons-material/Refresh"
// import RateReviewIcon from "@mui/icons-material/RateReview"
// import FilterListIcon from "@mui/icons-material/FilterList"
// import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"
// import PendingActionsIcon from "@mui/icons-material/PendingActions"
// import { query, where } from "firebase/firestore"
// import CancelIcon from "@mui/icons-material/Cancel"

// function ReviewDocumentsList() {
//   const [submissions, setSubmissions] = useState([])
//   const [filteredSubmissions, setFilteredSubmissions] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterStatus, setFilterStatus] = useState("all")
//   const [anchorEl, setAnchorEl] = useState(null)
//   const { currentUser, loading: authLoading } = useAuth()
//   const history = useHistory()
//   const [tabValue, setTabValue] = useState(0)

//   useEffect(() => {
//     if (authLoading) return
//     if (!currentUser) return

//     fetchSubmissions()
//   }, [currentUser, authLoading])

//   useEffect(() => {
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
//             (submission?.submittedBy || "").toLowerCase().includes(searchTerm.toLowerCase())||
//             (submission?.submissionName || "").toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       }

//       // Apply status filter
//       if (filterStatus !== "all") {
//         filtered = filtered.filter((submission) => (submission?.status || "pending") === filterStatus)
//       }

//       // Apply tab filter
//       if (tabValue === 1) {
//         // Pending
//         filtered = filtered.filter((submission) => submission.status === "pending")
//       } else if (tabValue === 2) {
//         // In Progress
//         filtered = filtered.filter((submission) => submission.status === "under-review")
//       } else if (tabValue === 3) {
//         // Completed
//         filtered = filtered.filter((submission) => submission.status === "approved" || submission.status === "rejected")
//       }

//       setFilteredSubmissions(filtered)
//     } else {
//       setFilteredSubmissions([])
//     }
//   }, [searchTerm, filterStatus, submissions, tabValue])

//   const fetchSubmissions = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const q = query(collection(db, "submissions"), where("reviewer", "==", currentUser.uid))
//       const querySnapshot = await getDocs(q)
//       const data = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         time: doc.data().time,
//         submittedBy: doc.data().submittedBy,
//         status: doc.data().status,
//         submissionName: doc.data().name||"Unnamed Submission",
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

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue)
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "approved":
//         return "success"
//       case "rejected":
//         return "error"
//       case "pending":
//         return "warning"
//       case "under-review":
//         return "info"
//       default:
//         return "default"
//     }
//   }

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "approved":
//         return <AssignmentTurnedInIcon />
//       case "rejected":
//         return <CancelIcon />
//       case "pending":
//         return <PendingActionsIcon />
//       case "under-review":
//         return <RateReviewIcon />
//       default:
//         return <DescriptionIcon />
//     }
//   }

//   const formatDate = (timestamp) => {
//     if (!timestamp || !timestamp.seconds) return "N/A"
//     const date = new Date(timestamp.seconds * 1000)
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
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
//             My Review Queue
//           </Typography>
//           <Box>
//             <Tooltip title="Refresh">
//               <IconButton onClick={handleRefresh}>
//                 <RefreshIcon />
//               </IconButton>
//             </Tooltip>
//             <IconButton onClick={handleMenuClick}>
//               <MoreVertIcon />
//             </IconButton>
//             <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//               <MenuItem onClick={handleRefresh}>
//                 <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
//                 Refresh List
//               </MenuItem>
//             </Menu>
//           </Box>
//         </Box>

//         <Tabs
//           value={tabValue}
//           onChange={handleTabChange}
//           indicatorColor="primary"
//           textColor="primary"
//           variant="fullWidth"
//           sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
//         >
//           <Tab icon={<DescriptionIcon />} iconPosition="start" label="All" />
//           <Tab icon={<PendingActionsIcon />} iconPosition="start" label="Pending" />
//           <Tab icon={<RateReviewIcon />} iconPosition="start" label="In Progress" />
//           <Tab icon={<AssignmentTurnedInIcon />} iconPosition="start" label="Completed" />
//         </Tabs>

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
//               startAdornment={
//                 <InputAdornment position="start">
//                   <FilterListIcon fontSize="small" />
//                 </InputAdornment>
//               }
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
//               {searchTerm || filterStatus !== "all" || tabValue !== 0
//                 ? "Try adjusting your search or filter criteria"
//                 : "You don't have any documents assigned for review"}
//             </Typography>
//             {(searchTerm || filterStatus !== "all" || tabValue !== 0) && (
//               <Button
//                 variant="outlined"
//                 onClick={() => {
//                   setSearchTerm("")
//                   setFilterStatus("all")
//                   setTabValue(0)
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             )}
//           </Box>
//         ) : (
//           <Grid container spacing={3}>
//             {filteredSubmissions.map((submission) => (
//               <Grid item xs={12} sm={6} md={4} key={submission.id}>
//                 <Fade in={true} timeout={300}>
//                   <Card
//                     sx={{
//                       height: "100%",
//                       display: "flex",
//                       flexDirection: "column",
//                       transition: "transform 0.2s, box-shadow 0.2s",
//                       "&:hover": {
//                         transform: "translateY(-4px)",
//                         boxShadow: 3,
//                       },
//                       position: "relative",
//                       overflow: "visible",
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         position: "absolute",
//                         top: -10,
//                         right: 20,
//                         zIndex: 1,
//                       }}
//                     >
//                       <Badge
//                         overlap="circular"
//                         badgeContent=" "
//                         color={getStatusColor(submission.status)}
//                         variant="dot"
//                         sx={{
//                           "& .MuiBadge-badge": {
//                             height: "16px",
//                             width: "16px",
//                             borderRadius: "50%",
//                           },
//                         }}
//                       >
//                         <Avatar
//                           sx={{
//                             bgcolor: "background.paper",
//                             border: "2px solid",
//                             borderColor: (theme) => theme.palette[getStatusColor(submission.status)].main,
//                             color: (theme) => theme.palette[getStatusColor(submission.status)].main,
//                           }}
//                         >
//                           {submission?.submittedBy?.charAt(0).toUpperCase() || "U"}
//                         </Avatar>
//                       </Badge>
//                     </Box>
//                     <CardContent sx={{ flexGrow: 1, pt: 4 }}>
//                       <Typography variant="h6" component="h2" gutterBottom noWrap>
//                         {submission?.submissionName || "Unnamed Submission"}
//                       </Typography>
//                       <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                         <BusinessIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
//                         <Typography variant="body2" color="text.secondary" noWrap>
//                           {submission?.borrowerDetails?.borrowerConstitution || "N/A"}
//                         </Typography>
//                       </Box>

//                       <Divider sx={{ my: 2 }} />

//                       <Box sx={{ mb: 1 }}>
//                         <Typography variant="body2" color="text.secondary" gutterBottom>
//                           Status
//                         </Typography>
//                         <Chip
//                           label={submission.status || "pending"}
//                           color={getStatusColor(submission.status)}
//                           size="small"
//                           sx={{ fontWeight: "medium" }}
//                         />
//                       </Box>

//                       <Box sx={{ mb: 1 }}>
//                         <Typography variant="body2" color="text.secondary" gutterBottom>
//                           Submitted
//                         </Typography>
//                         <Typography variant="body2" fontWeight="medium">
//                           {formatDate(submission.submittedAt)}
//                         </Typography>
//                       </Box>

//                       <Box>
//                         <Typography variant="body2" color="text.secondary" gutterBottom>
//                           Submitted By:
//                         </Typography>
//                         <Typography variant="body2" fontWeight="medium" noWrap>
//                           {submission.submittedBy || "Unnamed Borrower"}
//                         </Typography>
//                       </Box>
//                     </CardContent>
//                     <Divider />
//                     <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
//                       <Button
//                         variant="contained"
//                         onClick={() => handleViewDetails(submission.id)}
//                         startIcon={<RateReviewIcon />}
//                         fullWidth
//                       >
//                         Review Document
//                       </Button>
//                     </Box>
//                   </Card>
//                 </Fade>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </Paper>
//     </Container>
//   )
// }

// export default ReviewDocumentsList

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

  useEffect(() => {
    if (authLoading) return
    if (!currentUser) return

    fetchSubmissions()
  }, [currentUser, authLoading])

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

  const fetchSubmissions = async () => {
    setLoading(true)
    setError(null)
    try {
      const q = query(collection(db, "submissions"), where("reviewer", "==", currentUser.uid))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        time: doc.data().time,
        submittedBy: doc.data().submittedBy,
        status: doc.data().status || "pending",
        submissionName: doc.data().name || "Unnamed Submission",
        ...doc.data(),
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
      </Paper>
    </Container>
  )
}

export default ReviewDocumentsList
