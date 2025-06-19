// "use client"

// import { useState , useEffect} from "react"
// import {
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Paper,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Grid,
//   IconButton,
// } from "@mui/material"
// import AddIcon from "@mui/icons-material/Add"
// import DeleteIcon from "@mui/icons-material/Delete"
// import { useFormData } from "./FormDataManager";

// function Guarantors({ onNext }) {
//   // const [borrowerConstitution, setBorrowerConstitution] = useState("")
//   // const [formData, setFormData] = useState({})
//   // const [files, setFiles] = useState({})

//   const { formData, setFormData } = useFormData();
//   const [borrowerConstitution, setBorrowerConstitution] = useState(formData?.guarantors?.borrowerConstitution || "");
//   const [localData, setLocalData] = useState(formData?.guarantors?.formData || {});
//   const [files, setFiles] = useState(formData?.guarantors?.files || {});
  

//   // const handleInputChange = (e) => {
//   //   const { name, value } = e.target
//   //   setFormData((prevState) => ({
//   //     ...prevState,
//   //     [name]: value,
//   //   }))
//   // }

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       guarantors: {
//         borrowerConstitution,
//         formData: localData,
//         files,
//       },
//     }));
//   }, [borrowerConstitution, localData, files, setFormData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setLocalData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // const handleFileChange = (e, fieldName) => {
//   //   if (e.target.files[0]) {
//   //     setFiles((prevState) => ({
//   //       ...prevState,
//   //       [fieldName]: e.target.files[0],
//   //     }))
//   //   }
//   // }

//   const handleFileChange = (e, fieldName) => {
//     if (e.target.files[0]) {
//       setFiles((prevState) => ({
//         ...prevState,
//         [fieldName]: e.target.files[0],
//       }));
//     }
//   };

//   // const handleAddBorrower = () => {
//   //   const newBorrowerNumber = Object.keys(formData).filter((key) => key.startsWith("borrowerName")).length + 1
//   //   setFormData((prevState) => ({
//   //     ...prevState,
//   //     [`borrowerName${newBorrowerNumber}`]: "",
//   //   }))
//   // }

//   const handleAddGuarantor = () => {
//     const newGuarantorNumber = Object.keys(localData).filter((key) => key.startsWith("guarantorName")).length + 1;
// setLocalData((prevState) => ({
//   ...prevState,
//   [`guarantorName${newGuarantorNumber}`]: "",
// }));
//   };

//   const handleDeleteGuarantor = (key) => {
//     const newLocalData = { ...localData };
//     delete newLocalData[key];
//     setLocalData(newLocalData);
//   };

//   // const handleSubmit = (e) => {
//   //   e.preventDefault()
//   //   onSave({ ...formData, files, borrowerConstitution })
//   // }

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onNext();
//   };

//   const renderFormFields = () => {
//     switch (borrowerConstitution) {
//       case "individual":
//         return (
//           <>
//             {Object.keys(localData)
//               .filter((key) => key.startsWith("guarantorName"))
//               .map((key, index) => (
//                 <Box key={index} sx={{ mb: 2 }}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid item xs={10}>
//                       <TextField
//                         fullWidth
//                         label={`Name of Guarantor no. ${index + 1}`}
//                         name={key}
//                         value={localData[key]}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Grid>
//                     <Grid item xs={2}>
//                       <IconButton
//                         onClick={ () => handleDeleteGuarantor(key) }
//                         color="error"
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               ))}
//             <Button startIcon={<AddIcon />} onClick={handleAddGuarantor} sx={{ mt: 2 }}>
//               Add Guarantor
//             </Button>
//           </>
//         )
//       case "partnership":
//         return (
//           <>
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Name of Firm"
//               name="firmName"
//               value={localData.firmName || ""}
//               onChange={handleInputChange}
//               required
//             />
//             <input type="file" onChange={(e) => handleFileChange(e, "partnershipDeed")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload Partnership Deed (PDF only)</Typography>
//             <input type="file" onChange={(e) => handleFileChange(e, "resolutionofpartners")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload Resolution of all Partners (PDF only)</Typography>
//             <input type="file" onChange={(e) => handleFileChange(e, "guaranteeDeed")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
//           </>
//         )
//       case "llp":
//             return (
//               <>
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Name of LLP"
//                   name="llpName"
//                   value={localData.firmName || ""}
//                   onChange={handleInputChange}
//                   required
//                 />
//                 <input type="file" onChange={(e) => handleFileChange(e, "registrationDeed")} accept="application/pdf" required/>
//                 <Typography variant="body1">Upload Registration Deed (PDF only)</Typography>
//                 <input type="file" onChange={(e) => handleFileChange(e, "resolutionofpartners")} accept="application/pdf" required/>
//                 <Typography variant="body1">Upload Resolution of all Partners (PDF only)</Typography>
//                 <input type="file" onChange={(e) => handleFileChange(e, "guaranteeDeed")} accept="application/pdf" required/>
//                 <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
//               </>
//             )
//       case "huf":
//                 return (
//                      <>
//                       <TextField
//                          fullWidth
//                            margin="normal"
//                            label="Name of HUF"
//                            name="hufName"
//                            value={localData.firmName || ""}
//                             onChange={handleInputChange}
//                            required
//                            />
//                            <input type="file" onChange={(e) => handleFileChange(e, "declarationofkarta")} accept="application/pdf" required/>
//                            <Typography variant="body1">Upload Declaration of Karta in Notarized copy (PDF only)</Typography>
//                             <input type="file" onChange={(e) => handleFileChange(e, "resolutionofHuf")} accept="application/pdf" required/>
//                            <Typography variant="body1">Upload Resolution of Members (PDF only)</Typography>
//                            <input type="file" onChange={(e) => handleFileChange(e, "guaranteDeed")} accept="application/pdf" required/>
//                            <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
//                             </>
//           )
//        case "society":
//                 return (
//                   <>
//                     <TextField
//                       fullWidth
//                       margin="normal"
//                       label="Name of Society"
//                       name="societyName"
//                       value={localData.firmName || ""}
//                       onChange={handleInputChange}
//                       required
//                     />
//                     <input type="file" onChange={(e) => handleFileChange(e, "societyMemorandum")} accept="application/pdf" required/>
//                     <Typography variant="body1">Upload Memorandum of Society (PDF only)</Typography>
//                     <input type="file" onChange={(e) => handleFileChange(e, "resolutionofSociety")} accept="application/pdf" required/>
//                     <Typography variant="body1">Upload Resolution (PDF only)</Typography>
//                     <input type="file" onChange={(e) => handleFileChange(e, "guaranteeDeed")} accept="application/pdf" required/>
//                     <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
//                     <input type="file" onChange={(e) => handleFileChange(e, "byLaws")} accept="application/pdf" required/>
//                     <Typography variant="body1">Upload byLaws (PDF only)</Typography>
//                   </>
//                 )
//        case "trust":
//                 return (
//                       <>
//                         <TextField
//                           fullWidth
//                           margin="normal"
//                           label="Name of Trust"
//                           name="trustName"
//                           value={localData.firmName || ""}
//                           onChange={handleInputChange}
//                           required
//                         />
//                         <input type="file" onChange={(e) => handleFileChange(e, "trustDeed")} accept="application/pdf" required/>
//                         <Typography variant="body1">Upload Trust Deed (PDF only)</Typography>
//                         <input type="file" onChange={(e) => handleFileChange(e, "resolutionofSociety")} accept="application/pdf" required/>
//                         <Typography variant="body1">Upload Resolution (PDF only)</Typography>
//                         <input type="file" onChange={(e) => handleFileChange(e, "guaranteeDeed")} accept="application/pdf" required/>
//                         <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
//                         <input type="file" onChange={(e) => handleFileChange(e, "permissionoftrus")} accept="application/pdf" required/>
//                         <Typography variant="body1">Upload Permission of Commissioner of Trust (PDF only)</Typography>
//                       </>
//                     )
//         case "company":
//                         return (
//                           <>
//                             <TextField
//                               fullWidth
//                               margin="normal"
//                               label="Name of Company"
//                               name="companyName"
//                               value={localData.firmName || ""}
//                               onChange={handleInputChange}
//                               required
//                             />
//                             <input type="file" onChange={(e) => handleFileChange(e, "associationMemorandum")} accept="application/pdf" required/>
//                             <Typography variant="body1">Upload Memorandum of Association (PDF only)</Typography>
//                             <input type="file" onChange={(e) => handleFileChange(e, "articleofassociation")} accept="application/pdf" required/>
//                             <Typography variant="body1">Upload Article of Association(PDF only)</Typography>
//                             <input type="file" onChange={(e) => handleFileChange(e, "resolution")} accept="application/pdf" required/>
//                             <Typography variant="body1">Upload Resolution (PDF only)</Typography>
//                             <input type="file" onChange={(e) => handleFileChange(e, "guaranteeDeed")} accept="application/pdf" required/>
//                             <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
                           
//                           </>
//                         )
//         case "other":
//                 return (
//                               <>
//                                 <TextField
//                                   fullWidth
//                                   margin="normal"
//                                   label="Name of Constitution"
//                                   name="constitutionName"
//                                   value={localData.firmName || ""}
//                                   onChange={handleInputChange}
//                                   required
//                                 />
//                                 <input type="file" onChange={(e) => handleFileChange(e, "establishment")} accept="application/pdf" required/>
//                                 <Typography variant="body1">Upload Document of Establishment (PDF only)</Typography>
//                                 <input type="file" onChange={(e) => handleFileChange(e, "resolution")} accept="application/pdf" required/>
//                                 <Typography variant="body1">Upload Resolution (PDF only)</Typography>
//                                 <input type="file" onChange={(e) => handleFileChange(e, "guaranteeDeed")} accept="application/pdf" required/>
//                                 <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
//                                 <input type="file" onChange={(e) => handleFileChange(e, "otherdocs")} accept="application/pdf" required/>
//                                 <Typography variant="body1">Upload Other Documents(PDF only)</Typography>
                               
//                               </>
//                             )
//       default:
//         return null
//     }
//   }

//   return (
//     <Paper elevation={3} sx={{ p: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         Guarantor Details
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Guarantor Type</InputLabel>
//           <Select value={borrowerConstitution} onChange={(e) => setBorrowerConstitution(e.target.value)} required>
//             <MenuItem value="individual">Individual</MenuItem>
//             <MenuItem value="partnership">Partnership</MenuItem>
//             <MenuItem value="llp">LLP</MenuItem>
//             <MenuItem value="society">Society</MenuItem>
//             <MenuItem value="trust">Trust</MenuItem>
//             <MenuItem value="huf">HUF</MenuItem>
//             <MenuItem value="company">Company</MenuItem>
//             <MenuItem value="other">Other</MenuItem>
//           </Select>
//         </FormControl>

//         {borrowerConstitution && <Box sx={{ mt: 2 }}>{renderFormFields()}</Box>}

//         <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
//           Save and Continue
//         </Button>
//       </form>
//     </Paper>
//   )
// }

// export default Guarantors


"use client"

import { useState, useEffect } from "react"
import {
  TextField,
  Button,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import PersonIcon from "@mui/icons-material/Person"
import SectionHeader from "./sectionHeader"
import FileUpload from "./fileUpload"
import { useFormData } from "./FormDataManager"

function Guarantors({ onNext }) {
  const { formData, setFormData } = useFormData()
  const [guarontorConstitution, setGuarontorConstitution] = useState(formData?.guarantors?.guarontorConstitution || "")
  const [localData, setLocalData] = useState(formData?.guarantors?.formData || {})
  const [files, setFiles] = useState(formData?.guarantors?.files || {})

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      guarantors: {
        guarontorConstitution,
        formData: localData,
        files,
      },
    }))
  }, [guarontorConstitution, localData, files, setFormData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLocalData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleFileChange = (e, fieldName) => {
    if (e.target.files[0]) {
      setFiles((prevState) => ({
        ...prevState,
        [fieldName]: e.target.files[0],
      }))
    }
  }

  const handleAddGuarantor = () => {
    const newGuarantorNumber = Object.keys(localData).filter((key) => key.startsWith("guarantorName")).length + 1
    setLocalData((prevState) => ({
      ...prevState,
      [`guarantorName${newGuarantorNumber}`]: "",
    }))
  }

  const handleDeleteGuarantor = (key) => {
    const newLocalData = { ...localData }
    delete newLocalData[key]
    setLocalData(newLocalData)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext()
  }

  const renderFormFields = () => {
    switch (guarontorConstitution) {
      case "individual":
        return (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Individual Guarantor Details
            </Typography>

            {Object.keys(localData)
              .filter((key) => key.startsWith("guarantorName"))
              .map((key, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 2, borderColor: "rgba(0, 0, 0, 0.12)" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PersonIcon sx={{ color: "primary.main", mr: 1 }} />
                      <Typography variant="subtitle2">Guarantor #{index + 1}</Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <IconButton
                        onClick={() => handleDeleteGuarantor(key)}
                        color="error"
                        size="small"
                        sx={{
                          bgcolor: "rgba(239, 68, 68, 0.1)",
                          "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <TextField
                      fullWidth
                      label="Full Name"
                      name={key}
                      value={localData[key]}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      placeholder="Enter guarantor's full legal name"
                    />
                    <Grid item xs={12} md={6}>
                                  <FileUpload
                                    label="Document of Identity"
                                    onChange={(e) => handleFileChange(e, "Gaurantor Identity"+(index+1))}
                                    required
                                    helperText="Upload the official document of identity"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                          <FileUpload
                            label={`Gaurantee Deed for ${guarontorConstitution} `}
                            onChange={(e) => handleFileChange(e, guarontorConstitution + "document")}
                            required
                            helperText={`Upload the gaurantee deed of ${guarontorConstitution}`}
                          />
                        </Grid>
                  </CardContent>
                </Card>
              ))}

            <Button startIcon={<AddIcon />} onClick={handleAddGuarantor} variant="outlined" sx={{ mt: 1 }}>
              Add Guarantor
            </Button>
          </>
        )

      
      case "partnership":
      case "llp":
      case "huf":
      case "society":
      case "trust":
      case "company":
      case "other":
       
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={`Name of ${
                  guarontorConstitution === "company"
                    ? "Company"
                    : guarontorConstitution === "society"
                      ? "Society"
                      : guarontorConstitution === "trust"
                        ? "Trust"
                        : guarontorConstitution === "huf"
                          ? "HUF"
                          : guarontorConstitution === "partnership"
                            ? "Firm"
                            : guarontorConstitution === "llp"
                              ? "LLP"
                              : "Entity"
                }`}
                name={`${guarontorConstitution} Name`}
                value={localData[`${guarontorConstitution} Name`] || ""}
                onChange={handleInputChange}
                required
                variant="outlined"
                placeholder={`Enter the legal name of the ${guarontorConstitution}`}
              />
            </Grid>

            <Grid item xs={12} md={6}>
                          <FileUpload
                            label={`Gaurantee Deed for ${guarontorConstitution} `}
                            onChange={(e) => handleFileChange(e, guarontorConstitution + "document")}
                            required
                            helperText={`Upload the gaurantee deed of ${guarontorConstitution}`}
                          />
                        </Grid>
                        

            {/* Dynamically render file uploads based on entity type */}
            {guarontorConstitution === "partnership" && (
              <>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Partnership Deed"
                    onChange={(e) => handleFileChange(e, "partnership Deed")}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Resolution of Partners"
                    onChange={(e) => handleFileChange(e, "resolution of partners")}
                    required
                  />
                </Grid>
              </>
            )}
            {guarontorConstitution === "company" && (
              <>
              <Grid item xs={12} md={6}>
                          <FileUpload
                            label={`Resolution for ${guarontorConstitution} `}
                            onChange={(e) => handleFileChange(e, guarontorConstitution + "resolution")}
                            required
                            helperText={`Upload the resolution for ${guarontorConstitution}`}
                          />
                        </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Memorandum of Association"
                    onChange={(e) => handleFileChange(e, "associationMemorandum")}
                    required
                    helperText={`Upload the memorandom of association`}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Articles of Association"
                    onChange={(e) => handleFileChange(e, "associationArticles")}
                    required
                    helperText={`Upload the Articles of association`}
                  />
                </Grid>
              </>
            )}

            {guarontorConstitution === "society" && (
              <>
              <Grid item xs={12} md={6}>
                          <FileUpload
                            label={`Resolution for ${guarontorConstitution} `}
                            onChange={(e) => handleFileChange(e, guarontorConstitution + "resolution")}
                            required
                            helperText={`Upload the resolution for ${guarontorConstitution}`}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FileUpload
                            label={`Bylaws for ${guarontorConstitution} `}
                            onChange={(e) => handleFileChange(e, guarontorConstitution + "Bylaws")}
                            required
                            helperText={`Upload the ByLaws for ${guarontorConstitution}`}
                          />
                        </Grid>
              </>)}

              {guarontorConstitution === "trust" && (
              <>
              <Grid item xs={12} md={6}>
                          <FileUpload
                            label={`Resolution for ${guarontorConstitution} `}
                            onChange={(e) => handleFileChange(e, guarontorConstitution + "resolution")}
                            required
                            helperText={`Upload the resolution for ${guarontorConstitution}`}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FileUpload
                            label={`Trust Deed'`}
                            onChange={(e) => handleFileChange(e, "TrustDeed")}
                            required
                            helperText={`Upload the trust deed`}
                          />
                        </Grid>
              </>)}
              {guarontorConstitution === "huf" && (
              <>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Authority Letter"
                    onChange={(e) => handleFileChange(e, "Authority Letter")}
                    helperText={`Upload the Authority Letter`}
                    required
                  />
                </Grid>
              </>
            )}

             {guarontorConstitution === "llp" && (
              <>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Partnership Deed"
                    onChange={(e) => handleFileChange(e, "partnership Deed")}
                    helperText={`Upload the partnership deed`}
                    required
                  />
                </Grid>
              </>
            )}

            {/* Similar patterns for other entity types */}
          </Grid>
        )

      default:
        return (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">Please select a guarantor type to continue</Typography>
          </Box>
        )
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <SectionHeader title="Guarantor Details" subtitle="Provide information about the guarantors for this loan" />

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="guarantor-type-label">Guarantor Type</InputLabel>
          <Select
            labelId="guarantor-type-label"
            value={guarontorConstitution}
            onChange={(e) => setGuarontorConstitution(e.target.value)}
            required
            label="Guarantor Type"
          >
            <MenuItem value="individual">Individual</MenuItem>
            <MenuItem value="partnership">Partnership</MenuItem>
            <MenuItem value="llp">Limited Liability Partnership (LLP)</MenuItem>
            <MenuItem value="society">Society</MenuItem>
            <MenuItem value="trust">Trust</MenuItem>
            <MenuItem value="huf">Hindu Undivided Family (HUF)</MenuItem>
            <MenuItem value="company">Company</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>

        {guarontorConstitution && <Box sx={{ mt: 2, mb: 4 }}>{renderFormFields()}</Box>}

        <Divider sx={{ my: 3 }} />

        {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained" color="primary" size="large" disabled={!borrowerConstitution}>
            Save & Continue
          </Button>
        </Box> */}
      </form>
    </Paper>
  )
}

export default Guarantors
