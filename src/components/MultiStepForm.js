"use client"

import { useState } from "react"
import { Box, Button, Typography, Stepper, Step, StepLabel } from "@mui/material"
import BorrowerDetails from "./BorrowerDetails"
// Import other steps if needed, e.g.:
// import LoanDetails from "./LoanDetails"
// import DocumentUpload from "./DocumentUpload"

const steps = ["Borrower Details", "Loan Details", "Upload Documents"] // add/remove as needed

function MultiStepForm() {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({})

  const handleSaveStep = (stepData) => {
    // Merge current step data
    setFormData((prev) => ({
      ...prev,
      ...stepData,
    }))
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleSubmit = () => {
    console.log("Final submitted data:", formData)

    // TODO: Upload files to Cloudinary/MongoDB and store URLs in Firestore
    // e.g. call your backend or Firebase function here
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <BorrowerDetails onSave={handleSaveStep} />

      // Example:
      // case 1:
      //   return <LoanDetails onSave={handleSaveStep} initialData={formData} />

      // case 2:
      //   return <DocumentUpload onSave={handleSubmit} initialData={formData} />

      default:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">All steps completed — you're done!</Typography>
            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
              Submit Final Application
            </Button>
          </Box>
        )
    }
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", mt: 5 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>{renderStepContent()}</Box>

      {activeStep > 0 && activeStep < steps.length && (
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back
        </Button>
      )}
    </Box>
  )
}

export default MultiStepForm
