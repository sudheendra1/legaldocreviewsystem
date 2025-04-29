"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { Container, Typography, Box, Stepper, Step, StepLabel, Paper, CircularProgress, Button,TextField } from "@mui/material"
import { useHistory } from "react-router-dom"
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useFormData } from "./FormDataManager";
import { collection, setDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function SeeUploadDetails() {
  const { id } = useParams()
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const history = useHistory()
  const { formData, setFormData } = useFormData();
  const { currentUser } = useAuth(); 
  const [existingComments, setExistingComments] = useState({})

 

  const steps = [
    "Borrower Details",
    "Sanction Letter",
    "Facilities",
    "Securities",
    "Registration of Security",
    "Guarantors",
    "Other Documents",
  ]

  const stepName = steps[activeStep];
  const [comment, setComment] = useState(formData?.reviewComments?.[stepName] || "");

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        console.log("Reviewing document with ID:", id)
        const docRef = doc(db, "submissions", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data())
          // Check if the document has the expected structure
          setSubmission(docSnap.data())
        } else {
          console.error("No such document!")
        }
      } catch (error) {
        console.error("Error fetching submission: ", error)
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
            setExistingComments(reviewData.comments || {})
          }
        } catch (error) {
          console.error("Error fetching review comments:", error)
        }
      }
      
      
      

    fetchSubmission()
    fetchReviewComments()
  }, [id])

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    setFormData((prev) => ({
      ...prev,
      reviewComments: {
        ...(prev.reviewComments || {}),
        [stepName]: e.target.value,
      },            
    }));
  };

  
  const handleSubmitReview = async () => {
    try {
      await setDoc(doc(db, "reviews", id), {
        submissionId: id,
        reviewerUid: currentUser.uid,
        reviewerName: currentUser.displayName || currentUser.email.split("@")[0],
        comments: formData.reviewComments || {},
        submittedAt: new Date()
      });
      history.push("/dashboard");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review");
    }
  };
  

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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!submission) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5" color="error">
          No data found for this submission.
        </Typography>
      </Container>
    )
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
            <Box key={index} sx={{ mb: 2, p: 2, border: "1px solid #eee", borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Item {index + 1}
              </Typography>
              {renderJsonData(item, level + 1)}
            </Box>
          ))}
        </Box>
      )
    }

    if (typeof data === "object") {
      return (
        <Box sx={{ ml: level * 2 }}>
          {Object.entries(data).map(([key, value]) => (
            <Box key={key} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ textTransform: "capitalize" }}>
                {formatKey(key)}
              </Typography>
              {renderJsonData(value, level + 1)}
            </Box>
          ))}
        </Box>
      )
    }

    return <Typography variant="body1">{String(data)}</Typography>
  }

  const formatKey = (key) => {
    // Convert camelCase to Title Case with spaces
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  }

  const renderFileLink = (url) => {
    const isPdf = url.toLowerCase().includes(".pdf")

    return (
      <Box sx={{ my: 1 }}>
        {isPdf ? (
          <Box>
            <Button
              variant="outlined"
              href={url}
              target="_blank"
              startIcon={
                <span role="img" aria-label="document">
                  📄
                </span>
              }
            >
              View PDF Document
            </Button>
            <Box sx={{ mt: 2 }}>
              {/* Replace the iframe with a Cloudinary-optimized PDF viewer */}
              <Box
          sx={{
            border: "1px solid #eee",
            height: "600px",
            display: "flex",
            flexDirection: "column",
            p: 2,
            bgcolor: "#f5f5f5",
          }}
        >
          <iframe
            src={url}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="PDF Preview"
          />
        </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <img
                src={url || "/placeholder.svg"}
                alt="Uploaded file"
                style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
              />
            </a>
          </Box>
        )}
      </Box>
    )
  }

  // const renderFileLink = (url) => {
  //   const isPdf = url.toLowerCase().includes(".pdf");
  
  //   return (
  //     <Box sx={{ my: 1 }}>
  //       {isPdf ? (
  //         <iframe
  //           src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
  //           width="100%"
  //           height="600px"
  //           style={{ border: "none" }}
  //           title="PDF Preview"
  //         />
  //       ) : (
  //         <Box>
  //           <a href={url} target="_blank" rel="noopener noreferrer">
  //             <img
  //               src={url || "/placeholder.svg"}
  //               alt="Uploaded file"
  //               style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
  //             />
  //           </a>
  //         </Box>
  //       )}
  //     </Box>
  //   );
  // };
  



  const transformCloudinaryUrl = (url) => {
    // Check if it's a Cloudinary URL
    if (url.includes("cloudinary.com")) {
      // For PDFs, we can use Cloudinary's PDF viewer by adding fl_attachment flag
      // This transforms the URL to make it viewable
      const parts = url.split("/upload/")
      if (parts.length === 2) {
        return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
      }
    }
    return url
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Review Submission Details
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {renderStepContent(activeStep)}
        </Typography>
      </Paper>
      {existingComments[stepName] && (
  <Paper sx={{ mt: 2, p: 2, backgroundColor: "#f9f9f9", borderLeft: "4px solid #1976d2" }}>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      Comment:
    </Typography>
    <Typography variant="body2" color="text.primary">
      {existingComments[stepName]}
    </Typography>
  </Paper>
)}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
      
  <Button variant="contained" onClick={handleNext}>
    Next
  </Button>

     </Box>
    </Container>
  )
}

export default SeeUploadDetails
