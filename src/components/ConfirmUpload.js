"use client"

import { useState } from "react"
import {
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel,
  Divider,
  CircularProgress,
  Fade,
  Zoom,
  Card,
  CardContent,
  TextField,
} from "@mui/material"
import { useFormData } from "./FormDataManager"
import { db } from "../firebase/config"
import { collection, addDoc } from "firebase/firestore"
import { useHistory } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { uploadToS3 } from "../utils/s3Upload"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import HomeIcon from "@mui/icons-material/Home"

function ConfirmUpload() {
  const { formData, setFormData } = useFormData()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [submissionId, setSubmissionId] = useState(null)
  const history = useHistory()
  const { currentUser } = useAuth()
  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  const [submissionName, setSubmissionName] = useState("")

  const steps = ["Document Review", "Uploading", "Confirmation"]

  const countFiles = (data) => {
    let count = 0

    const countNestedFiles = (obj) => {
      if (!obj) return

      if (typeof obj === "object") {
        if (obj instanceof File) {
          count++
        } else if (Array.isArray(obj)) {
          obj.forEach((item) => countNestedFiles(item))
        } else {
          Object.values(obj).forEach((value) => countNestedFiles(value))
        }
      }
    }

    countNestedFiles(data)
    return count
  }

  const handleConfirmUpload = async () => {
    if (!currentUser) {
      setError("You must be logged in to upload documents.")
      return
    }

    if (!submissionName.trim()) {
      setError("Please enter your name before submitting.")
      return
    }

    setUploading(true)
    setError(null)
    setSuccessMessage(null)
    setActiveStep(1)

    const fileCount = countFiles(formData)
    setTotalFiles(fileCount)
    setUploadedFiles(0)

    try {
      const tempData = { ...formData }

      
      for (const section in tempData) {
        for (const key in tempData[section]) {
          if (typeof tempData[section][key] === "object") {
            if (tempData[section][key] instanceof File) {
              
              const fileUrl = await uploadToS3(tempData[section][key], (percent) => {
                setProgress(percent)
              })
              tempData[section][key] = fileUrl
              setUploadedFiles((prev) => prev + 1)
            } else if (Array.isArray(tempData[section][key])) {
              
              tempData[section][key] = await Promise.all(
                tempData[section][key].map(async (item) => {
                  if (item?.file instanceof File) {
                    const fileUrl = await uploadToS3(item.file, (percent) => {
                      setProgress(percent)
                    })
                    setUploadedFiles((prev) => prev + 1)
                    return { ...item, file: fileUrl }
                  }
                  return item
                }),
              )
            } else if (typeof tempData[section][key] === "object") {
              
              const nestedObj = { ...tempData[section][key] }
              for (const nestedKey in nestedObj) {
                if (nestedObj[nestedKey] instanceof File) {
                  const fileUrl = await uploadToS3(nestedObj[nestedKey], (percent) => {
                    setProgress(percent)
                  })
                  nestedObj[nestedKey] = fileUrl
                  setUploadedFiles((prev) => prev + 1)
                }
              }
              tempData[section][key] = nestedObj
            }
          }
        }
      }

      
      const docRef = await addDoc(collection(db, "submissions"), {
        ...tempData,
        submittedBy: currentUser.displayName || (currentUser.email ? currentUser.email.split("@")[0] : "Unknown User"),
        submittedByUid: currentUser.uid,
        submittedAt: new Date(),
        status: "pending",
        userId: currentUser.uid,
        name: submissionName,
      })

      setSubmissionId(docRef.id)
      setSuccessMessage(`Your documents have been successfully uploaded and submitted for review.`)
      setFormData({}) 
      setActiveStep(2)
    } catch (err) {
      console.error(err)
      setError("Something went wrong during upload. Please try again.")
      setActiveStep(0)
    } finally {
      setUploading(false)
    }
  }

  const handleGoToDashboard = () => {
    history.push("/dashboard")
  }

  const handleGoBack = () => {
    history.goBack()
  }

  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {activeStep === 0 && (
          <Fade in={activeStep === 0}>
            <Box>
              <Typography variant="h5" gutterBottom align="center">
                Ready to Submit Your Documents
              </Typography>

              <Typography variant="body1" paragraph align="center" color="text.secondary">
                Please review your information before final submission. Once submitted, your documents will be sent for
                review.
              </Typography>

              <TextField
                label="Submission Name"
                value={submissionName}
                onChange={(e) => setSubmissionName(e.target.value)}
                fullWidth
                required
                sx={{ mb: 3 }}
              />


              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button variant="outlined" onClick={handleGoBack} sx={{ mr: 2 }} startIcon={<ArrowBackIcon />}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirmUpload}
                  disabled={uploading}
                  startIcon={<CloudUploadIcon />}
                  size="large"
                >
                  Submit Documents
                </Button>
              </Box>
            </Box>
          </Fade>
        )}

        {activeStep === 1 && (
          <Fade in={activeStep === 1}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                Uploading Your Documents
              </Typography>

              <Box sx={{ mt: 4, mb: 2 }}>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Upload Progress: {progress}%
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Uploaded {uploadedFiles} of {totalFiles} files
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Please don't close this window until the upload is complete.
              </Typography>
            </Box>
          </Fade>
        )}

        {activeStep === 2 && (
          <Zoom in={activeStep === 2}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />

              <Typography variant="h5" gutterBottom>
                Submission Complete!
              </Typography>

              <Alert severity="success" sx={{ mb: 4, mt: 2 }}>
                {successMessage}
              </Alert>

              <Card sx={{ mb: 4, textAlign: "left", bgcolor: "background.default" }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Submission ID
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {submissionId}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Submitted On
                  </Typography>
                  <Typography variant="body1">{new Date().toLocaleString()}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <Typography variant="body1">
                    <Alert severity="warning" icon={false} sx={{ display: "inline-flex", py: 0 }}>
                      Pending Review
                    </Alert>
                  </Typography>
                </CardContent>
              </Card>

              <Box sx={{ mt: 4 }}>
                <Button variant="contained" onClick={handleGoToDashboard} startIcon={<HomeIcon />} size="large">
                  Return to Dashboard
                </Button>
              </Box>
            </Box>
          </Zoom>
        )}
      </Paper>
    </Container>
  )
}

export default ConfirmUpload
