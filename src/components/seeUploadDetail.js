// // "use client"

// // import { useState, useEffect } from "react"
// // import { useParams } from "react-router-dom"
// // import { doc, getDoc } from "firebase/firestore"
// // import { db } from "../firebase/config"
// // import { Container, Typography, Box, Stepper, Step, StepLabel, Paper, CircularProgress, Button,TextField } from "@mui/material"
// // import { useHistory } from "react-router-dom"
// // import { Worker, Viewer } from '@react-pdf-viewer/core';
// // import '@react-pdf-viewer/core/lib/styles/index.css';
// // import { useFormData } from "./FormDataManager";
// // import { collection, setDoc } from "firebase/firestore";
// // import { useAuth } from "../contexts/AuthContext";

// // function SeeUploadDetails() {
// //   const { id } = useParams()
// //   const [submission, setSubmission] = useState(null)
// //   const [loading, setLoading] = useState(true)
// //   const [activeStep, setActiveStep] = useState(0)
// //   const history = useHistory()
// //   const { formData, setFormData } = useFormData();
// //   const { currentUser } = useAuth(); 
// //   const [existingComments, setExistingComments] = useState({})

 

// //   const steps = [
// //     "Borrower Details",
// //     "Sanction Letter",
// //     "Facilities",
// //     "Securities",
// //     "Registration of Security",
// //     "Guarantors",
// //     "Other Documents",
// //   ]

// //   const stepName = steps[activeStep];
// //   const [comment, setComment] = useState(formData?.reviewComments?.[stepName] || "");

// //   useEffect(() => {
// //     const fetchSubmission = async () => {
// //       try {
// //         console.log("Reviewing document with ID:", id)
// //         const docRef = doc(db, "submissions", id)
// //         const docSnap = await getDoc(docRef)

// //         if (docSnap.exists()) {
// //           console.log("Document data:", docSnap.data())
// //           // Check if the document has the expected structure
// //           setSubmission(docSnap.data())
// //         } else {
// //           console.error("No such document!")
// //         }
// //       } catch (error) {
// //         console.error("Error fetching submission: ", error)
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     const fetchReviewComments = async () => {
// //         try {
// //           const reviewRef = doc(db, "reviews", id)
// //           const reviewSnap = await getDoc(reviewRef)
      
// //           if (reviewSnap.exists()) {
// //             const reviewData = reviewSnap.data()
// //             setExistingComments(reviewData.comments || {})
// //           }
// //         } catch (error) {
// //           console.error("Error fetching review comments:", error)
// //         }
// //       }
      
      
      

// //     fetchSubmission()
// //     fetchReviewComments()
// //   }, [id])

// //   const handleCommentChange = (e) => {
// //     setComment(e.target.value);
// //     setFormData((prev) => ({
// //       ...prev,
// //       reviewComments: {
// //         ...(prev.reviewComments || {}),
// //         [stepName]: e.target.value,
// //       },            
// //     }));
// //   };

  
// //   const handleSubmitReview = async () => {
// //     try {
// //       await setDoc(doc(db, "reviews", id), {
// //         submissionId: id,
// //         reviewerUid: currentUser.uid,
// //         reviewerName: currentUser.displayName || currentUser.email.split("@")[0],
// //         comments: formData.reviewComments || {},
// //         submittedAt: new Date()
// //       });
// //       history.push("/dashboard");
// //     } catch (err) {
// //       console.error("Error submitting review:", err);
// //       alert("Failed to submit review");
// //     }
// //   };
  

// //   const handleNext = () => {
// //     activeStep === steps.length - 1
// //       ? setTimeout(() => {
// //           history.push("/dashboard")
// //         }, 2000)
// //       : setActiveStep((prev) => prev + 1)
// //   }

// //   const handleBack = () => {
// //     setActiveStep((prev) => prev - 1)
// //   }

// //   if (loading) {
// //     return (
// //       <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
// //         <CircularProgress />
// //       </Box>
// //     )
// //   }

// //   if (!submission) {
// //     return (
// //       <Container sx={{ mt: 5 }}>
// //         <Typography variant="h5" color="error">
// //           No data found for this submission.
// //         </Typography>
// //       </Container>
// //     )
// //   }

// //   const renderStepContent = (step) => {
// //     const data = getStepData(step)
// //     if (!data) return "No data available"

// //     return <Box>{renderJsonData(data)}</Box>
// //   }

// //   const getStepData = (step) => {
// //     switch (step) {
// //       case 0:
// //         return submission.borrowerDetails
// //       case 1:
// //         return submission.sanctionLetter
// //       case 2:
// //         return submission.loanFacilities
// //       case 3:
// //         return submission.securities
// //       case 4:
// //         return submission.registrationOfSecurity
// //       case 5:
// //         return submission.guarantors
// //       case 6:
// //         return submission.otherDocuments
// //       default:
// //         return null
// //     }
// //   }

// //   const renderJsonData = (data, level = 0) => {
// //     if (!data) return null

// //     if (typeof data === "string") {
// //       // Check if the string is a URL to a PDF or image
// //       if (data.match(/\.(pdf|png|jpg|jpeg|gif)($|\?)/i)) {
// //         return renderFileLink(data)
// //       }
// //       return <Typography variant="body1">{data}</Typography>
// //     }

// //     if (Array.isArray(data)) {
// //       return (
// //         <Box sx={{ ml: level * 2 }}>
// //           {data.map((item, index) => (
// //             <Box key={index} sx={{ mb: 2, p: 2, border: "1px solid #eee", borderRadius: 1 }}>
// //               <Typography variant="subtitle1" fontWeight="bold">
// //                 Item {index + 1}
// //               </Typography>
// //               {renderJsonData(item, level + 1)}
// //             </Box>
// //           ))}
// //         </Box>
// //       )
// //     }

// //     if (typeof data === "object") {
// //       return (
// //         <Box sx={{ ml: level * 2 }}>
// //           {Object.entries(data).map(([key, value]) => (
// //             <Box key={key} sx={{ mb: 2 }}>
// //               <Typography variant="subtitle1" fontWeight="bold" sx={{ textTransform: "capitalize" }}>
// //                 {formatKey(key)}
// //               </Typography>
// //               {renderJsonData(value, level + 1)}
// //             </Box>
// //           ))}
// //         </Box>
// //       )
// //     }

// //     return <Typography variant="body1">{String(data)}</Typography>
// //   }

// //   const formatKey = (key) => {
// //     // Convert camelCase to Title Case with spaces
// //     return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
// //   }

// //   const renderFileLink = (url) => {
// //     const isPdf = url.toLowerCase().includes(".pdf")

// //     return (
// //       <Box sx={{ my: 1 }}>
// //         {isPdf ? (
// //           <Box>
// //             <Button
// //               variant="outlined"
// //               href={url}
// //               target="_blank"
// //               startIcon={
// //                 <span role="img" aria-label="document">
// //                   📄
// //                 </span>
// //               }
// //             >
// //               View PDF Document
// //             </Button>
// //             <Box sx={{ mt: 2 }}>
// //               {/* Replace the iframe with a Cloudinary-optimized PDF viewer */}
// //               <Box
// //           sx={{
// //             border: "1px solid #eee",
// //             height: "600px",
// //             display: "flex",
// //             flexDirection: "column",
// //             p: 2,
// //             bgcolor: "#f5f5f5",
// //           }}
// //         >
// //           <iframe
// //             src={url}
// //             width="100%"
// //             height="100%"
// //             style={{ border: "none" }}
// //             title="PDF Preview"
// //           />
// //         </Box>
// //             </Box>
// //           </Box>
// //         ) : (
// //           <Box>
// //             <a href={url} target="_blank" rel="noopener noreferrer">
// //               <img
// //                 src={url || "/placeholder.svg"}
// //                 alt="Uploaded file"
// //                 style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
// //               />
// //             </a>
// //           </Box>
// //         )}
// //       </Box>
// //     )
// //   }

// //   // const renderFileLink = (url) => {
// //   //   const isPdf = url.toLowerCase().includes(".pdf");
  
// //   //   return (
// //   //     <Box sx={{ my: 1 }}>
// //   //       {isPdf ? (
// //   //         <iframe
// //   //           src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
// //   //           width="100%"
// //   //           height="600px"
// //   //           style={{ border: "none" }}
// //   //           title="PDF Preview"
// //   //         />
// //   //       ) : (
// //   //         <Box>
// //   //           <a href={url} target="_blank" rel="noopener noreferrer">
// //   //             <img
// //   //               src={url || "/placeholder.svg"}
// //   //               alt="Uploaded file"
// //   //               style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
// //   //             />
// //   //           </a>
// //   //         </Box>
// //   //       )}
// //   //     </Box>
// //   //   );
// //   // };
  



// //   const transformCloudinaryUrl = (url) => {
// //     // Check if it's a Cloudinary URL
// //     if (url.includes("cloudinary.com")) {
// //       // For PDFs, we can use Cloudinary's PDF viewer by adding fl_attachment flag
// //       // This transforms the URL to make it viewable
// //       const parts = url.split("/upload/")
// //       if (parts.length === 2) {
// //         return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
// //       }
// //     }
// //     return url
// //   }

// //   return (
// //     <Container sx={{ mt: 5 }}>
// //       <Typography variant="h4" gutterBottom>
// //         Review Submission Details
// //       </Typography>
// //       <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
// //         {steps.map((label) => (
// //           <Step key={label}>
// //             <StepLabel>{label}</StepLabel>
// //           </Step>
// //         ))}
// //       </Stepper>

// //       <Paper sx={{ p: 3, mb: 2 }}>
// //         <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
// //           {renderStepContent(activeStep)}
// //         </Typography>
// //       </Paper>
// //       {existingComments[stepName] && (
// //   <Paper sx={{ mt: 2, p: 2, backgroundColor: "#f9f9f9", borderLeft: "4px solid #1976d2" }}>
// //     <Typography variant="subtitle2" color="text.secondary" gutterBottom>
// //       Comment:
// //     </Typography>
// //     <Typography variant="body2" color="text.primary">
// //       {existingComments[stepName]}
// //     </Typography>
// //   </Paper>
// // )}
// //       <Box sx={{ display: "flex", justifyContent: "space-between" }}>
// //         <Button disabled={activeStep === 0} onClick={handleBack}>
// //           Back
// //         </Button>
      
// //   <Button variant="contained" onClick={handleNext}>
// //     Next
// //   </Button>

// //      </Box>
// //     </Container>
// //   )
// // }

// // export default SeeUploadDetails


// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useHistory } from "react-router-dom"
// import { doc, getDoc } from "firebase/firestore"
// import { db } from "../firebase/config"
// import {
//   Container,
//   Typography,
//   Box,
//   Stepper,
//   Step,
//   StepLabel,
//   Paper,
//   CircularProgress,
//   Button,
//   Divider,
//   Card,
//   CardContent,
//   Alert,
//   IconButton,
//   Tabs,
//   Tab,
//   Chip,
//   Grid,
//   StepButton,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material"
// import { useAuth } from "../contexts/AuthContext"
// import ArrowBackIcon from "@mui/icons-material/ArrowBack"
// import DescriptionIcon from "@mui/icons-material/Description"
// import ImageIcon from "@mui/icons-material/Image"
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
// import VisibilityIcon from "@mui/icons-material/Visibility"
// import CommentIcon from "@mui/icons-material/Comment"
// import PersonIcon from "@mui/icons-material/Person"
// import SectionHeader from "./sectionHeader"

// function SeeUploadDetails() {
//   const { id } = useParams()
//   const [submission, setSubmission] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [activeStep, setActiveStep] = useState(0)
//   const [tabValue, setTabValue] = useState(0)
//   const history = useHistory()
//   const { currentUser } = useAuth()
//   const [existingComments, setExistingComments] = useState({})
//   const [error, setError] = useState(null)
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"))

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

//   useEffect(() => {
//     const fetchSubmission = async () => {
//       try {
//         console.log("Viewing document with ID:", id)
//         const docRef = doc(db, "submissions", id)
//         const docSnap = await getDoc(docRef)

//         if (docSnap.exists()) {
//           console.log("Document data:", docSnap.data())
//           setSubmission(docSnap.data())
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

//     const fetchReviewComments = async () => {
//       try {
//         const reviewRef = doc(db, "reviews", id)
//         const reviewSnap = await getDoc(reviewRef)

//         if (reviewSnap.exists()) {
//           const reviewData = reviewSnap.data()
//           setExistingComments(reviewData.comments || {})
//         }
//       } catch (error) {
//         console.error("Error fetching review comments:", error)
//       }
//     }

//     fetchSubmission()
//     fetchReviewComments()
//   }, [id])

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue)
//   }

//   const handleNext = () => {
//     activeStep === steps.length - 1
//       ? setTimeout(() => {
//           history.push("/dashboard")
//         }, 2000)
//       : setActiveStep((prev) => prev + 1)
//   }

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1)
//   }

//   const handleStep = (step) => () => {
//     setActiveStep(step)
//   }

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
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

//   const renderStepContent = (step) => {
//     const data = getStepData(step)
//     if (!data) return "No data available"

//     return <Box>{renderJsonData(data)}</Box>
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

//   const renderJsonData = (data, level = 0) => {
//     if (!data) return null

//     if (typeof data === "string") {
//       // Check if the string is a URL to a PDF or image
//       if (data.match(/\.(pdf|png|jpg|jpeg|gif)($|\?)/i)) {
//         return renderFileLink(data)
//       }
//       return <Typography variant="body1">{data}</Typography>
//     }

//     if (Array.isArray(data)) {
//       return (
//         <Box sx={{ ml: level * 2 }}>
//           {data.map((item, index) => (
//             <Card key={index} variant="outlined" sx={{ mb: 2, borderColor: "rgba(0, 0, 0, 0.12)" }}>
//               <CardContent>
//                 <Typography variant="subtitle1" fontWeight="bold">
//                   Item {index + 1}
//                 </Typography>
//                 {renderJsonData(item, level + 1)}
//               </CardContent>
//             </Card>
//           ))}
//         </Box>
//       )
//     }

//     if (typeof data === "object") {
//       return (
//         <Box sx={{ ml: level * 2 }}>
//           {Object.entries(data).map(([key, value]) => (
//             <Box key={key} sx={{ mb: 3 }}>
//               <Typography
//                 variant="subtitle1"
//                 fontWeight="bold"
//                 sx={{ textTransform: "capitalize", color: "primary.main" }}
//               >
//                 {formatKey(key)}
//               </Typography>
//               <Divider sx={{ mb: 1 }} />
//               {renderJsonData(value, level + 1)}
//             </Box>
//           ))}
//         </Box>
//       )
//     }

//     return <Typography variant="body1">{String(data)}</Typography>
//   }

//   const formatKey = (key) => {
//     // Convert camelCase to Title Case with spaces
//     return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
//   }

//   const renderFileLink = (url) => {
//     const isPdf = url.toLowerCase().includes(".pdf")

//     return (
//       <Box sx={{ my: 2 }}>
//         {isPdf ? (
//           <Box>
//             <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//               <PictureAsPdfIcon color="error" sx={{ mr: 1 }} />
//               <Typography variant="body2" fontWeight="medium">
//                 PDF Document
//               </Typography>
//               <Button
//                 variant="outlined"
//                 href={url}
//                 target="_blank"
//                 startIcon={<VisibilityIcon />}
//                 size="small"
//                 sx={{ ml: 2 }}
//               >
//                 Open in New Tab
//               </Button>
//             </Box>
//             <Paper
//               elevation={0}
//               variant="outlined"
//               sx={{
//                 border: "1px solid",
//                 borderColor: "divider",
//                 height: "600px",
//                 borderRadius: 1,
//                 overflow: "hidden",
//               }}
//             >
//               <iframe src={url} width="100%" height="100%" style={{ border: "none" }} title="PDF Preview" />
//             </Paper>
//           </Box>
//         ) : (
//           <Box>
//             <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//               <ImageIcon color="primary" sx={{ mr: 1 }} />
//               <Typography variant="body2" fontWeight="medium">
//                 Image
//               </Typography>
//               <Button
//                 variant="outlined"
//                 href={url}
//                 target="_blank"
//                 startIcon={<VisibilityIcon />}
//                 size="small"
//                 sx={{ ml: 2 }}
//               >
//                 View Full Size
//               </Button>
//             </Box>
//             <Paper
//               elevation={0}
//               variant="outlined"
//               sx={{
//                 p: 2,
//                 borderRadius: 1,
//                 textAlign: "center",
//               }}
//             >
//               <img
//                 src={url || "/placeholder.svg"}
//                 alt="Uploaded file"
//                 style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
//               />
//             </Paper>
//           </Box>
//         )}
//       </Box>
//     )
//   }

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//         <IconButton onClick={() => history.goBack()} sx={{ mr: 2 }}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Typography variant="h4" component="h1" fontWeight="bold">
//           Submission Details
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
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//           <SectionHeader title="Submission Information" />
//           <Chip
//             label={submission.status || "pending"}
//             color={getStatusColor(submission.status)}
//             sx={{ fontWeight: "medium" }}
//           />
//         </Box>

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
//           <Grid item xs={12} sm={6} md={4}>
//             <Typography variant="body2" color="text.secondary">
//               Reviewer
//             </Typography>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <PersonIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
//               <Typography variant="body1" fontWeight="medium">
//                 {submission.reviewerName || "Unassigned"}
//               </Typography>
//             </Box>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <Typography variant="body2" color="text.secondary">
//               Last Updated
//             </Typography>
//             <Typography variant="body1" fontWeight="medium">
//               {formatDate(submission.reviewedAt) || "Not reviewed yet"}
//             </Typography>
//           </Grid>
//         </Grid>
//       </Paper>

//       <Box sx={{ mb: 4 }}>
//         <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
//           <Tab label="Document Details" icon={<DescriptionIcon />} iconPosition="start" />
//           <Tab label="Review Comments" icon={<CommentIcon />} iconPosition="start" />
//         </Tabs>
//       </Box>

//       {tabValue === 0 ? (
//         <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 4 }}>
//           {!isMobile && (
//             <Paper
//               elevation={0}
//               variant="outlined"
//               sx={{
//                 width: 280,
//                 p: 2,
//                 borderRadius: 2,
//                 position: "sticky",
//                 top: 24,
//                 alignSelf: "flex-start",
//                 height: "fit-content",
//               }}
//             >
//               <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
//                 {steps.map((step, index) => (
//                   <Step key={step} completed={!!existingComments[step]}>
//                     <StepButton
//                       onClick={handleStep(index)}
//                       sx={{
//                         textAlign: "left",
//                         py: 1.5,
//                       }}
//                     >
//                       <Typography
//                         variant="body2"
//                         fontWeight={activeStep === index ? 600 : 400}
//                         color={activeStep === index ? "primary" : "text.primary"}
//                       >
//                         {step}
//                       </Typography>
//                     </StepButton>
//                   </Step>
//                 ))}
//               </Stepper>
//             </Paper>
//           )}

//           <Box sx={{ flexGrow: 1 }}>
//             {isMobile && (
//               <Paper
//                 elevation={0}
//                 variant="outlined"
//                 sx={{
//                   p: 2,
//                   mb: 3,
//                   borderRadius: 2,
//                 }}
//               >
//                 <Stepper activeStep={activeStep} alternativeLabel>
//                   {steps.map((step, index) => (
//                     <Step key={step} completed={!!existingComments[step]}>
//                       <StepLabel>{step}</StepLabel>
//                     </Step>
//                   ))}
//                 </Stepper>
//               </Paper>
//             )}

//             <Paper
//               elevation={0}
//               variant="outlined"
//               sx={{
//                 p: 3,
//                 mb: 3,
//                 borderRadius: 2,
//               }}
//             >
//               <SectionHeader title={steps[activeStep]} />
//               <Box sx={{ minHeight: "300px" }}>{renderStepContent(activeStep)}</Box>
//             </Paper>

//             {existingComments[stepName] && (
//               <Paper
//                 sx={{
//                   mt: 2,
//                   p: 3,
//                   backgroundColor: "rgba(37, 99, 235, 0.04)",
//                   borderLeft: "4px solid",
//                   borderColor: "primary.main",
//                   borderRadius: 2,
//                 }}
//               >
//                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                   Reviewer Comment:
//                 </Typography>
//                 <Typography variant="body1" color="text.primary">
//                   {existingComments[stepName]}
//                 </Typography>
//               </Paper>
//             )}

//             <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
//               <Button
//                 variant="outlined"
//                 onClick={handleBack}
//                 disabled={activeStep === 0}
//                 startIcon={<ArrowBackIcon />}
//                 sx={{ px: 3 }}
//               >
//                 Back
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handleNext}
//                 disabled={activeStep === steps.length - 1}
//                 sx={{ px: 3 }}
//               >
//                 Next
//               </Button>
//             </Box>
//           </Box>
//         </Box>
//       ) : (
//         <Paper
//           elevation={0}
//           variant="outlined"
//           sx={{
//             p: 3,
//             mb: 3,
//             borderRadius: 2,
//           }}
//         >
//           <SectionHeader title="Review Comments" />

//           {Object.keys(existingComments).length === 0 ? (
//             <Box sx={{ textAlign: "center", py: 4 }}>
//               <CommentIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
//               <Typography variant="body1" color="text.secondary">
//                 No review comments available yet
//               </Typography>
//             </Box>
//           ) : (
//             steps.map((step, index) => (
//               <Box key={index} sx={{ mb: 3 }}>
//                 <Typography variant="subtitle1" fontWeight="medium" color="primary.dark">
//                   {step}
//                 </Typography>
//                 <Paper
//                   sx={{
//                     p: 2,
//                     mt: 1,
//                     mb: 2,
//                     backgroundColor: "background.default",
//                     borderRadius: 1,
//                   }}
//                 >
//                   <Typography variant="body1">{existingComments[step] || "No comments for this section"}</Typography>
//                 </Paper>
//                 <Divider />
//               </Box>
//             ))
//           )}
//         </Paper>
//       )}
//     </Container>
//   )
// }

// export default SeeUploadDetails

"use client"

import { useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  CircularProgress,
  Button,
  Divider,
  Card,
  CardContent,
  Alert,
  IconButton,
  Chip,
  Grid,
  StepButton,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useAuth } from "../contexts/AuthContext"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ImageIcon from "@mui/icons-material/Image"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CommentIcon from "@mui/icons-material/Comment"
import PersonIcon from "@mui/icons-material/Person"
import SectionHeader from "./sectionHeader"

function SeeUploadDetails() {
  const { id } = useParams()
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const history = useHistory()
  const { currentUser } = useAuth()
  const [existingComments, setExistingComments] = useState({})
  const [error, setError] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [reviewer, setReviewer] = useState(null)

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

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        console.log("Viewing document with ID:", id)
        const docRef = doc(db, "submissions", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data())
          setSubmission(docSnap.data())
          if(docSnap.data().reviewer) {
          const docRefRev = doc(db, "users", docSnap.data().reviewer)
          const docSnapRev = await getDoc(docRefRev)
          setReviewer(docSnapRev.data())
          console.log("Reviewer data:", docSnapRev.data())
          }
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

    const fetchReviewComments = async () => {
      try {
        const reviewRef = doc(db, "reviews", id)
        const reviewSnap = await getDoc(reviewRef)

        if (reviewSnap.exists()) {
          const reviewData = reviewSnap.data()
          // Check if we have document-level comments or section-level comments
          setExistingComments(reviewData.documentComments || reviewData.comments || {})
        }
      } catch (error) {
        console.error("Error fetching review comments:", error)
      }
    }

    fetchSubmission()
    fetchReviewComments()
  }, [id])

  const handleNext = () => {
    activeStep === steps.length - 1
      ? setTimeout(() => {
          history.push("/dashboard")
        }, 2000)
      : setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const handleStep = (step) => () => {
    setActiveStep(step)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  // Helper function to check if any documents in a step have comments
  const checkForDocumentComments = (data) => {
    if (!data || !existingComments) return false

    const documentUrls = extractDocumentUrls(data)
    return documentUrls.some((url) => existingComments[url])
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

  const renderFileLink = (url) => {
    const isPdf = url.toLowerCase().includes(".pdf")
    const documentComment = existingComments[url] || ""

    return (
      <Box sx={{ my: 3 }}>
        {isPdf ? (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PictureAsPdfIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="body2" fontWeight="medium">
                PDF Document
              </Typography>
              <Button
                variant="outlined"
                href={url}
                target="_blank"
                startIcon={<VisibilityIcon />}
                size="small"
                sx={{ ml: 2 }}
              >
                Open in New Tab
              </Button>
            </Box>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                height: "600px",
                borderRadius: 1,
                overflow: "hidden",
                mb: 2,
              }}
            >
              <iframe src={url} width="100%" height="100%" style={{ border: "none" }} title="PDF Preview" />
            </Paper>

            {/* Display reviewer comment for this specific document */}
            {documentComment && (
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "rgba(37, 99, 235, 0.04)",
                  borderLeft: "4px solid",
                  borderColor: "primary.main",
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CommentIcon fontSize="small" sx={{ color: "primary.main", mr: 1 }} />
                  <Typography variant="subtitle2" color="primary.dark" fontWeight="medium">
                    Reviewer Comment
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.primary">
                  {documentComment}
                </Typography>
              </Paper>
            )}
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <ImageIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" fontWeight="medium">
                Image
              </Typography>
              <Button
                variant="outlined"
                href={url}
                target="_blank"
                startIcon={<VisibilityIcon />}
                size="small"
                sx={{ ml: 2 }}
              >
                View Full Size
              </Button>
            </Box>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 1,
                textAlign: "center",
                mb: 2,
              }}
            >
              <img
                src={url || "/placeholder.svg"}
                alt="Uploaded file"
                style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
              />
            </Paper>

            {/* Display reviewer comment for this specific image */}
            {documentComment && (
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "rgba(37, 99, 235, 0.04)",
                  borderLeft: "4px solid",
                  borderColor: "primary.main",
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CommentIcon fontSize="small" sx={{ color: "primary.main", mr: 1 }} />
                  <Typography variant="subtitle2" color="primary.dark" fontWeight="medium">
                    Reviewer Comment
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.primary">
                  {documentComment}
                </Typography>
              </Paper>
            )}
          </Box>
        )}
      </Box>
    )
  }
  const sectionFieldOrder = {
  "Borrower Details": ["borrowerConstitution", "formData", "files"],
  "Sanction Letter": ["description", "files"],
  "Facilities": ["facilityType", "documents"],
  "Securities": ["securityType", "mortgageType", "files"],
  "Registration of Security": ["securityType", "files"],
  "Guarantors": ["borrowerConstitution","guarantorConstitution", "guarontorConstitution","formData", "files"],
  // "Other Documents" – leave as default (no reordering)
};
const hiddenHeadings = ["formData", "files"]

  const renderJsonData = (data, level = 0) => {
    if (!data) return null

    if (Array.isArray(data)) {
      return (
        <Box sx={{ ml: level * 2 }}>
          {data.map((item, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2, borderColor: "rgba(0, 0, 0, 0.12)" }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  Item {index + 1}
                </Typography>
                {renderJsonData(item, level + 1)}
              </CardContent>
            </Card>
          ))}
        </Box>
      )
    }
    // if (typeof data === "object") {
    //   return (
    //     <Box sx={{ ml: level * 2 }}>
    //       {Object.entries(data).map(([key, value]) => (
    //         <Box key={key} sx={{ mb: 3 }}>
    //           <Typography
    //             variant="subtitle1"
    //             fontWeight="bold"
    //             sx={{ textTransform: "capitalize", color: "primary.main" }}
    //           >
    //             {formatKey(key)}
    //           </Typography>
    //           <Divider sx={{ mb: 1 }} />
    //           {renderJsonData(value, level + 1)}
    //         </Box>
    //       ))}
    //     </Box>
    //   )
    // }

    if (typeof data === "object" && data !== null) {
  const orderedKeys =
    sectionFieldOrder[steps[activeStep]]?.filter((key) => key in data) || Object.keys(data);

  const remainingKeys = Object.keys(data).filter((key) => !orderedKeys.includes(key));

  // return (
  //   <Box sx={{ ml: level * 2 }}>
  //     {[...orderedKeys, ...remainingKeys].map((key) => (
  //       <Box key={key} sx={{ mb: 3 }}>
  //         <Typography
  //           variant="subtitle1"
  //           fontWeight="bold"
  //           sx={{ textTransform: "capitalize", color: "primary.main" }}
  //         >
  //           {formatKey(key)}
  //         </Typography>
  //         <Divider sx={{ mb: 1 }} />
  //         {renderJsonData(data[key], level + 1)}
  //       </Box>
  //     ))}
  //   </Box>
  // );

  return (
  <Box sx={{ ml: level * 2 }}>
    {[...orderedKeys, ...remainingKeys].map((key) => (
      <Box key={key} sx={{ mb: 3 }}>
        {!hiddenHeadings.includes(key) &&data[key] != null && data[key] !== "" && (
          <>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ textTransform: "capitalize", color: "primary.main" }}
            >
              {formatKey(key)}
            </Typography>
            <Divider sx={{ mb: 1 }} />
          </>
        )}
        {renderJsonData(data[key], level + 1)}
      </Box>
    ))}
  </Box>
)
}
    if (typeof data === "string") {
      // Check if the string is a URL to a PDF or image
      if (data.match(/\.(pdf|png|jpg|jpeg|gif)($|\?)/i)) {
        return renderFileLink(data)
      }
      return <Typography variant="body1">{data}</Typography>
    }

    

    

    return <Typography variant="body1">{String(data)}</Typography>
  }

  const renderStepContent = (step) => {
    const data = getStepData(step)
    if (!data) return "No data available"

    return <Box>{renderJsonData(data)}</Box>
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
    // Convert camelCase to Title Case with spaces
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
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
          Submission Details
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <SectionHeader title="Submission Information" />
          <Chip
            label={submission.status || "pending"}
            color={getStatusColor(submission.status)}
            sx={{ fontWeight: "medium" }}
          />
        </Box>

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
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">
              Reviewer
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
              <Typography variant="body1" fontWeight="medium">
                {reviewer!=null?reviewer.name : "Unassigned"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(submission.reviewedAt) || "Not reviewed yet"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 4 }}>
        {!isMobile && (
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              width: 280,
              p: 2,
              borderRadius: 2,
              position: "sticky",
              top: 24,
              alignSelf: "flex-start",
              height: "fit-content",
            }}
          >
            <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
              {steps.map((step, index) => {
                // Check if any documents in this step have comments
                const stepData = getStepData(index)
                const hasComments = stepData && checkForDocumentComments(stepData)

                return (
                  <Step key={step} completed={hasComments}>
                    <StepButton
                      onClick={handleStep(index)}
                      sx={{
                        textAlign: "left",
                        py: 1.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={activeStep === index ? 600 : 400}
                        color={activeStep === index ? "primary" : "text.primary"}
                      >
                        {step}
                      </Typography>
                      {hasComments && <CommentIcon fontSize="small" sx={{ color: "primary.main", ml: 1 }} />}
                    </StepButton>
                  </Step>
                )
              })}
            </Stepper>
          </Paper>
        )}

        <Box sx={{ flexGrow: 1 }}>
          {isMobile && (
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
              }}
            >
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => {
                  const stepData = getStepData(index)
                  const hasComments = stepData && checkForDocumentComments(stepData)

                  return (
                    <Step key={step} completed={hasComments}>
                      <StepLabel>{step}</StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
            </Paper>
          )}

          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
            }}
          >
            <SectionHeader title={steps[activeStep]} />
            <Box sx={{ minHeight: "300px" }}>{renderStepContent(activeStep)}</Box>
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBackIcon />}
              sx={{ px: 3 }}
            >
              Back
            </Button>
            <Button variant="contained" onClick={handleNext} disabled={activeStep === steps.length - 1} sx={{ px: 3 }}>
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default SeeUploadDetails
