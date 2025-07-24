"use client"

import { useState } from "react"
import {
  Button,
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Paper,
  StepButton,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { AppThemeProvider } from "../uiTheme"
import PermissionPage from "./permissionpage"
import SuitByBankPage from "./suitByBank"
import SuitAgainstBankPage from "./suitagainstBank"
import DrtPage from "./DRTPage"
import FinalPage from "./finalPage"
import ConfirmUpload from "./ConfirmUpload"
import SuitType from "./SuitType"


function LitigationMain() {
  const [activeStep, setActiveStep] = useState(0)
  const [completed, setCompleted] = useState({})
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const steps = [
    {label: "Suit Type", component: SuitType},
    { label: "Suit Filing Permissions", component: PermissionPage },
    { label: "Litigation", component: SuitByBankPage },
    { label: "DRT", component: DrtPage },
    { label: "Final", component: FinalPage },
    // { label: "Review & Submit", component: ConfirmUpload },
  ]

  const handleNext = () => {
    const newCompleted = { ...completed }
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStep = (step) => () => {
    setActiveStep(step)
  }

  const totalSteps = () => {
    return steps.length
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const allStepsCompleted = () => {
    return Object.keys(completed).length === totalSteps()
  }

  const CurrentStepComponent = steps[activeStep].component

  return (
    <AppThemeProvider>
      <Container component="main" maxWidth="lg" sx={{ pb: 8 }}>
        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography component="h1" variant="h4" align="center" fontWeight={600} color="primary.dark">
            Legal Document Review System
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mt: 1 }}>
            Complete all steps to submit your documentation review request
          </Typography>
        </Box>

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
                {steps.map((step, index) => (
                  <Step key={step.label} completed={completed[index]}>
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
                        {step.label}
                      </Typography>
                    </StepButton>
                  </Step>
                ))}
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
                  {steps.map((step, index) => (
                    <Step key={step.label} completed={completed[index]}>
                      <StepLabel>{step.label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <CurrentStepComponent onNext={handleNext} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Button onClick={handleBack} disabled={activeStep === 0} variant="outlined" sx={{ px: 3 }}>
                Back
              </Button>

              {activeStep !== steps.length - 1 && (
                <Button variant="contained" color="primary" onClick={handleNext} sx={{ px: 3 }}>
                  Save & Continue
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </AppThemeProvider>
  )
}

export default LitigationMain
