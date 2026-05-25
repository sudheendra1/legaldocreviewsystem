"use client"

import { useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
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
  TextField,
  Divider,
  Card,
  CardContent,
  Alert,
  IconButton,
  Grid,
  StepButton,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useFormData } from "./FormDataManager"
import { useAuth } from "../../contexts/AuthContext"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ImageIcon from "@mui/icons-material/Image"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import VisibilityIcon from "@mui/icons-material/Visibility"
import SaveIcon from "@mui/icons-material/Save"
import SendIcon from "@mui/icons-material/Send"
import SectionHeader from "../sectionHeader"
import api from "../../services/api"

function ReviewDocumentDetails() {
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
  const [existingReview, setExistingReview] = useState(null)

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
    // const fetchSubmissionAndReview = async () => {
    //   try {
    //     console.log("Reviewing document with ID:", id)

    //     // Fetch submission data
    //     const docRef = doc(db, "submissions", id)
    //     const docSnap = await getDoc(docRef)

    //     if (docSnap.exists()) {
    //       console.log("Document data:", docSnap.data())
    //       setSubmission(docSnap.data())
    //     } else {
    //       console.error("No such document!")
    //       setError("Document not found. It may have been deleted or you don't have permission to view it.")
    //       return
    //     }

    //     // Fetch existing review data
    //     const reviewRef = doc(db, "reviews", id)
    //     const reviewSnap = await getDoc(reviewRef)

    //     if (reviewSnap.exists()) {
    //       const reviewData = reviewSnap.data()
    //       console.log("Existing review data:", reviewData)
    //       setExistingReview(reviewData)

    //       // Populate form data with existing comments
    //       setFormData((prev) => ({
    //         ...prev,
    //         documentComments: reviewData.documentComments || {},
    //       }))
    //     } else {
    //       console.log("No existing review found")
    //       // Initialize empty document comments if no existing review
    //       setFormData((prev) => ({
    //         ...prev,
    //         documentComments: {},
    //       }))
    //     }
    //   } catch (error) {
    //     console.error("Error fetching submission or review: ", error)
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
                // setExistingComments(reviewResponse.data.documentComments || {});
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

    fetchSubmissionAndReview()
  }, [id, setFormData])

  const handleDocumentCommentChange = (documentUrl, newComment) => {
    setFormData((prev) => ({
      ...prev,
      documentComments: {
        ...(prev.documentComments || {}),
        [documentUrl]: newComment,
      },
    }))
  }

  // const handleSubmitReview = async () => {
  //   try {
  //     setSubmitting(true)

  //     // Prepare review data
  //     const reviewData = {
  //       submissionId: id,
  //       reviewerUid: currentUser.uid,
  //       reviewerName: currentUser.displayName || currentUser.email.split("@")[0],
  //       documentComments: formData.documentComments || {},
  //       submittedAt: new Date(),
  //     }

  //     // If this is an update to existing review, preserve the original submission date
  //     if (existingReview) {
  //       reviewData.originalSubmittedAt = existingReview.submittedAt || existingReview.originalSubmittedAt
  //       reviewData.lastUpdated = new Date()
  //     }

  //     // Save/update the review
  //     await setDoc(doc(db, "reviews", id), reviewData)

  //     // Update submission status
  //     await updateDoc(doc(db, "submissions", id), {
  //       status: "under-review",
  //       reviewedAt: new Date(),
  //       reviewer: currentUser.uid,
  //     })

  //     history.push("/dashboard")
  //   } catch (err) {
  //     console.error("Error submitting review:", err)
  //     setError("Failed to submit review. Please try again.")
  //   } finally {
  //     setSubmitting(false)
  //   }
  // }

  const handleSubmitReview = async () => {
    try {
      setSubmitting(true)

      const reviewData = {
        submissionId: id,
        reviewerUid: currentUser.uid,
        reviewerName: currentUser.displayName || currentUser.email.split("@")[0],
        documentComments: formData.documentComments || {},
      }

      // Send the review to your Spring Boot backend
      await api.post(`/reviews`, reviewData);

      // Update the submission status in Spring Boot
      await api.put(`/vetting/submissions/${id}/status`, {
        status: "under-review",
        reviewer: currentUser.uid
      });

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
    return documentUrls.some((url) => formData.documentComments[url] && formData.documentComments[url].trim() !== "")
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

  const renderFileLink = (url) => {
    const isPdf = url.toLowerCase().includes(".pdf")
    const currentComment = formData?.documentComments?.[url] || ""

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
                mb: 3,
              }}
            >
              <iframe src={url} width="100%" height="100%" style={{ border: "none" }} title="PDF Preview" />
            </Paper>

            {/* Individual comment box for this PDF */}
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: currentComment ? "rgba(25, 118, 210, 0.04)" : "grey.50",
                borderLeft: currentComment ? "4px solid #1976d2" : "none",
              }}
            >
              <Typography variant="subtitle2" gutterBottom color="primary.dark">
                Comments for this document
                {existingReview && currentComment && (
                  <Typography component="span" variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
                    (Previously reviewed on {formatDate(existingReview.submittedAt)})
                  </Typography>
                )}
              </Typography>
              <TextField
                label="Add your comments for this PDF"
                multiline
                fullWidth
                rows={3}
                value={currentComment}
                onChange={(e) => handleDocumentCommentChange(url, e.target.value)}
                placeholder="Enter your observations, issues, or recommendations for this specific document..."
                variant="outlined"
                size="small"
              />
            </Paper>
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
                mb: 3,
              }}
            >
              <img
                src={url || "/placeholder.svg"}
                alt="Uploaded file"
                style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
              />
            </Paper>

            {/* Individual comment box for this image */}
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: currentComment ? "rgba(25, 118, 210, 0.04)" : "grey.50",
                borderLeft: currentComment ? "4px solid #1976d2" : "none",
              }}
            >
              <Typography variant="subtitle2" gutterBottom color="primary.dark">
                Comments for this image
                {existingReview && currentComment && (
                  <Typography component="span" variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
                    (Previously reviewed on {formatDate(existingReview.submittedAt)})
                  </Typography>
                )}
              </Typography>
              <TextField
                label="Add your comments for this image"
                multiline
                fullWidth
                rows={3}
                value={currentComment}
                onChange={(e) => handleDocumentCommentChange(url, e.target.value)}
                placeholder="Enter your observations, issues, or recommendations for this specific image..."
                variant="outlined"
                size="small"
              />
            </Paper>
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

    if (typeof data === "string") {
      // Check if the string is a URL to a PDF or image
      if (data.match(/\.(pdf|png|jpg|jpeg|gif)($|\?)/i)) {
        return renderFileLink(data)
      }
      return <Typography variant="body1">{data}</Typography>
    }

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

    if (typeof data === "object") {
      const stepFields = sectionFieldOrder[steps[activeStep]] || []
      const orderedKeys = stepFields.filter((key) => key in data)
      const remainingKeys = Object.keys(data).filter((key) => !orderedKeys.includes(key))

      return (
        <Box sx={{ ml: level * 2 }}>
          {[...orderedKeys, ...remainingKeys].map((key) => {
            let value = data[key]

            // If this is the 'files' field and it's an array, filter out null/empty items
            if ((key === "files" || key === "documents") && Array.isArray(value)) {
              if (Array.isArray(value)) {
                value = value.filter((item) => item != null && item !== "")
              } else if (typeof value === "object" && value !== null) {
                const filteredEntries = Object.entries(value).filter(([_, val]) => val != null && val !== "")
                value = Object.fromEntries(filteredEntries)
              }
            }

            if (
              value == null ||
              value === "" ||
              (typeof value === "object" && Object.keys(value).length === 0) ||
              (Array.isArray(value) && value.length === 0)
            ) {
              return null
            }

            return (
              <Box key={key} sx={{ mb: 3 }}>
                {!hiddenHeadings.includes(key) && data[key] != null && data[key] !== "" && (
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
                {renderJsonData(value, level + 1)}
              </Box>
            )
          })}
        </Box>
      )
    }

    return <Typography variant="body1">{String(data)}</Typography>
  }

  const renderStepContent = (step) => {
    const data = getStepData(step)
    if (!data) return "No data available"

    return <Box>{renderJsonData(data)}</Box>
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
          Review Document
          {existingReview && (
            <Typography component="span" variant="h6" sx={{ ml: 2, color: "text.secondary" }}>
              (Editing existing review)
            </Typography>
          )}
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
          {existingReview && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Last Reviewed
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDate(existingReview.submittedAt)}
              </Typography>
            </Grid>
          )}
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
            <Box>
              {activeStep === steps.length - 1 ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    startIcon={<SendIcon />}
                    sx={{ px: 3 }}
                  >
                    {submitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  startIcon={<SaveIcon />}
                  sx={{ px: 3 }}
                >
                  Save & Continue
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default ReviewDocumentDetails
