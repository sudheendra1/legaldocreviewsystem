// "use client"

// import { useState,useEffect } from "react"
// // import { storage, db, createSubmission,getUserInfo } from "../firebase/config"
// // import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
// import { Redirect } from "react-router-dom"
// import { createSubmission, getUserInfo, storeMongoDBFileReference } from "../firebase/config"
// import { uploadFileToMongoDB } from "../services/mongoService"
// import { useAuth } from "../contexts/AuthContext"
// import { Button, Container, Box, Typography, Stepper, Step, StepLabel, CircularProgress,Alert } from "@mui/material"
// import BorrowerDetails from "./BorrowerDetails"
// import LoanFacilities from "./LoanFacilities"
// import Securities from "./Securities"
// import OtherDocuments from "./OtherDocuments"
// import SanctionLetter from "./SanctionLetter"
// import RegistrationOfSecurity from "./RegistrationOfSecurity"
// import Guarantors from "./Guarantors"
// // import { redirect } from "next/navigation"

// function UploadDocuments() {
//   const [activeStep, setActiveStep] = useState(0)
//   const [formData, setFormData] = useState({})
//   const [uploading, setUploading] = useState(false)
//   const [error, setError] = useState(null)
//   const { currentUser, loading } = useAuth()
//   const [userInfo, setUserInfo] = useState(null)

//   useEffect(() => {
//     let isMounted = true // Add a flag to track component mount status
//     // Fetch user info from Firestore
//     const fetchUserInfo = async () => {
//       if (currentUser) {
//         try {
//           const info = await getUserInfo(currentUser.uid)
//           if (isMounted) {
//             setUserInfo(info)
//           }        } catch (error) {
//           console.error("Error fetching user info:", error)
//           if (isMounted) {
//             setError("Failed to fetch user information. Please try logging in again.")
//           }
//         }
//       } else {
//         if (isMounted) {
//           setUserInfo(null)      
//           }
//       }
//     }
//     fetchUserInfo()
//     return () => {
//       isMounted = false // Set the flag to false when the component unmounts
//     }
//   }, [currentUser])
//   if (loading) {
//     return (
//       <Container component="main" maxWidth="md">
//         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//           <CircularProgress />
//         </Box>
//       </Container>
//     )
//   }

//   // Redirect to login if not authenticated
//   if (!currentUser) {
//     // redirect("/login")
//     return <Redirect to="/login" />
//   }

//   const steps = ["Borrower Details", "Sanction Letter","Facilities", "Securities", "Registration Of Security","Guarantors","Other Documents"]

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1)
//   }

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1)
//   }

//   const handleSave = (stepData) => {
//     setFormData({ ...formData, [steps[activeStep]]: stepData })
//     handleNext()
//   }

//   const handleUpload = async () => {
//     setUploading(true)
//     setError(null)

//     try {
//       if (!currentUser || !userInfo) {
//         throw new Error("User information is missing. Please log in again.")
//       }
//       // const uploadedFiles = {}
//       // const allFiles = [
//       //   ...Object.values(formData["Borrower Details"].files || {}),
//       //   ...Object.values(formData["Securities"].files || {}),
//       //   ...formData["Other Documents"].map((doc) => doc.file),
//       // ]

//       // for (const file of allFiles) {
//       //   const storageRef = ref(storage, `documents/${currentUser.uid}/${file.name}`)
//       //   await uploadBytes(storageRef, file)
//       //   const downloadURL = await getDownloadURL(storageRef)
//       //   uploadedFiles[file.name] = downloadURL
//       // }

//       const mongoDBFiles = []

//       // Upload files to MongoDB and store references
//       const uploadTasks = []

//       // Process Borrower Details files
//       if (formData["Borrower Details"]?.files) {
//         for (const [key, file] of Object.entries(formData["Borrower Details"].files)) {
//           uploadTasks.push(
//             uploadFileToMongoDB(file, currentUser.uid, `borrower_${key}`).then((fileData) => {
//               mongoDBFiles.push({
//                 ...fileData,
//                 category: "Borrower Details",
//                 fieldName: key,
//               })
//             }),
//           )
//         }
//       }

//       // Process Securities files
//       if (formData["Securities"]?.files) {
//         for (const [key, file] of Object.entries(formData["Securities"].files)) {
//           uploadTasks.push(
//             uploadFileToMongoDB(file, currentUser.uid, `security_${key}`).then((fileData) => {
//               mongoDBFiles.push({
//                 ...fileData,
//                 category: "Securities",
//                 fieldName: key,
//               })
//             }),
//           )
//         }
//       }

//       // Process Sanction Letter files
//       if (formData["Sanction Letter"]?.files) {
//         for (const [key, file] of Object.entries(formData["Sanction Letter"].files)) {
//           uploadTasks.push(
//             uploadFileToMongoDB(file, currentUser.uid, `sanction_${key}`).then((fileData) => {
//               mongoDBFiles.push({
//                 ...fileData,
//                 category: "Sanction Letter",
//                 fieldName: key,
//               })
//             }),
//           )
//         }
//       }

//       // Process Registration Of Security files
//       if (formData["Registration Of Security"]?.files) {
//         for (const [key, file] of Object.entries(formData["Registration Of Security"].files)) {
//           uploadTasks.push(
//             uploadFileToMongoDB(file, currentUser.uid, `registration_${key}`).then((fileData) => {
//               mongoDBFiles.push({
//                 ...fileData,
//                 category: "Registration Of Security",
//                 fieldName: key,
//               })
//             }),
//           )
//         }
//       }

//       // Process Guarantors files
//       if (formData["Guarantors"]?.files) {
//         for (const [key, file] of Object.entries(formData["Guarantors"].files)) {
//           uploadTasks.push(
//             uploadFileToMongoDB(file, currentUser.uid, `guarantor_${key}`).then((fileData) => {
//               mongoDBFiles.push({
//                 ...fileData,
//                 category: "Guarantors",
//                 fieldName: key,
//               })
//             }),
//           )
//         }
//       }

//       // Process Other Documents
//       // if (formData["Other Documents"]?.length) {
//         const otherDocs = Array.isArray(formData["Other Documents"]) ? formData["Other Documents"] : []
//         // for (const doc of formData["Other Documents"]) {
//           console.log("Other Documents raw value:", formData["Other Documents"])
//           console.log("Is array:", Array.isArray(formData["Other Documents"]))
//           for (const doc of otherDocs) {
//           if (doc.file) {
//             uploadTasks.push(
//               uploadFileToMongoDB(doc.file, currentUser.uid, `other_${doc.description}`).then((fileData) => {
//                 mongoDBFiles.push({
//                   ...fileData,
//                   category: "Other Documents",
//                   description: doc.description,
//                 })
//               }),
//             )
//           }
//         }
//       // }

//       // Wait for all uploads to complete
//       await Promise.all(uploadTasks)

//       // Store MongoDB file references in Firestore
//       for (const fileData of mongoDBFiles) {
//         await storeMongoDBFileReference(currentUser.uid, fileData)
//       }

//       // Create submission with form data and MongoDB file references

//       const documents = {
//         borrowerDetails: formData["Borrower Details"],
//         sanctionLetter: formData["Sanction Letter"],
//         loanFacilities: formData["Loan Facilities"],
//         securities: formData["Securities"],
//         registrationOfSecurity: formData["Registration Of Security"],
//         guarantors: formData["Guarantors"],
//         otherDocuments: formData["Other Documents"],
//         //files: uploadedFiles,
//       }

//       //const submissionId = await createSubmission(currentUser.uid, userInfo.bankId, documents)
//       const submissionId = await createSubmission(currentUser.uid, userInfo.bankId, documents, mongoDBFiles)
//       alert(`Documents uploaded successfully. Submission ID: ${submissionId}`)      
//       setFormData({})
//       setActiveStep(0)
//     } catch (error) {
//       console.error("Error uploading documents: ", error)
//       setError(`Failed to upload documents: ${error.message}`)    }

//     setUploading(false)
//   }

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return <BorrowerDetails onSave={handleSave} />
//       case 1:
//         return <SanctionLetter onSave={handleSave} />
//       case 2:
//         return <LoanFacilities onSave={handleSave} />
//       case 3:
//         return <Securities onSave={handleSave} />
//       case 4:
//         return <RegistrationOfSecurity onSave={handleSave} />
//       case 5:
//         return <Guarantors onSave={handleSave} />
//       case 6:
//         return <OtherDocuments onSave={handleSave} />
//       default:
//         return "Unknown step"
//     }
//   }

//   // if (!userInfo) {
//   //   return (
//   //     <Container component="main" maxWidth="md">
//   //       <Box sx={{ mt: 8 }}>
//   //         <Alert severity="info">Loading user information...</Alert>
//   //       </Box>
//   //     </Container>
//   //   )
//   // }

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
//           {activeStep === steps.length ? (
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
//               <Button variant="contained" color="primary" onClick={handleNext} sx={{ mr: 1 }}>
//                 {activeStep === steps.length - 1 ? "Finish" : "Next"}
//               </Button>
//             </Box>
//           </>
//         )}
//       </Box>
//     </Container>
//   )
// }

// export default UploadDocuments


"use client";

import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { createSubmission, getUserInfo, storeMongoDBFileReference } from "../firebase/config";
import { uploadFileToMongoDB } from "../services/mongoService";
import { useAuth } from "../contexts/AuthContext";
import { Button, Container, Box, Typography, Stepper, Step, StepLabel, CircularProgress, Alert } from "@mui/material";

import BorrowerDetails from "./BorrowerDetails";
import LoanFacilities from "./LoanFacilities";
import Securities from "./Securities";
import OtherDocuments from "./OtherDocuments";
import SanctionLetter from "./SanctionLetter";
import RegistrationOfSecurity from "./RegistrationOfSecurity";
import Guarantors from "./Guarantors";
import ConfirmUpload from "./ConfirmUpload"; 

function UploadDocuments() {
  const [activeStep, setActiveStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser, loading } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUserInfo = async () => {
      if (currentUser) {
        try {
          const info = await getUserInfo(currentUser.uid);
          if (isMounted) {
            setUserInfo(info);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
          if (isMounted) {
            setError("Failed to fetch user information. Please try logging in again.");
          }
        }
      } else {
        if (isMounted) {
          setUserInfo(null);
        }
      }
    };
    fetchUserInfo();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  if (loading) {
    return (
      <Container component="main" maxWidth="md">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  const steps = ["Borrower Details", "Sanction Letter", "Facilities", "Securities", "Registration Of Security", "Guarantors", "Other Documents"];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleUpload = async () => {
    setUploading(true);
    setError(null);

    try {
      if (!currentUser || !userInfo) {
        throw new Error("User information is missing. Please log in again.");
      }

      const mongoDBFiles = [];
      const uploadTasks = [];

      const allFormData = JSON.parse(localStorage.getItem("formData") || "{}"); // Fetching from memory if needed

      // Assuming you collect everything inside FormDataManager correctly.

      await Promise.all(uploadTasks);

      for (const fileData of mongoDBFiles) {
        await storeMongoDBFileReference(currentUser.uid, fileData);
      }

      const documents = {
        borrowerDetails: allFormData.borrowerDetails,
        sanctionLetter: allFormData.sanctionLetter,
        loanFacilities: allFormData.loanFacilities,
        securities: allFormData.securities,
        registrationOfSecurity: allFormData.registrationOfSecurity,
        guarantors: allFormData.guarantors,
        otherDocuments: allFormData.otherDocuments,
      };

      const submissionId = await createSubmission(currentUser.uid, userInfo.bankId, documents, mongoDBFiles);
      alert(`Documents uploaded successfully. Submission ID: ${submissionId}`);
      setActiveStep(0);
    } catch (error) {
      console.error("Error uploading documents: ", error);
      setError(`Failed to upload documents: ${error.message}`);
    }

    setUploading(false);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <BorrowerDetails onNext={handleNext} />;
      case 1:
        return <SanctionLetter onNext={handleNext} />;
      case 2:
        return <LoanFacilities onNext={handleNext} />;
      case 3:
        return <Securities onNext={handleNext} />;
      case 4:
        return <RegistrationOfSecurity onNext={handleNext} />;
      case 5:
        return <Guarantors onNext={handleNext} />;
      case 6:
        return <OtherDocuments onNext={handleNext} />;
      default:
        return "Unknown step";
    }
  };

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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {/* {activeStep === steps.length ? (
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
            </Box>
          </>
        )} */}
        {activeStep === steps.length ? (
  <ConfirmUpload />
) : (
  <>
    {getStepContent(activeStep)}
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
      {activeStep !== 0 && (
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
      )}
      <Button variant="contained" color="primary" onClick={handleNext}>
        {activeStep === steps.length - 1 ? "Finish" : "Next"}
      </Button>
    </Box>
  </>
)}

      </Box>
    </Container>
  );
}

export default UploadDocuments;
