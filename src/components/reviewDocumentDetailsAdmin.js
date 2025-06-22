// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useHistory } from "react-router-dom"
// import { getDoc, setDoc } from "firebase/firestore"
// import { collection, getDocs } from "firebase/firestore"
// import { db } from "../firebase/config"
// import { doc, query, where, updateDoc } from "firebase/firestore"
// import {
//   Container,
//   Typography,
//   Box,
//   Paper,
//   CircularProgress,
//   Button,
//   Alert,
//   IconButton,
//   Grid,
//   useMediaQuery,
//   useTheme,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
// } from "@mui/material"
// import { useFormData } from "./FormDataManager"
// import { useAuth } from "../contexts/AuthContext"
// import ArrowBackIcon from "@mui/icons-material/ArrowBack"
// import ImageIcon from "@mui/icons-material/Image"
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
// import VisibilityIcon from "@mui/icons-material/Visibility"
// import SectionHeader from "./sectionHeader"
// import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
// import CloseIcon from "@mui/icons-material/Close"
// import { arrayUnion, increment, arrayRemove } from "firebase/firestore"
// import UpdateIcon from "@mui/icons-material/Update"

// function DocumentTitle({ url, path }) {
//   const [isExpanded, setIsExpanded] = useState(false)
//   const isPdf = url.toLowerCase().includes(".pdf")

//   // Extract filename from URL
//   const filename = url.split("/").pop().split("?")[0]

//   const toggleExpand = () => {
//     setIsExpanded(!isExpanded)
//   }

//   return (
//     <Box sx={{ my: 1 }}>
//       <Paper
//         elevation={1}
//         sx={{
//           p: 2,
//           cursor: "pointer",
//           "&:hover": {
//             bgcolor: "rgba(0, 0, 0, 0.04)",
//           },
//         }}
//         onClick={toggleExpand}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             {isPdf ? <PictureAsPdfIcon color="error" sx={{ mr: 1 }} /> : <ImageIcon color="primary" sx={{ mr: 1 }} />}
//             <Typography variant="body1">{filename || "Document"}</Typography>
//           </Box>
//           <Button
//             variant="text"
//             size="small"
//             onClick={(e) => {
//               e.stopPropagation()
//               window.open(url, "_blank")
//             }}
//           >
//             <VisibilityIcon fontSize="small" />
//           </Button>
//         </Box>
//       </Paper>

//       {isExpanded && (
//         <Paper
//           elevation={0}
//           variant="outlined"
//           sx={{
//             mt: 1,
//             p: 0,
//             height: "80vh",
//             width: "100%",
//             position: "fixed",
//             top: "10vh",
//             left: 0,
//             right: 0,
//             zIndex: 1300,
//             margin: "0 auto",
//             maxWidth: "90%",
//             boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               p: 1,
//               bgcolor: "primary.main",
//               color: "white",
//             }}
//           >
//             <Typography variant="subtitle1">{filename || "Document"}</Typography>
//             <IconButton onClick={toggleExpand} sx={{ color: "white" }}>
//               <ArrowBackIcon />
//             </IconButton>
//           </Box>
//           <Box sx={{ height: "calc(100% - 48px)", overflow: "hidden" }}>
//             {isPdf ? (
//               <iframe src={url} width="100%" height="100%" style={{ border: "none" }} title="PDF Preview" />
//             ) : (
//               <Box
//                 sx={{
//                   height: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   bgcolor: "#f5f5f5",
//                 }}
//               >
//                 <img
//                   src={url || "/placeholder.svg"}
//                   alt="Document preview"
//                   style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
//                 />
//               </Box>
//             )}
//           </Box>
//         </Paper>
//       )}
//     </Box>
//   )
// }

// function ReviewDocumentDetailsAdmin() {
//   const { id } = useParams()
//   const [submission, setSubmission] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [activeStep, setActiveStep] = useState(0)
//   const [submitting, setSubmitting] = useState(false)
//   const history = useHistory()
//   const { formData, setFormData } = useFormData()
//   const { currentUser } = useAuth()
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"))
//   const [error, setError] = useState(null)
//   const [currentSubmission, setCurrentSubmission] = useState(null)
//   const [assigningSubmissionId, setAssigningSubmissionId] = useState(null)
//   const [selectedReviewer, setSelectedReviewer] = useState("")
//   const [openReviewerDialog, setOpenReviewerDialog] = useState(false)
//   const [reviewers, setReviewers] = useState([])
//   const [submissions, setSubmissions] = useState([])
//   const [filteredSubmissions, setFilteredSubmissions] = useState([])
//   const [openStatusDialog, setOpenStatusDialog] = useState(false)
//   const [assigningStatus, setAssigningStatus] = useState("pending")

//   const steps = [
//     "Borrower Details",
//     "Sanction Letter",
//     "Facilities",
//     "Securities",
//     "Registration of Security",
//     "Guarantors",
//     "Other Documents",
//   ]

//   const stepName = steps[activeStep]

//   const fetchSubmissions = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const querySnapshot = await getDocs(collection(db, "submissions"))
//       const data = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         time: doc.data().time,
//         submittedBy: doc.data().submittedBy,
//         status: doc.data().status,
//         reviewer: doc.data().reviewer,
//         submissionName: doc.data().name || "Unnamed Submission",
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
//     if (!selectedReviewer) {
//       alert("Please select a reviewer.")
//       return
//     }

//     try {
//       console.log("Assigning reviewer:", selectedReviewer, "to submission:", assigningSubmissionId)

//       // Ensure we have the submission ID
//       if (!assigningSubmissionId) {
//         throw new Error("Missing submission ID")
//       }

//       const submissionDoc = doc(db, "submissions", assigningSubmissionId)
//       const newReviewerDoc = doc(db, "users", selectedReviewer)

//       // Check if the submission has a previous reviewer that needs to be updated
//       if (currentSubmission && currentSubmission.reviewer && currentSubmission.reviewer !== selectedReviewer) {
//         console.log("Removing assignment from previous reviewer:", currentSubmission.reviewer)
//         try {
//           const oldReviewerDoc = doc(db, "users", currentSubmission.reviewer)
//           await updateDoc(oldReviewerDoc, {
//             assignedCount: increment(-1),
//             filesAssigned: arrayRemove(assigningSubmissionId),
//             inProgress: increment(-1),
//           })
//           console.log("Successfully updated old reviewer")
//         } catch (oldReviewerError) {
//           console.error("Error updating old reviewer:", oldReviewerError)
//           // Continue with the rest of the assignment even if updating the old reviewer fails
//         }
//       }

//       // Update the submission document
//       console.log("Updating submission document")
//       await updateDoc(submissionDoc, {
//         reviewer: selectedReviewer,
//         status: "under-review",
//         lastUpdated: new Date(),
//       })
//       console.log("Successfully updated submission")

//       // Update the new reviewer document
//       console.log("Updating new reviewer document")
//       await updateDoc(newReviewerDoc, {
//         assignedCount: increment(1),
//         filesAssigned: arrayUnion(assigningSubmissionId),
//         inProgress: increment(1),
//       })
//       console.log("Successfully updated new reviewer")

//       // Refresh the submission data
//       const updatedDocRef = doc(db, "submissions", assigningSubmissionId)
//       const updatedDocSnap = await getDoc(updatedDocRef)
//       if (updatedDocSnap.exists()) {
//         setSubmission(updatedDocSnap.data())
//       }

//       fetchSubmissions()
//       setOpenReviewerDialog(false)
//       setSelectedReviewer("")
//       alert("Reviewer assigned successfully!")
//     } catch (error) {
//       console.error("Error assigning reviewer:", error)
//       alert(`Failed to assign reviewer: ${error.message || "Unknown error"}`)
//     }
//   }

//   const handleOpenReviewerDialog = (submission) => {
//     if (!submission) {
//       console.error("No submission provided to handleOpenReviewerDialog")
//       alert("Error: Cannot assign reviewer to undefined submission")
//       return
//     }

//     console.log("Opening reviewer dialog for submission:", submission)
//     setCurrentSubmission(submission)
//     setAssigningSubmissionId(submission.id)
//     setSelectedReviewer(submission.reviewer || "")
//     setOpenReviewerDialog(true)
//   }

//   const handleAssignStatus = async () => {
//     if (!assigningStatus) {
//       alert("Please select a status.")
//       return
//     }
//     try {
//       await updateDoc(doc(db, "submissions", assigningSubmissionId), {
//         status: assigningStatus,
//       })

//       if (currentSubmission.reviewer) {
//         const reviewerDoc = doc(db, "users", currentSubmission.reviewer)

//         if (["approved", "rejected"].includes(assigningStatus)) {
//           await updateDoc(reviewerDoc, {
//             assignedCount: increment(-1),
//             filesAssigned: arrayRemove(assigningSubmissionId),
//             inProgress: increment(-1),
//             [assigningStatus]: increment(1),
//           })
//         } else if (assigningStatus === "completed") {
//           await updateDoc(reviewerDoc, {
//             inProgress: increment(-1),
//             completed: increment(1),
//           })
//         }
//       }

//       fetchSubmissions()
//       setOpenStatusDialog(false)
//       setAssigningStatus("pending")
//     } catch (error) {
//       console.error("Error changing status:", error)
//       alert(`Error changing status: ${error}`)
//     }
//   }

//   // Add this function to open the status dialog
//   const handleOpenStatusDialog = (submission) => {
//     setCurrentSubmission(submission)
//     setAssigningSubmissionId(submission.id)
//     setAssigningStatus(submission.status || "pending")
//     setOpenStatusDialog(true)
//   }

//   useEffect(() => {
//     const fetchSubmission = async () => {
//       try {
//         console.log("Reviewing document with ID:", id)
//         const docRef = doc(db, "submissions", id)
//         const docSnap = await getDoc(docRef)

//         if (docSnap.exists()) {
//           const submissionData = {
//             id: docSnap.id,
//             ...docSnap.data(),
//           }
//           console.log("Document data:", submissionData)
//           setSubmission(submissionData)
//           setCurrentSubmission(submissionData) // Also set currentSubmission
//         } else {
//           console.error("No such document!")
//           setError("Document not found. It may have been deleted or you don't have permission to view it.")
//         }
//       } catch (error) {
//         console.error("Error fetching submission: ", error)
//         setError(`Error loading document: ${error.message}`)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchSubmission()
//     fetchSubmissions()
//     fetchReviewers()
//   }, [id])

//   const handleDocumentCommentChange = (documentUrl, newComment) => {
//     setFormData((prev) => ({
//       ...prev,
//       documentComments: {
//         ...(prev.documentComments || {}),
//         [documentUrl]: newComment,
//       },
//     }))
//   }

//   const handleSubmitReview = async () => {
//     try {
//       setSubmitting(true)
//       await setDoc(doc(db, "reviews", id), {
//         submissionId: id,
//         reviewerUid: currentUser.uid,
//         reviewerName: currentUser.displayName || currentUser.email.split("@")[0],
//         documentComments: formData.documentComments || {},
//         submittedAt: new Date(),
//       })
//       history.push("/dashboard")
//     } catch (err) {
//       console.error("Error submitting review:", err)
//       setError("Failed to submit review. Please try again.")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleNext = () => {
//     if (activeStep === steps.length - 1) {
//       handleSubmitReview()
//     } else {
//       setActiveStep((prev) => prev + 1)
//     }
//   }

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1)
//   }

//   const handleStep = (step) => () => {
//     setActiveStep(step)
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

//   // Helper function to check if any documents in a step have comments
//   const checkForDocumentComments = (data) => {
//     if (!data || !formData?.documentComments) return false

//     const documentUrls = extractDocumentUrls(data)
//     return documentUrls.some((url) => formData.documentComments[url])
//   }

//   // Helper function to extract all document URLs from data
//   const extractDocumentUrls = (data) => {
//     const urls = []

//     if (typeof data === "string" && data.match(/\.(pdf|png|jpg|jpeg|gif)($|\?)/i)) {
//       urls.push(data)
//     } else if (Array.isArray(data)) {
//       data.forEach((item) => {
//         urls.push(...extractDocumentUrls(item))
//       })
//     } else if (typeof data === "object" && data !== null) {
//       Object.values(data).forEach((value) => {
//         urls.push(...extractDocumentUrls(value))
//       })
//     }

//     return urls
//   }

//   const getStepData = (step) => {
//     switch (step) {
//       case 0:
//         return submission.borrowerDetails
//       case 1:
//         return submission.sanctionLetter
//       case 2:
//         return submission.loanFacilities
//       case 3:
//         return submission.securities
//       case 4:
//         return submission.registrationOfSecurity
//       case 5:
//         return submission.guarantors
//       case 6:
//         return submission.otherDocuments
//       default:
//         return null
//     }
//   }

//   const formatKey = (key) => {
//     return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
//   }

//   const renderDocumentTitle = (url, path) => {
//     return <DocumentTitle url={url} path={path} />
//   }

//   const renderJsonData = (data, level = 0, path = "") => {
//     if (!data) return null

//     if (typeof data === "string") {
//       // Check if the string is a URL to a PDF or image
//       if (data.match(/\.(pdf|png|jpg|jpeg|gif)($|\?)/i)) {
//         return renderDocumentTitle(data, path)
//       }
//       return null // Don't show regular string values
//     }

//     if (Array.isArray(data)) {
//       return (
//         <Box>
//           {data.map((item, index) => (
//             <Box key={index} sx={{ mb: 2 }}>
//               {renderJsonData(item, level + 1, `${path}[${index}]`)}
//             </Box>
//           ))}
//         </Box>
//       )
//     }

//     if (typeof data === "object") {
//       return (
//         <Box>
//           {Object.entries(data).map(([key, value]) => {
//             const newPath = path ? `${path}.${key}` : key
//             const isDocument = typeof value === "string" && value.match(/\.(pdf|png|jpg|jpeg|gif)($|\?)/i)

//             // Only render if it's a document or has children that are documents
//             if (isDocument || (typeof value === "object" && value !== null)) {
//               return (
//                 <Box key={key} sx={{ mb: 2 }}>
//                   {/* Only show the title if it has a document or is a container */}
//                   <Typography
//                     variant="subtitle1"
//                     fontWeight="bold"
//                     sx={{ textTransform: "capitalize", color: "primary.main" }}
//                   >
//                     {formatKey(key)}
//                   </Typography>
//                   {renderJsonData(value, level + 1, newPath)}
//                 </Box>
//               )
//             }
//             return null
//           })}
//         </Box>
//       )
//     }

//     return null // Don't show primitive values
//   }

//   const renderStepContent = (step) => {
//     const data = getStepData(step)
//     if (!data) return "No documents available"

//     return (
//       <Box>
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//           Click on a document to expand it. Click the eye icon to open in a new tab.
//         </Typography>
//         {renderJsonData(data)}
//       </Box>
//     )
//   }

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "70vh",
//         }}
//       >
//         <CircularProgress size={60} thickness={4} />
//         <Typography variant="h6" sx={{ mt: 2 }}>
//           Loading document details...
//         </Typography>
//       </Box>
//     )
//   }

//   if (error) {
//     return (
//       <Container maxWidth="md" sx={{ mt: 5 }}>
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//         <Button startIcon={<ArrowBackIcon />} onClick={() => history.goBack()}>
//           Go Back
//         </Button>
//       </Container>
//     )
//   }

//   if (!submission) {
//     return (
//       <Container sx={{ mt: 5 }}>
//         <Typography variant="h5" color="error">
//           No data found for this submission.
//         </Typography>
//         <Button startIcon={<ArrowBackIcon />} onClick={() => history.goBack()} sx={{ mt: 2 }}>
//           Go Back
//         </Button>
//       </Container>
//     )
//   }

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//         <IconButton onClick={() => history.goBack()} sx={{ mr: 2 }}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Typography variant="h4" component="h1" fontWeight="bold">
//           Document Review
//         </Typography>
//       </Box>

//       <Paper
//         elevation={0}
//         variant="outlined"
//         sx={{
//           p: 3,
//           mb: 4,
//           borderRadius: 2,
//         }}
//       >
//         <SectionHeader title="Submission Information" />

//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6} md={4}>
//             <Typography variant="body2" color="text.secondary">
//               Submission ID
//             </Typography>
//             <Typography variant="body1" fontWeight="medium">
//               {id}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <Typography variant="body2" color="text.secondary">
//               Submitted By
//             </Typography>
//             <Typography variant="body1" fontWeight="medium">
//               {submission.submittedBy || "Unknown"}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <Typography variant="body2" color="text.secondary">
//               Submission Date
//             </Typography>
//             <Typography variant="body1" fontWeight="medium">
//               {formatDate(submission.submittedAt)}
//             </Typography>
//           </Grid>
//         </Grid>
//       </Paper>

//       <Box>
//         {/* Document List View */}
//         <Paper
//           elevation={0}
//           variant="outlined"
//           sx={{
//             p: 3,
//             mb: 3,
//             borderRadius: 2,
//           }}
//         >
//           <SectionHeader title="All Documents" />

//           {/* Render all sections in a single list */}
//           {steps.map((stepName, index) => (
//             <Box key={index} sx={{ mb: 4 }}>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   mb: 2,
//                   pb: 1,
//                   borderBottom: "1px solid",
//                   borderColor: "divider",
//                 }}
//               >
//                 {stepName}
//               </Typography>
//               {renderStepContent(index)}
//             </Box>
//           ))}
//         </Paper>

//         <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
//           <Button variant="outlined" onClick={() => history.goBack()} startIcon={<ArrowBackIcon />} sx={{ px: 3 }}>
//             Back
//           </Button>
//           <Box>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => handleOpenReviewerDialog({ ...submission, id })}
//               startIcon={<AssignmentIndIcon />}
//               sx={{ px: 3, mr: 2 }}
//             >
//               Assign to Reviewer
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => handleOpenStatusDialog(submission)}
//               startIcon={<UpdateIcon />}
//               sx={{ px: 3, mr: 2 }}
//             >
//               Update Status
//             </Button>
//           </Box>
//         </Box>
//       </Box>

//       {/* Reviewer Assignment Dialog */}
//       <Dialog open={openReviewerDialog} onClose={() => setOpenReviewerDialog(false)} maxWidth="xs" fullWidth>
//         <DialogTitle>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             Assign Reviewer
//             <IconButton onClick={() => setOpenReviewerDialog(false)}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Box sx={{ mb: 3, mt: 1 }}>
//             <Typography variant="body2" color="text.secondary" gutterBottom>
//               Document ID: {currentSubmission?.id}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Submitted by: {currentSubmission?.submittedBy}
//             </Typography>
//           </Box>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel id="reviewer-select-label">Reviewer</InputLabel>
//             <Select
//               labelId="reviewer-select-label"
//               value={selectedReviewer}
//               onChange={(e) => setSelectedReviewer(e.target.value)}
//               label="Reviewer"
//             >
//               {reviewers.map((user) => (
//                 <MenuItem key={user.uid} value={user.uid}>
//                   {user.name || user.email || user.uid}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button onClick={() => setOpenReviewerDialog(false)}>Cancel</Button>
//           <Button onClick={handleAssignReviewer} variant="contained" disabled={!selectedReviewer}>
//             Assign
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)} maxWidth="xs" fullWidth>
//         <DialogTitle>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             Update Document Status
//             <IconButton onClick={() => setOpenStatusDialog(false)}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Box sx={{ mb: 3, mt: 1 }}>
//             <Typography variant="body2" color="text.secondary" gutterBottom>
//               Document ID: {currentSubmission?.id}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Submitted by: {currentSubmission?.submittedBy}
//             </Typography>
//           </Box>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel id="status-select-label">Status</InputLabel>
//             <Select
//               labelId="status-select-label"
//               value={assigningStatus}
//               onChange={(e) => setAssigningStatus(e.target.value)}
//               label="Status"
//             >
//               <MenuItem value="pending">Pending</MenuItem>
//               <MenuItem value="under-review">Under Review</MenuItem>
//               <MenuItem value="approved">Approved</MenuItem>
//               <MenuItem value="rejected">Rejected</MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
//           <Button onClick={handleAssignStatus} variant="contained">
//             Update Status
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   )
// }

// export default ReviewDocumentDetailsAdmin


"use client"

import { useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"
import { getDoc, setDoc } from "firebase/firestore"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase/config"
import { doc, query, where, updateDoc } from "firebase/firestore"
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Alert,
  IconButton,
  Grid,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from "@mui/material"
import { useFormData } from "./FormDataManager"
import { useAuth } from "../contexts/AuthContext"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ImageIcon from "@mui/icons-material/Image"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import VisibilityIcon from "@mui/icons-material/Visibility"
import SectionHeader from "./sectionHeader"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import CloseIcon from "@mui/icons-material/Close"
import { arrayUnion } from "firebase/firestore"
import UpdateIcon from "@mui/icons-material/Update"

function DocumentTitle({ url, path, reviews, formatDate }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isPdf = url.toLowerCase().includes(".pdf")

  // Extract filename from URL
  const filename = url.split("/").pop().split("?")[0]

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Get reviews for this specific document
  const documentReviews = reviews.filter(
    (review) => review.documentComments && Object.keys(review.documentComments).some((docUrl) => docUrl === url),
  )

  return (
    <Box sx={{ my: 1 }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          cursor: "pointer",
          "&:hover": {
            bgcolor: "rgba(0, 0, 0, 0.04)",
          },
        }}
        onClick={toggleExpand}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isPdf ? <PictureAsPdfIcon color="error" sx={{ mr: 1 }} /> : <ImageIcon color="primary" sx={{ mr: 1 }} />}
            <Typography variant="body1">{filename || "Document"}</Typography>
            {documentReviews.length > 0 && (
              <Typography variant="caption" color="primary" sx={{ ml: 1, fontWeight: "bold" }}>
                ({documentReviews.length} review{documentReviews.length > 1 ? "s" : ""})
              </Typography>
            )}
          </Box>
          <Button
            variant="text"
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              window.open(url, "_blank")
            }}
          >
            <VisibilityIcon fontSize="small" />
          </Button>
        </Box>
      </Paper>

      {/* Reviews for this document */}
      {documentReviews.length > 0 && (
        <Box sx={{ mt: 1, ml: 2 }}>
          {documentReviews.map((review) => (
            <Card key={review.id} variant="outlined" sx={{ mb: 1, bgcolor: "grey.50" }}>
              <CardContent sx={{ py: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" color="primary" fontWeight="bold">
                    Review by {review.reviewerName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(review.submittedAt)}
                  </Typography>
                </Box>
                {review.documentComments[url] && (
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", fontSize: "0.875rem" }}>
                    {review.documentComments[url]}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {isExpanded && (
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            mt: 1,
            p: 0,
            height: "80vh",
            width: "100%",
            position: "fixed",
            top: "10vh",
            left: 0,
            right: 0,
            zIndex: 1300,
            margin: "0 auto",
            maxWidth: "90%",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            <Typography variant="subtitle1">{filename || "Document"}</Typography>
            <IconButton onClick={toggleExpand} sx={{ color: "white" }}>
              <ArrowBackIcon />
            </IconButton>
          </Box>
          <Box sx={{ height: "calc(100% - 48px)", overflow: "hidden" }}>
            {isPdf ? (
              <iframe src={url} width="100%" height="100%" style={{ border: "none" }} title="PDF Preview" />
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#f5f5f5",
                }}
              >
                <img
                  src={url || "/placeholder.svg"}
                  alt="Document preview"
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  )
}

function ReviewDocumentDetailsAdmin() {
  const { id } = useParams()
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const history = useHistory()
  const { formData, setFormData } = useFormData()
  const { currentUser } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [error, setError] = useState(null)
  const [currentSubmission, setCurrentSubmission] = useState(null)
  const [assigningSubmissionId, setAssigningSubmissionId] = useState(null)
  const [selectedReviewer, setSelectedReviewer] = useState("")
  const [openReviewerDialog, setOpenReviewerDialog] = useState(false)
  const [reviewers, setReviewers] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const [assigningStatus, setAssigningStatus] = useState("pending")
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)

  const steps = [
    "Borrower Details",
    "Sanction Letter",
    "Facilities",
    "Securities",
    "Registration of Security",
    "Guarantors",
    "Other Documents",
  ]

  const stepName = steps[activeStep]

  const fetchSubmissions = async () => {
    setLoading(true)
    setError(null)
    try {
      const querySnapshot = await getDocs(collection(db, "submissions"))
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        time: doc.data().time,
        submittedBy: doc.data().submittedBy,
        status: doc.data().status || "pending", // Keep only this one
        reviewer: doc.data().reviewer,
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

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return

      setLoadingReviews(true)
      try {
        const reviewsQuery = query(collection(db, "reviews"), where("submissionId", "==", id))
        const reviewsSnapshot = await getDocs(reviewsQuery)
        const reviewsData = reviewsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setReviews(reviewsData)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoadingReviews(false)
      }
    }

    const fetchSubmission = async () => {
      try {
        console.log("Reviewing document with ID:", id)
        const docRef = doc(db, "submissions", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const submissionData = {
            id: docSnap.id,
            ...docSnap.data(),
          }
          console.log("Document data:", submissionData)
          setSubmission(submissionData)
          setCurrentSubmission(submissionData) // Also set currentSubmission
        } else {
          console.error("No such document!")
          setError("Document not found. It may have been deleted or you don't have permission to view it.")
        }
      } catch (error) {
        console.error("Error fetching submission: ", error)
        setError(`Error loading document: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmission()
    fetchSubmissions()
    fetchReviewers()
    fetchReviews()
  }, [id])

  const handleDocumentCommentChange = (documentUrl, newComment) => {
    setFormData((prev) => ({
      ...prev,
      documentComments: {
        ...(prev.documentComments || {}),
        [documentUrl]: newComment,
      },
    }))
  }

  const handleSubmitReview = async () => {
    try {
      setSubmitting(true)
      await setDoc(doc(db, "reviews", id), {
        submissionId: id,
        reviewerUid: currentUser.uid,
        reviewerName: currentUser.displayName || currentUser.email.split("@")[0],
        documentComments: formData.documentComments || {},
        submittedAt: new Date(),
      })
      history.push("/dashboard")
    } catch (err) {
      console.error("Error submitting review:", err)
      setError("Failed to submit review. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmitReview()
    } else {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const handleStep = (step) => () => {
    setActiveStep(step)
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

  // Helper function to check if any documents in a step have comments
  const checkForDocumentComments = (data) => {
    if (!data || !formData?.documentComments) return false

    const documentUrls = extractDocumentUrls(data)
    return documentUrls.some((url) => formData.documentComments[url])
  }

  // Helper function to extract all document URLs from data
  const extractDocumentUrls = (data) => {
    const urls = []

    if (typeof data === "string" && data.match(/\.(pdf|png|jpg|jpeg|gif)($|\?)/i)) {
      urls.push(data)
    } else if (Array.isArray(data)) {
      data.forEach((item) => {
        urls.push(...extractDocumentUrls(item))
      })
    } else if (typeof data === "object" && data !== null) {
      Object.values(data).forEach((value) => {
        urls.push(...extractDocumentUrls(value))
      })
    }

    return urls
  }

  const getStepData = (step) => {
    switch (step) {
      case 0:
        return submission.borrowerDetails
      case 1:
        return submission.sanctionLetter
      case 2:
        return submission.loanFacilities
      case 3:
        return submission.securities
      case 4:
        return submission.registrationOfSecurity
      case 5:
        return submission.guarantors
      case 6:
        return submission.otherDocuments
      default:
        return null
    }
  }

  const formatKey = (key) => {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  }

  const renderDocumentTitle = (url, path) => {
    return <DocumentTitle url={url} path={path} reviews={reviews} formatDate={formatDate} />
  }

  const renderJsonData = (data, level = 0, path = "") => {
    if (!data) return null

    if (typeof data === "string") {
      // Check if the string is a URL to a PDF or image
      if (data.match(/\.(pdf|png|jpg|jpeg|gif)($|\?)/i)) {
        return renderDocumentTitle(data, path)
      }
      return null // Don't show regular string values
    }

    if (Array.isArray(data)) {
      return (
        <Box>
          {data.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              {renderJsonData(item, level + 1, `${path}[${index}]`)}
            </Box>
          ))}
        </Box>
      )
    }

    if (typeof data === "object") {
      return (
        <Box>
          {Object.entries(data).map(([key, value]) => {
            const newPath = path ? `${path}.${key}` : key
            const isDocument = typeof value === "string" && value.match(/\.(pdf|png|jpg|jpeg|gif)($|\?)/i)

            // Only render if it's a document or has children that are documents
            if (isDocument || (typeof value === "object" && value !== null)) {
              return (
                <Box key={key} sx={{ mb: 2 }}>
                  {/* Only show the title if it has a document or is a container */}
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ textTransform: "capitalize", color: "primary.main" }}
                  >
                    {formatKey(key)}
                  </Typography>
                  {renderJsonData(value, level + 1, newPath)}
                </Box>
              )
            }
            return null
          })}
        </Box>
      )
    }

    return null // Don't show primitive values
  }

  const renderStepContent = (step) => {
    const data = getStepData(step)
    if (!data) return "No documents available"

    return (
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click on a document to expand it. Click the eye icon to open in a new tab.
        </Typography>
        {renderJsonData(data)}
      </Box>
    )
  }

  const handleOpenReviewerDialog = (submission) => {
    setCurrentSubmission(submission)
    setSelectedReviewer("")
    setOpenReviewerDialog(true)
  }

  const handleOpenStatusDialog = (submission) => {
    setCurrentSubmission(submission)
    setAssigningStatus(submission.status || "pending")
    setOpenStatusDialog(true)
  }

  const handleAssignReviewer = async () => {
    setSubmitting(true)
    try {
      // Update the submission document with the selected reviewer
      await updateDoc(doc(db, "submissions", currentSubmission.id), {
        reviewer: selectedReviewer,
        status: "pending-under-review",
      })

      // Optionally, update the reviewer's document to include the submission ID
      await updateDoc(doc(db, "users", selectedReviewer), {
        assignedSubmissions: arrayUnion(currentSubmission.id),
      })

      // Refresh submissions
      fetchSubmissions()

      // Close the dialog
      setOpenReviewerDialog(false)
    } catch (error) {
      console.error("Error assigning reviewer:", error)
      setError("Failed to assign reviewer. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAssignStatus = async () => {
    setSubmitting(true)
    try {
      // Update the submission document with the selected status
      await updateDoc(doc(db, "submissions", currentSubmission.id), {
        status: assigningStatus,
      })

      // Refresh submissions
      fetchSubmissions()

      // Close the dialog
      setOpenStatusDialog(false)
    } catch (error) {
      console.error("Error assigning status:", error)
      setError("Failed to assign status. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading document details...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => history.goBack()}>
          Go Back
        </Button>
      </Container>
    )
  }

  if (!submission) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5" color="error">
          No data found for this submission.
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => history.goBack()} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => history.goBack()} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Document Review
        </Typography>
      </Box>

      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
        }}
      >
        <SectionHeader title="Submission Information" />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">
              Submission ID
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {id}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">
              Submitted By
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {submission.submittedBy || "Unknown"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">
              Submission Date
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(submission.submittedAt)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box>
        {/* Document List View */}
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
          }}
        >
          <SectionHeader title="All Documents" />

          {/* Render all sections in a single list */}
          {steps.map((stepName, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  pb: 1,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                {stepName}
              </Typography>
              {renderStepContent(index)}
            </Box>
          ))}
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="outlined" onClick={() => history.goBack()} startIcon={<ArrowBackIcon />} sx={{ px: 3 }}>
            Back
          </Button>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenReviewerDialog({ ...submission, id })}
              startIcon={<AssignmentIndIcon />}
              sx={{ px: 3, mr: 2 }}
            >
              Assign to Reviewer
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenStatusDialog(submission)}
              startIcon={<UpdateIcon />}
              sx={{ px: 3, mr: 2 }}
            >
              Update Status
            </Button>
          </Box>
        </Box>
      </Box>

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
              <MenuItem value="pending-under-review">Pending Under Review</MenuItem>
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
    </Container>
  )
}

export default ReviewDocumentDetailsAdmin
