// "use client";

// import { useState, useEffect } from "react";
// import { Redirect } from "react-router-dom";
// import { createSubmission, getUserInfo, storeMongoDBFileReference } from "../firebase/config";
// import { useAuth } from "../contexts/AuthContext";
// import { Button, Container, Box, Typography, Stepper, Step, StepLabel, CircularProgress, Alert } from "@mui/material";

// import BorrowerDetails from "./BorrowerDetails";
// import LoanFacilities from "./LoanFacilities";
// import Securities from "./Securities";
// import OtherDocuments from "./OtherDocuments";
// import SanctionLetter from "./SanctionLetter";
// import RegistrationOfSecurity from "./RegistrationOfSecurity";
// import Guarantors from "./Guarantors";
// import ConfirmUpload from "./ConfirmUpload"; 

// function UploadDocuments() {
//   const [activeStep, setActiveStep] = useState(0);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const { currentUser, loading } = useAuth();
//   const [userInfo, setUserInfo] = useState(null);

//   useEffect(() => {
//     let isMounted = true;
//     const fetchUserInfo = async () => {
//       if (currentUser) {
//         try {
//           const info = await getUserInfo(currentUser.uid);
//           if (isMounted) {
//             setUserInfo(info);
//           }
//         } catch (error) {
//           console.error("Error fetching user info:", error);
//           if (isMounted) {
//             setError("Failed to fetch user information. Please try logging in again.");
//           }
//         }
//       } else {
//         if (isMounted) {
//           setUserInfo(null);
//         }
//       }
//     };
//     fetchUserInfo();
//     return () => {
//       isMounted = false;
//     };
//   }, [currentUser]);

//   if (loading) {
//     return (
//       <Container component="main" maxWidth="md">
//         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//           <CircularProgress />
//         </Box>
//       </Container>
//     );
//   }

//   if (!currentUser) {
//     return <Redirect to="/login" />;
//   }

//   const steps = ["Borrower Details", "Sanction Letter", "Facilities", "Securities", "Registration Of Security", "Guarantors", "Other Documents"];

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleUpload = async () => {
//     setUploading(true);
//     setError(null);

//     try {
//       if (!currentUser || !userInfo) {
//         throw new Error("User information is missing. Please log in again.");
//       }

//       const mongoDBFiles = [];
//       const uploadTasks = [];

//       const allFormData = JSON.parse(localStorage.getItem("formData") || "{}"); // Fetching from memory if needed

//       // Assuming you collect everything inside FormDataManager correctly.

//       await Promise.all(uploadTasks);

//       for (const fileData of mongoDBFiles) {
//         await storeMongoDBFileReference(currentUser.uid, fileData);
//       }

//       const documents = {
//         borrowerDetails: allFormData.borrowerDetails,
//         sanctionLetter: allFormData.sanctionLetter,
//         loanFacilities: allFormData.loanFacilities,
//         securities: allFormData.securities,
//         registrationOfSecurity: allFormData.registrationOfSecurity,
//         guarantors: allFormData.guarantors,
//         otherDocuments: allFormData.otherDocuments,
//       };

//       const submissionId = await createSubmission(currentUser.uid, userInfo.bankId, documents, mongoDBFiles);
//       alert(`Documents uploaded successfully. Submission ID: ${submissionId}`);
//       setActiveStep(0);
//     } catch (error) {
//       console.error("Error uploading documents: ", error);
//       setError(`Failed to upload documents: ${error.message}`);
//     }

//     setUploading(false);
//   };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return <BorrowerDetails onNext={handleNext} />;
//       case 1:
//         return <SanctionLetter onNext={handleNext} />;
//       case 2:
//         return <LoanFacilities onNext={handleNext} />;
//       case 3:
//         return <Securities onNext={handleNext} />;
//       case 4:
//         return <RegistrationOfSecurity onNext={handleNext} />;
//       case 5:
//         return <Guarantors onNext={handleNext} />;
//       case 6:
//         return <OtherDocuments onNext={handleNext} />;
//       default:
//         return "Unknown step";
//     }
//   };

//   return (
//     <Container component="main" maxWidth="md">
//       <Box sx={{ mt: 8 }}>
//         <Typography component="h1" variant="h4" align="center" gutterBottom>
//           Upload Documents
//         </Typography>
//         <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}
//         {/* {activeStep === steps.length ? (
//           <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//             <Typography variant="h5" gutterBottom>
//               All steps completed - you're finished
//             </Typography>
//             <Button onClick={handleUpload} variant="contained" color="primary" disabled={uploading}>
//               {uploading ? <CircularProgress size={24} /> : "Upload All Documents"}
//             </Button>
//           </Box>
//         ) : (
//           <>
//             {getStepContent(activeStep)}
//             <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
//               {activeStep !== 0 && (
//                 <Button onClick={handleBack} sx={{ mr: 1 }}>
//                   Back
//                 </Button>
//               )}
//             </Box>
//           </>
//         )} */}
//         {activeStep === steps.length ? (
//   <ConfirmUpload />
// ) : (
//   <>
//     {getStepContent(activeStep)}
//     <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
//       {activeStep !== 0 && (
//         <Button onClick={handleBack} sx={{ mr: 1 }}>
//           Back
//         </Button>
//       )}
//       <Button variant="contained" color="primary" onClick={handleNext}>
//         {activeStep === steps.length - 1 ? "Finish" : "Next"}
//       </Button>
//     </Box>
//   </>
// )}

//       </Box>
//     </Container>
//   );
// }

// export default UploadDocuments;


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
import { AppThemeProvider } from "./uiTheme"
import BorrowerDetails from "./BorrowerDetails"
import LoanFacilities from "./LoanFacilities"
import Securities from "./Securities"
import OtherDocuments from "./OtherDocuments"
import SanctionLetter from "./SanctionLetter"
import RegistrationOfSecurity from "./RegistrationOfSecurity"
import Guarantors from "./Guarantors"
import ConfirmUpload from "./ConfirmUpload"

function UploadDocuments() {
  const [activeStep, setActiveStep] = useState(0)
  const [completed, setCompleted] = useState({})
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const steps = [
    { label: "Borrower Details", component: BorrowerDetails },
    { label: "Sanction Letter", component: SanctionLetter },
    { label: "Facilities", component: LoanFacilities },
    { label: "Securities", component: Securities },
    { label: "Registration Of Security", component: RegistrationOfSecurity },
    { label: "Guarantors", component: Guarantors },
    { label: "Other Documents", component: OtherDocuments },
    { label: "Review & Submit", component: ConfirmUpload },
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
            Complete all steps to submit your loan documentation
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

export default UploadDocuments
