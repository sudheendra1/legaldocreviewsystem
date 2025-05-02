// "use client"

// import { useState, useEffect } from "react"
// import { Redirect } from "react-router-dom"
// import { db } from "../firebase/config"
// import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
// import { useAuth } from "../contexts/AuthContext"
// // import { Button, Card, CardContent, Typography, TextField, CircularProgress, Container, Box } from "@mui/material"
// import {
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   CircularProgress,
//   Container,
//   Box,
//   Alert,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   Link,
// } from "@mui/material"
// // import { redirect } from "next/navigation"

// // function ReviewDocuments() {
// //   // const [documents, setDocuments] = useState([])
// //   const [submissions, setSubmissions] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState(null)
// //   const { currentUser } = useAuth()

// //   useEffect(() => {
// //     const fetchDocuments = async () => {
// //       setLoading(true)
// //       setError(null)
// //       try {
// //         const q = query(collection(db, "documents"), where("status", "==", "pending"))
// //         const querySnapshot = await getDocs(q)
// //         const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
// //         setDocuments(docs)
// //       } catch (err) {
// //         console.error("Error fetching documents: ", err)
// //         setError("Failed to fetch documents. Please try again.")
// //       }
// //       setLoading(false)
// //     }

// //     fetchDocuments()
// //   }, [])
// function ReviewDocuments() {
//   const [submissions, setSubmissions] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const { currentUser, loading: authLoading } = useAuth()
//   // const [redirecting, setRedirecting] = useState(false)
//   useEffect(() => {
//     if (authLoading) {
//       return // Do nothing until auth is loaded
//     }

//     if (!currentUser) {
//       // setRedirecting(true)
//       // return // Redirect after authLoading is false
//       return // Will redirect in render
//     }

//     const fetchSubmissions = async () => {
//       setLoading(true)
//       setError(null)
//       try {
//         const q = query(collection(db, "submissions"), where("status", "==", "pending"))
//         const querySnapshot = await getDocs(q)
//         const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//         setSubmissions(docs)
//       } catch (err) {
//         console.error("Error fetching submissions: ", err)
//         setError("Failed to fetch submissions. Please try again.")
//       }
//       setLoading(false)
//     }

//     fetchSubmissions()
//   }, [currentUser, authLoading])
//   const handleReview = async (id, status, comments) => {
//     try {
//       // await updateDoc(doc(db, "documents", id), {
//         await updateDoc(doc(db, "submissions", id), {
//         status,
//         reviewedBy: currentUser.uid,
//         reviewedAt: new Date(),
//         comments,
//       })

//       // setDocuments(documents.filter((doc) => doc.id !== id))
//       setSubmissions(submissions.filter((submission) => submission.id !== id))

//     } catch (err) {
//       console.error("Error updating document: ", err)
//       setError("Failed to update document status. Please try again.")
//     }
//   }

//   if (authLoading) {
//     return (
//       <Container component="main" maxWidth="md">
//         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//           <CircularProgress />
//         </Box>
//       </Container>
//     )
//   }

//   // if (redirecting) {
//   //   redirect("/login")
//     if (!currentUser) {
//       return <Redirect to="/login" />
//   }

// //   if (loading) {
// //     return <CircularProgress />
// //   }

// //   if (error) {
// //     return <Typography color="error">{error}</Typography>
// //   }

// //   return (
// //     <Container component="main" maxWidth="md">
// //       <Box
// //         sx={{
// //           marginTop: 8,
// //           display: "flex",
// //           flexDirection: "column",
// //           alignItems: "center",
// //         }}
// //       >
// //         <Typography component="h1" variant="h4" gutterBottom>
// //           Review Documents
// //         </Typography>
// //         {documents.map((doc) => (
// //           <Card key={doc.id} sx={{ width: "100%", mb: 2 }}>
// //             <CardContent>
// //               <Typography variant="h6">{doc.fileName}</Typography>
// //               <Typography>Borrower: {doc.borrowerName}</Typography>
// //               <Typography>Constitution: {doc.borrowerConstitution}</Typography>
// //               <Typography>Loan Facility: {doc.loanFacility}</Typography>
// //               <Typography>Document Type: {doc.documentType}</Typography>
// //               <Button href={doc.fileUrl} target="_blank" rel="noopener noreferrer" sx={{ mt: 1, mb: 1 }}>
// //                 View Document
// //               </Button>
// //               <TextField
// //                 fullWidth
// //                 margin="normal"
// //                 label="Comments"
// //                 multiline
// //                 rows={4}
// //                 variant="outlined"
// //                 onChange={(e) => (doc.comments = e.target.value)}
// //               />
// //               <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
// //                 <Button
// //                   onClick={() => handleReview(doc.id, "approved", doc.comments)}
// //                   color="primary"
// //                   variant="contained"
// //                 >
// //                   Approve
// //                 </Button>
// //                 <Button
// //                   onClick={() => handleReview(doc.id, "rejected", doc.comments)}
// //                   color="secondary"
// //                   variant="contained"
// //                 >
// //                   Reject
// //                 </Button>
// //               </Box>
// //             </CardContent>
// //           </Card>
// //         ))}
// //       </Box>
// //     </Container>
// //   )
// // }
// if (loading) {
//   return (
//     <Container component="main" maxWidth="md">
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
//         <CircularProgress />
//       </Box>
//     </Container>
//   )
// }

// if (error) {
//   return (
//     <Container component="main" maxWidth="md">
//       <Box sx={{ mt: 8 }}>
//         <Alert severity="error">{error}</Alert>
//       </Box>
//     </Container>
//   )
// }

// return (
//   <Container component="main" maxWidth="md">
//     <Box sx={{ mt: 8 }}>
//       <Typography component="h1" variant="h4" align="center" gutterBottom>
//         Review Documents
//       </Typography>

//       {submissions.length === 0 ? (
//         <Alert severity="info">No pending submissions to review.</Alert>
//       ) : (
//         submissions.map((submission) => (
//           <Card key={submission.id} sx={{ mb: 4 }}>
//             <CardContent>
//               <Typography variant="h6">Submission ID: {submission.id}</Typography>
//               <Typography variant="body2" color="text.secondary" gutterBottom>
//                 Submitted: {submission.submittedAt?.toDate().toLocaleString()}
//               </Typography>

//               <Divider sx={{ my: 2 }} />

//               <Typography variant="subtitle1" gutterBottom>
//                 Borrower Details
//               </Typography>
//               {submission.documents.borrowerDetails && (
//                 <Typography variant="body2">
//                   Constitution: {submission.documents.borrowerDetails.borrowerConstitution}
//                 </Typography>
//               )}

//               <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
//                 Documents
//               </Typography>
//               <List dense>
//                 {submission.mongoDBFiles &&
//                   submission.mongoDBFiles.map((file, index) => (
//                     <ListItem key={index}>
//                       <ListItemText
//                         primary={file.originalName}
//                         secondary={`Category: ${file.category} | Type: ${file.documentType}`}
//                       />
//                       {/* <Link href={getFileFromMongoDB(file.filename)} target="_blank" rel="noopener noreferrer">
//                         <Button variant="outlined" size="small">
//                           View
//                         </Button>
//                       </Link> */}
//                     </ListItem>
//                   ))}
//               </List>

//               <TextField
//                 fullWidth
//                 margin="normal"
//                 label="Comments"
//                 multiline
//                 rows={4}
//                 variant="outlined"
//                 onChange={(e) => (submission.comments = e.target.value)}
//               />

//               <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
//                 <Button
//                   onClick={() => handleReview(submission.id, "approved", submission.comments)}
//                   color="primary"
//                   variant="contained"
//                 >
//                   Approve
//                 </Button>
//                 <Button
//                   onClick={() => handleReview(submission.id, "rejected", submission.comments)}
//                   color="secondary"
//                   variant="contained"
//                 >
//                   Reject
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         ))
//       )}
//     </Box>
//   </Container>
// )
// }

// export default ReviewDocuments



"use client"

import { useState, useEffect } from "react"
import { Redirect } from "react-router-dom"
import { db } from "../firebase/config"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import { useAuth } from "../contexts/AuthContext"
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
  Container,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Skeleton,
  Tabs,
  Tab,
  Badge,
  Collapse,
  CardHeader,
  CardActions,
} from "@mui/material"
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  MoreVert as MoreVertIcon,
  AccessTime as AccessTimeIcon,
  Business as BusinessIcon,
} from "@mui/icons-material"

function ReviewDocuments() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser, loading: authLoading } = useAuth()
  const [activeSubmission, setActiveSubmission] = useState(null)
  const [comments, setComments] = useState({})
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null, action: null })
  const [tabValue, setTabValue] = useState(0)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    if (authLoading) {
      return // Do nothing until auth is loaded
    }

    if (!currentUser) {
      return // Will redirect in render
    }

    const fetchSubmissions = async () => {
      setLoading(true)
      setError(null)
      try {
        const q = query(collection(db, "submissions"), where("status", "==", "pending"))
        const querySnapshot = await getDocs(q)
        const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setSubmissions(docs)

        // Initialize comments state
        const initialComments = {}
        docs.forEach((doc) => {
          initialComments[doc.id] = ""
        })
        setComments(initialComments)
      } catch (err) {
        console.error("Error fetching submissions: ", err)
        setError("Failed to fetch submissions. Please try again.")
      }
      setLoading(false)
    }

    fetchSubmissions()
  }, [currentUser, authLoading])

  const handleReview = async (id, status) => {
    try {
      setConfirmDialog({ open: false, id: null, action: null })

      await updateDoc(doc(db, "submissions", id), {
        status,
        reviewedBy: currentUser.uid,
        reviewedAt: new Date(),
        comments: comments[id],
      })

      setSubmissions(submissions.filter((submission) => submission.id !== id))

      // Show success message
      const actionText = status === "approved" ? "approved" : "rejected"
      const successMessage = `Document successfully ${actionText}.`
      // You could add a toast notification here
    } catch (err) {
      console.error("Error updating document: ", err)
      setError("Failed to update document status. Please try again.")
    }
  }

  const handleCommentChange = (id, value) => {
    setComments((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleConfirmDialog = (id, action) => {
    setConfirmDialog({
      open: true,
      id,
      action,
    })
  }

  const handleCloseDialog = () => {
    setConfirmDialog({
      open: false,
      id: null,
      action: null,
    })
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
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
    if (!timestamp) return "N/A"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
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
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (!currentUser) {
    return <Redirect to="/login" />
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Document Review Portal
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Review and approve or reject submitted documents. Provide detailed feedback for any rejections.
          </Typography>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }} variant="fullWidth">
            <Tab
              label={
                <Badge badgeContent={submissions.length} color="primary" showZero>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AccessTimeIcon sx={{ mr: 1 }} />
                    <Typography>Pending Review</Typography>
                  </Box>
                </Badge>
              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  <Typography>Approved</Typography>
                </Box>
              }
              disabled
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CancelIcon sx={{ mr: 1 }} />
                  <Typography>Rejected</Typography>
                </Box>
              }
              disabled
            />
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ mt: 4 }}>
            {[1, 2, 3].map((item) => (
              <Paper key={item} sx={{ mb: 3, p: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                  <Box sx={{ width: "100%" }}>
                    <Skeleton variant="text" width="60%" height={30} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </Box>
                </Box>
                <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Skeleton variant="rectangular" width={100} height={36} sx={{ mr: 1 }} />
                  <Skeleton variant="rectangular" width={100} height={36} />
                </Box>
              </Paper>
            ))}
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{
              mt: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
            }}
            action={
              <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : submissions.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              backgroundColor: "background.default",
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <DescriptionIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No pending submissions
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400, mb: 3 }}>
              There are no documents waiting for your review at this time. Check back later or refresh the page.
            </Typography>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {submissions.map((submission) => (
              <Grid item xs={12} key={submission.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {(submission.submittedBy?.charAt(0) || "U").toUpperCase()}
                      </Avatar>
                    }
                    title={<Typography variant="h6">{submission.submittedBy || "Unknown Submitter"}</Typography>}
                    subheader={
                      <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          Submitted: {formatDate(submission.submittedAt)}
                        </Typography>
                      </Box>
                    }
                    action={
                      <Box>
                        <Chip
                          label={submission.status || "pending"}
                          color={getStatusColor(submission.status)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <IconButton onClick={() => toggleExpand(submission.id)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    }
                  />

                  <Collapse in={expandedId === submission.id} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Submission Details
                      </Typography>

                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <BusinessIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                            <Typography variant="body2">
                              Constitution: {submission.documents?.borrowerDetails?.borrowerConstitution || "N/A"}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <DescriptionIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                            <Typography variant="body2">ID: {submission.id.substring(0, 8)}...</Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {submission.mongoDBFiles && submission.mongoDBFiles.length > 0 && (
                        <>
                          <Typography variant="subtitle1" gutterBottom>
                            Documents
                          </Typography>
                          <List dense sx={{ bgcolor: "background.default", borderRadius: 1, mb: 2 }}>
                            {submission.mongoDBFiles.map((file, index) => (
                              <ListItem key={index} divider={index < submission.mongoDBFiles.length - 1}>
                                <ListItemText
                                  primary={file.originalName}
                                  secondary={`Category: ${file.category} | Type: ${file.documentType}`}
                                />
                                <Tooltip title="View Document">
                                  <IconButton edge="end" size="small">
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}

                      <TextField
                        fullWidth
                        label="Review Comments"
                        multiline
                        rows={3}
                        value={comments[submission.id] || ""}
                        onChange={(e) => handleCommentChange(submission.id, e.target.value)}
                        placeholder="Add your comments here..."
                        variant="outlined"
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: <CommentIcon color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                    </CardContent>
                  </Collapse>

                  <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleConfirmDialog(submission.id, "approve")}
                      startIcon={<CheckCircleIcon />}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleConfirmDialog(submission.id, "reject")}
                      startIcon={<CancelIcon />}
                      sx={{ ml: 1 }}
                    >
                      Reject
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Fade}
      >
        <DialogTitle id="alert-dialog-title">
          {confirmDialog.action === "approve" ? "Approve Document?" : "Reject Document?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmDialog.action === "approve"
              ? "Are you sure you want to approve this document? This action cannot be undone."
              : "Are you sure you want to reject this document? This action cannot be undone."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => handleReview(confirmDialog.id, confirmDialog.action === "approve" ? "approved" : "rejected")}
            color={confirmDialog.action === "approve" ? "primary" : "error"}
            variant="contained"
            autoFocus
          >
            {confirmDialog.action === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

// Add missing RefreshIcon
const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
  </svg>
)

export default ReviewDocuments
