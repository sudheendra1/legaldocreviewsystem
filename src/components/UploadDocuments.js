"use client"

import { useState } from "react"
import { storage, db } from "../firebase/config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, addDoc } from "firebase/firestore"
import { useAuth } from "../contexts/AuthContext"
import { Button, Container, Box, Typography, Stepper, Step, StepLabel, CircularProgress } from "@mui/material"
import BorrowerDetails from "./BorrowerDetails"
import LoanFacilities from "./LoanFacilities"
import Securities from "./Securities"
import OtherDocuments from "./OtherDocuments"
import SanctionLetter from "./SanctionLetter"
import RegistrationOfSecurity from "./RegistrationOfSecurity"
import Guarantors from "./Guarantors"

function UploadDocuments() {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()

  const steps = ["Borrower Details", "Sanction Letter","Facilities", "Securities", "Registration Of Security","Guarantors","Other Documents"]

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSave = (stepData) => {
    setFormData({ ...formData, [steps[activeStep]]: stepData })
    handleNext()
  }

  const handleUpload = async () => {
    setUploading(true)
    setError(null)

    try {
      const uploadedFiles = {}
      const allFiles = [
        ...Object.values(formData["Borrower Details"].files || {}),
        ...Object.values(formData["Securities"].files || {}),
        ...formData["Other Documents"].map((doc) => doc.file),
      ]

      for (const file of allFiles) {
        const storageRef = ref(storage, `documents/${file.name}`)
        await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(storageRef)
        uploadedFiles[file.name] = downloadURL
      }

      await addDoc(collection(db, "documents"), {
        borrowerDetails: formData["Borrower Details"],
        sanctionLetter: formData["Sanction Letter"],
        loanFacilities: formData["Loan Facilities"],
        securities: formData["Securities"],
        registrationOfSecurity: formData["Registration Of Security"],
        guarantors: formData["Guarantors"],
        otherDocuments: formData["Other Documents"],
        files: uploadedFiles,
        uploadedBy: currentUser.uid,
        status: "pending",
        uploadedAt: new Date(),
      })

      alert("Documents uploaded successfully")
      setFormData({})
      setActiveStep(0)
    } catch (error) {
      console.error("Error uploading documents: ", error)
      setError("Failed to upload documents. Please try again.")
    }

    setUploading(false)
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <BorrowerDetails onSave={handleSave} />
      case 1:
        return <SanctionLetter onSave={handleSave} />
      case 2:
        return <LoanFacilities onSave={handleSave} />
      case 3:
        return <Securities onSave={handleSave} />
      case 4:
        return <RegistrationOfSecurity onSave={handleSave} />
      case 5:
        return <Guarantors onSave={handleSave} />
      case 6:
        return <OtherDocuments onSave={handleSave} />
      default:
        return "Unknown step"
    }
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Upload Documents
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {error && <Typography color="error">{error}</Typography>}
        {activeStep === steps.length ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h5" gutterBottom>
              All steps completed - you're finished
            </Typography>
            <Button onClick={handleUpload} variant="contained" color="primary" disabled={uploading}>
              {uploading ? <CircularProgress size={24} /> : "Upload All Documents"}
            </Button>
          </Box>
        ) : (
          <>
            {getStepContent(activeStep)}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              <Button variant="contained" color="primary" onClick={handleNext} sx={{ mr: 1 }}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  )
}

export default UploadDocuments

