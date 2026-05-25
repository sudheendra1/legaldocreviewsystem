"use client"

import { useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"
import { doc, getDoc, collection, getDocs, query, where, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/config"
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
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material"
import { useAuth } from "../../contexts/AuthContext"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ImageIcon from "@mui/icons-material/Image"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CommentIcon from "@mui/icons-material/Comment"
import PersonIcon from "@mui/icons-material/Person"
import DescriptionIcon from "@mui/icons-material/Description"
import SummarizeIcon from "@mui/icons-material/Summarize"
import EditIcon from "@mui/icons-material/Edit"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import SectionHeader from "../sectionHeader"
import { uploadToS3, deleteMultipleFromS3 } from "../../utils/s3Upload"
import api from "../../services/api"

// Document Title Component for Summary Report
function DocumentTitle({ url, path, reviews, formatDate, onChangeDocument }) {
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

  const hasComments = documentReviews.length > 0

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
            {hasComments && (
              <Typography variant="caption" color="primary" sx={{ ml: 1, fontWeight: "bold" }}>
                ({documentReviews.length} review{documentReviews.length > 1 ? "s" : ""})
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {hasComments && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={(e) => {
                  e.stopPropagation()
                  onChangeDocument(url, path)
                }}
                color="warning"
              >
                Change
              </Button>
            )}
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

function SeeUploadDetails() {
  const { id } = useParams()
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [tabValue, setTabValue] = useState(0)
  const history = useHistory()
  const { currentUser } = useAuth()
  const [existingComments, setExistingComments] = useState({})
  const [error, setError] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [reviewer, setReviewer] = useState(null)

  // Document change states
  const [changeDialogOpen, setChangeDialogOpen] = useState(false)
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState("")
  const [selectedDocumentPath, setSelectedDocumentPath] = useState("")
  const [newFile, setNewFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [changedDocuments, setChangedDocuments] = useState({})
  const [hasChanges, setHasChanges] = useState(false)

  const steps = [
    "Borrower Details",
    "Sanction Letter",
    "Facilities",
    "Securities",
    "Registration of Security",
    "Guarantors",
    "Other Documents",
  ]

  useEffect(() => {
    // const fetchSubmission = async () => {
    //   try {
    //     console.log("Viewing document with ID:", id)
    //     const docRef = doc(db, "submissions", id)
    //     const docSnap = await getDoc(docRef)

    //     if (docSnap.exists()) {
    //       console.log("Document data:", docSnap.data())
    //       setSubmission(docSnap.data())
    //       if (docSnap.data().reviewer) {
    //         const docRefRev = doc(db, "users", docSnap.data().reviewer)
    //         const docSnapRev = await getDoc(docRefRev)
    //         setReviewer(docSnapRev.data())
    //         console.log("Reviewer data:", docSnapRev.data())
    //       }
    //     } else {
    //       console.error("No such document!")
    //       setError("Document not found. It may have been deleted or you don't have permission to view it.")
    //     }
    //   } catch (error) {
    //     console.error("Error fetching submission: ", error)
    //     setError(`Error loading document: ${error.message}`)
    //   } finally {
    //     setLoading(false)
    //   }
    // }

  const fetchSubmissionAndReview = async () => {
      try {
        setLoading(true);
        // Fetch the specific document from Spring Boot
        const response = await api.get(`/vetting/submissions/${id}`);
        setSubmission(response.data);
        
        // Fetch the review details for this document
        try {
            const reviewResponse = await api.get(`/reviews/submission/${id}`);
            if (reviewResponse.data) {
                setExistingComments(reviewResponse.data.documentComments || {});
            }
        } catch (reviewErr) {
            console.log("No existing review found yet.");
        }
      } catch (error) {
        console.error("Error fetching submission: ", error)
        setError(`Error loading document.`)
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
          setExistingComments(reviewData.documentComments || reviewData.comments || {})
        }
      } catch (error) {
        console.error("Error fetching review comments:", error)
      }
    }

    // const fetchReviews = async () => {
    //   if (!id) return

    //   setLoadingReviews(true)
    //   try {
    //     const reviewsQuery = query(collection(db, "reviews"), where("submissionId", "==", id))
    //     const reviewsSnapshot = await getDocs(reviewsQuery)
    //     const reviewsData = reviewsSnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }))
    //     setReviews(reviewsData)
    //   } catch (error) {
    //     console.error("Error fetching reviews:", error)
    //   } finally {
    //     setLoadingReviews(false)
    //   }
    // }

    fetchSubmissionAndReview()
    fetchReviewComments()
    // fetchReviews()
  }, [id])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

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

  // Document change handlers
  const handleChangeDocument = (url, path) => {
    setSelectedDocumentUrl(url)
    setSelectedDocumentPath(path)
    setChangeDialogOpen(true)
    setNewFile(null)
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setNewFile(file)
    }
  }

  const handleConfirmChange = async () => {
    if (!newFile) {
      setError("Please select a file to upload.")
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Upload new file to S3
      const newFileUrl = await uploadToS3(newFile, (percent) => {
        setUploadProgress(percent)
      })

      // Store the change locally
      setChangedDocuments((prev) => ({
        ...prev,
        [selectedDocumentUrl]: newFileUrl,
      }))

      setHasChanges(true)
      setChangeDialogOpen(false)
      setNewFile(null)
      setUploadProgress(0)
    } catch (err) {
      console.error("Error uploading file:", err)
      setError("Failed to upload file. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmitChanges = async () => {
    if (!hasChanges) return

    setUploading(true)
    setError(null)

    try {
      // Create updated submission data
      const updatedSubmission = { ...submission }
      const filesToDelete = [] // Track old files to delete

      // Replace old URLs with new ones in the submission data
      const replaceUrls = (obj) => {
        if (typeof obj === "string" && changedDocuments[obj]) {
          // Add old file URL to deletion list
          filesToDelete.push(obj)
          return changedDocuments[obj]
        }
        if (Array.isArray(obj)) {
          return obj.map(replaceUrls)
        }
        if (typeof obj === "object" && obj !== null) {
          const newObj = {}
          for (const [key, value] of Object.entries(obj)) {
            newObj[key] = replaceUrls(value)
          }
          return newObj
        }
        return obj
      }

      // Apply URL replacements to all sections
      Object.keys(updatedSubmission).forEach((key) => {
        if (typeof updatedSubmission[key] === "object" && updatedSubmission[key] !== null) {
          updatedSubmission[key] = replaceUrls(updatedSubmission[key])
        }
      })

      // Update the document in Firebase first
      const docRef = doc(db, "submissions", id)
      await updateDoc(docRef, {
        ...updatedSubmission,
        lastModified: new Date(),
        modifiedBy: currentUser.uid,
        status: "pending-under-review", // Change status to indicate it needs review again
      })

      // Delete old files from S3 after successful Firebase update
      if (filesToDelete.length > 0) {
        console.log(`Deleting ${filesToDelete.length} old files from S3...`)
        const deleteResults = await deleteMultipleFromS3(filesToDelete)

        if (deleteResults.failed.length > 0) {
          console.warn(`Failed to delete ${deleteResults.failed.length} files:`, deleteResults.failed)
        }

        console.log(`Successfully deleted ${deleteResults.successful.length} old files from S3`)
      }

      // Update local state
      setSubmission(updatedSubmission)
      setChangedDocuments({})
      setHasChanges(false)

      // Show success message
      setError(null)
      const message =
        filesToDelete.length > 0
          ? "Documents updated successfully! Old files have been removed from storage."
          : "Documents updated successfully!"
      alert(message)
    } catch (err) {
      console.error("Error updating submission:", err)
      setError("Failed to update documents. Please try again.")
    } finally {
      setUploading(false)
    }
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
    const hasComment = !!documentComment

    // Use changed URL if available
    const displayUrl = changedDocuments[url] || url

    return (
      <Box sx={{ my: 3 }}>
        {isPdf ? (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PictureAsPdfIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="body2" fontWeight="medium">
                  PDF Document
                </Typography>
                <Button
                  variant="outlined"
                  href={displayUrl}
                  target="_blank"
                  startIcon={<VisibilityIcon />}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  Open in New Tab
                </Button>
              </Box>
              {hasComment && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleChangeDocument(url, "")}
                  color="warning"
                >
                  Change Document
                </Button>
              )}
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
              <iframe src={displayUrl} width="100%" height="100%" style={{ border: "none" }} title="PDF Preview" />
            </Paper>

            {/* Display reviewer comment for this specific document */}
            {documentComment && (
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "rgba(37, 99, 235, 0.04)",
                  borderLeft: "4px solid #2563eb",
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
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ImageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" fontWeight="medium">
                  Image
                </Typography>
                <Button
                  variant="outlined"
                  href={displayUrl}
                  target="_blank"
                  startIcon={<VisibilityIcon />}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  View Full Size
                </Button>
              </Box>
              {hasComment && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleChangeDocument(url, "")}
                  color="warning"
                >
                  Change Document
                </Button>
              )}
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
                src={displayUrl || "/placeholder.svg"}
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
                  borderLeft: "4px solid #2563eb",
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
    Facilities: ["facilityType", "documents"],
    Securities: ["securityType", "mortgageType", "files"],
    "Registration of Security": ["securityType", "files"],
    Guarantors: ["borrowerConstitution", "guarantorConstitution", "guarontorConstitution", "formData", "files"],
  }
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

    if (typeof data === "object" && data !== null) {
      const orderedKeys = sectionFieldOrder[steps[activeStep]]?.filter((key) => key in data) || Object.keys(data)
      const remainingKeys = Object.keys(data).filter((key) => !orderedKeys.includes(key))

      return (
        <Box sx={{ ml: level * 2 }}>
          {[...orderedKeys, ...remainingKeys].map((key) => (
            <Box key={key} sx={{ mb: 3 }}>
              {!hiddenHeadings.includes(key) && data[key] != null && data[key] !== "" && (
                <>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ textTransform: "capitalize", color: "#1976d2" }}
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
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  }

  // Summary Report Functions
  const renderDocumentTitle = (url, path) => {
    return (
      <DocumentTitle
        url={url}
        path={path}
        reviews={reviews}
        formatDate={formatDate}
        onChangeDocument={handleChangeDocument}
      />
    )
  }

  const renderSummaryJsonData = (data, level = 0, path = "") => {
    if (!data) return null

    if (typeof data === "string") {
      if (data.match(/\.(pdf|png|jpg|jpeg|gif)($|\?)/i)) {
        return renderDocumentTitle(data, path)
      }
      return null
    }

    if (Array.isArray(data)) {
      const renderedItems = data
        .map((item, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            {renderSummaryJsonData(item, level + 1, `${path}[${index}]`)}
          </Box>
        ))
        .filter((item) => item.props.children !== null)

      return renderedItems.length > 0 ? <Box>{renderedItems}</Box> : null
    }

    if (typeof data === "object") {
      const renderedEntries = Object.entries(data)
        .map(([key, value]) => {
          const newPath = path ? `${path}.${key}` : key
          const isDocument = typeof value === "string" && value.match(/\.(pdf|png|jpg|jpeg|gif)($|\?)/i)

          if (isDocument || (typeof value === "object" && value !== null)) {
            const renderedValue = renderSummaryJsonData(value, level + 1, newPath)
            if (renderedValue) {
              return (
                <Box key={key} sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ textTransform: "capitalize", color: "#1976d2" }}
                  >
                    {formatKey(key)}
                  </Typography>
                  {renderedValue}
                </Box>
              )
            }
          }
          return null
        })
        .filter(Boolean)

      return renderedEntries.length > 0 ? <Box>{renderedEntries}</Box> : null
    }

    return null
  }

  const renderSummaryStepContent = (step) => {
    const data = getStepData(step)
    if (!data) return "No documents available"

    const hasAnyDocuments = extractDocumentUrls(data).length > 0

    if (!hasAnyDocuments) {
      return (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No documents available in this section
          </Typography>
        </Box>
      )
    }

    return (
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click on a document to expand it. Click the eye icon to open in a new tab.
        </Typography>
        {renderSummaryJsonData(data) || (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No reviews yet
            </Typography>
          </Box>
        )}
      </Box>
    )
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

      {/* Submit Changes Button */}
      {hasChanges && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography>You have unsaved document changes.</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitChanges}
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
            >
              {uploading ? "Submitting..." : "Submit Changes"}
            </Button>
          </Box>
        </Alert>
      )}

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
                {reviewer != null ? reviewer.name : "Unassigned"}
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

      {/* Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Upload Details" icon={<DescriptionIcon />} iconPosition="start" />
          <Tab label="Summary Report" icon={<SummarizeIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 ? (
        // Upload Details Tab (Original stepper view)
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
                        {hasComments && <CommentIcon fontSize="small" sx={{ color: "#1976d2", ml: 1 }} />}
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
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
                sx={{ px: 3 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        // Summary Report Tab
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
              {renderSummaryStepContent(index)}
            </Box>
          ))}
        </Paper>
      )}

      {/* Change Document Dialog */}
      <Dialog open={changeDialogOpen} onClose={() => setChangeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Document</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a new file to replace the current document.
          </Typography>

          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.gif"
            onChange={handleFileSelect}
            style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
          />

          {newFile && (
            <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
              Selected: {newFile.name}
            </Typography>
          )}

          {uploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Upload Progress: {uploadProgress}%
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangeDialogOpen(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmChange}
            variant="contained"
            disabled={!newFile || uploading}
            startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default SeeUploadDetails
