// "use client"

// import { useState, useEffect } from "react"
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

// function BorrowerDetails({ onNext }) {
//   const { formData, setFormData } = useFormData();
//   const [borrowerConstitution, setBorrowerConstitution] = useState(formData?.borrowerDetails?.borrowerConstitution || "");
//   const [localData, setLocalData] = useState(formData?.borrowerDetails?.formData || {});
//   const [files, setFiles] = useState(formData?.borrowerDetails?.files || {});

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       borrowerDetails: {
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

//   const handleFileChange = (e, fieldName) => {
//     if (e.target.files[0]) {
//       setFiles((prevState) => ({
//         ...prevState,
//         [fieldName]: e.target.files[0],
//       }));
//     }
//   };

//   const handleAddBorrower = () => {
//     const newBorrowerNumber = Object.keys(localData).filter((key) => key.startsWith("borrowerName")).length + 1;
//     setLocalData((prevState) => ({
//       ...prevState,
//       [`borrowerName${newBorrowerNumber}`]: "",
//     }));
//   };

//   const handleDeleteBorrower = (key) => {
//     const newLocalData = { ...localData };
//     delete newLocalData[key];
//     setLocalData(newLocalData);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onNext(); // move to next step
//   };

//   const renderFormFields = () => {
//     switch (borrowerConstitution) {
//       case "individual":
//         return (
//           <>
//             {Object.keys(localData)
//               .filter((key) => key.startsWith("borrowerName"))
//               .map((key, index) => (
//                 <Box key={index} sx={{ mb: 2 }}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid item xs={10}>
//                       <TextField
//                         fullWidth
//                         label={`Name of Borrower no. ${index + 1}`}
//                         name={key}
//                         value={localData[key]}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Grid>
//                     <Grid item xs={2}>
//                       <IconButton onClick={() => handleDeleteBorrower(key)} color="error">
//                         <DeleteIcon />
//                       </IconButton>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               ))}
//             <Button startIcon={<AddIcon />} onClick={handleAddBorrower} sx={{ mt: 2 }}>
//               Add Borrower
//             </Button>
//           </>
//         );
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
//             <input type="file" onChange={(e) => handleFileChange(e, "letterOfPartnership")} accept="application/pdf"required />
//             <Typography variant="body1">Upload Letter of Partnership (PDF only)</Typography>
//           </>
//         );
//       case "llp":
//         return (
//           <>
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Name of LLP"
//               name="llpName"
//               value={localData.llpName || ""}
//               onChange={handleInputChange}
//               required
//             />
//             <input type="file" onChange={(e) => handleFileChange(e, "registrationDeed")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload Registration Deed (PDF only)</Typography>
//             <input type="file" onChange={(e) => handleFileChange(e, "resolutionofpartners")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload Resolution of all Partners (PDF only)</Typography>
//           </>
//         );
//       case "society":
//         return (
//           <>
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Name of Society"
//               name="societyName"
//               value={localData.societyName || ""}
//               onChange={handleInputChange}
//               required
//             />
//             <input type="file" onChange={(e) => handleFileChange(e, "societyMemorandum")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload Memorandum of Society (PDF only)</Typography>
//             <input type="file" onChange={(e) => handleFileChange(e, "resolutionofSociety")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload Resolution (PDF only)</Typography>
//             <input type="file" onChange={(e) => handleFileChange(e, "byLaws")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload byLaws (PDF only)</Typography>
//           </>
//         );
//       case "trust":
//         return (
//           <>
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Name of Trust"
//               name="trustName"
//               value={localData.trustName || ""}
//               onChange={handleInputChange}
//               required
//             />
//             <input type="file" onChange={(e) => handleFileChange(e, "trustDeed")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload Trust Deed (PDF only)</Typography>
//             <input type="file" onChange={(e) => handleFileChange(e, "resolutionofSociety")} accept="application/pdf"required />
//             <Typography variant="body1">Upload Resolution (PDF only)</Typography>
//             <input type="file" onChange={(e) => handleFileChange(e, "permissionoftrust")} accept="application/pdf"required />
//             <Typography variant="body1">Upload Permission of Commissioner of Trust (PDF only)</Typography>
//           </>
//         );
//       case "huf":
//         return (
//           <>
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Name of HUF"
//               name="hufName"
//               value={localData.hufName || ""}
//               onChange={handleInputChange}
//               required
//             />
//             <input type="file" onChange={(e) => handleFileChange(e, "declarationofkarta")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload Declaration of Karta (PDF only)</Typography>
//             <input type="file" onChange={(e) => handleFileChange(e, "resolutionofHuf")} accept="application/pdf" required />
//             <Typography variant="body1">Upload Resolution of Members (PDF only)</Typography>
//           </>
//         );
//       case "company":
//         return (
//           <>
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Name of Company"
//               name="companyName"
//               value={localData.companyName || ""}
//               onChange={handleInputChange}
//               required
//             />
//             <input type="file" onChange={(e) => handleFileChange(e, "associationMemorandum")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload Memorandum of Association (PDF only)</Typography>
//             <input type="file" onChange={(e) => handleFileChange(e, "articleofassociation")} accept="application/pdf" required />
//             <Typography variant="body1">Upload Articles of Association (PDF only)</Typography>
//             <input type="file" onChange={(e) => handleFileChange(e, "resolution")} accept="application/pdf" required />
//             <Typography variant="body1">Upload Resolution (PDF only)</Typography>
//           </>
//         );
//       case "other":
//         return (
//           <>
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Name of Constitution"
//               name="constitutionName"
//               value={localData.constitutionName || ""}
//               onChange={handleInputChange}
//               required
//             />
//             <input type="file" onChange={(e) => handleFileChange(e, "establishment")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload Document of Establishment (PDF only)</Typography>
//             <input type="file" onChange={(e) => handleFileChange(e, "resolution")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload Resolution (PDF only)</Typography>
//             <input type="file" onChange={(e) => handleFileChange(e, "otherdocs")} accept="application/pdf" required/>
//             <Typography variant="body1">Upload Other Documents (PDF only)</Typography>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         Borrower Details
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Borrower Constitution</InputLabel>
//           <Select
//             value={borrowerConstitution}
//             onChange={(e) => setBorrowerConstitution(e.target.value)}
//             required
//           >
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
//   );
// }

// export default BorrowerDetails;


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
  Divider,
  Card,
  CardContent,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import PersonIcon from "@mui/icons-material/Person"
import SectionHeader from "./sectionHeader"
import FileUpload from "./fileUpload"
import { useFormData } from "./FormDataManager"

function BorrowerDetails({ onNext }) {
  const { formData, setFormData } = useFormData()
  const [borrowerConstitution, setBorrowerConstitution] = useState(
    formData?.borrowerDetails?.borrowerConstitution || "",
  )
  const [localData, setLocalData] = useState(formData?.borrowerDetails?.formData || {})
  const [files, setFiles] = useState(formData?.borrowerDetails?.files || {})

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      borrowerDetails: {
        borrowerConstitution,
        formData: localData,
        files,
      },
    }))
  }, [borrowerConstitution, localData, files, setFormData])

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

  const handleAddBorrower = () => {
    const newBorrowerNumber = Object.keys(localData).filter((key) => key.startsWith("borrowerName")).length + 1
    setLocalData((prevState) => ({
      ...prevState,
      [`borrowerName${newBorrowerNumber}`]: "",
    }))
  }

  const handleDeleteBorrower = (key) => {
    const newLocalData = { ...localData }
    delete newLocalData[key]
    setLocalData(newLocalData)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext()
  }

  const renderFormFields = () => {
    switch (borrowerConstitution) {
      case "individual":
        return (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Individual Borrower Details
            </Typography>

            {Object.keys(localData)
              .filter((key) => key.startsWith("borrowerName"))
              .map((key, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 2, borderColor: "rgba(0, 0, 0, 0.12)" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PersonIcon sx={{ color: "primary.main", mr: 1 }} />
                      <Typography variant="subtitle2">Borrower #{index + 1}</Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <IconButton
                        onClick={() => handleDeleteBorrower(key)}
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
                      placeholder="Enter borrower's full legal name"
                    />

<Grid item xs={12} md={6}>
              <FileUpload
                label="Document of Identity"
                onChange={(e) => handleFileChange(e, "IndividualIdentity"+(index+1))}
                required
                helperText="Upload the official partnership deed document"
              />
            </Grid>
                  </CardContent>
                </Card>
              ))}

            <Button startIcon={<AddIcon />} onClick={handleAddBorrower} variant="outlined" sx={{ mt: 1 }}>
              Add Borrower
            </Button>
          </>
        )

      case "partnership":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name of Firm"
                name="firmName"
                value={localData.firmName || ""}
                onChange={handleInputChange}
                required
                variant="outlined"
                placeholder="Enter the legal name of the partnership firm"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileUpload
                label="Partnership Deed"
                onChange={(e) => handleFileChange(e, "partnershipDeed")}
                required
                helperText="Upload the official partnership deed document"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileUpload
                label="Letter of Partnership"
                onChange={(e) => handleFileChange(e, "letterOfPartnership")}
                required
                helperText="Upload the letter of partnership document"
              />
            </Grid>
          </Grid>
        )

      case "llp":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name of LLP"
                name="llpName"
                value={localData.llpName || ""}
                onChange={handleInputChange}
                required
                variant="outlined"
                placeholder="Enter the legal name of the Limited Liability Partnership"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileUpload
                label="Registration Deed"
                onChange={(e) => handleFileChange(e, "registrationDeed")}
                required
                helperText="Upload the LLP registration deed document"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileUpload
                label="Resolution of Partners"
                onChange={(e) => handleFileChange(e, "resolutionofpartners")}
                required
                helperText="Upload the resolution signed by all partners"
              />
            </Grid>
          </Grid>
        )

      // Similar pattern for other entity types
      case "society":
      case "trust":
      case "huf":
      case "company":
      case "other":
        // These would follow the same pattern as above, with appropriate fields
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={`Name of ${
                  borrowerConstitution === "company"
                    ? "Company"
                    : borrowerConstitution === "society"
                      ? "Society"
                      : borrowerConstitution === "trust"
                        ? "Trust"
                        : borrowerConstitution === "huf"
                          ? "HUF"
                          : "Entity"
                }`}
                name={`${borrowerConstitution}Name`}
                value={localData[`${borrowerConstitution}Name`] || ""}
                onChange={handleInputChange}
                required
                variant="outlined"
                placeholder={`Enter the legal name of the ${borrowerConstitution}`}
              />
            </Grid>

            {/* Dynamically render file uploads based on entity type */}
            {borrowerConstitution === "company" && (
              <>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Memorandum of Association"
                    onChange={(e) => handleFileChange(e, "associationMemorandum")}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Articles of Association"
                    onChange={(e) => handleFileChange(e, "articleofassociation")}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FileUpload label="Board Resolution" onChange={(e) => handleFileChange(e, "resolution")} required />
                </Grid>
              </>
            )}

            {/* Similar patterns for other entity types */}
          </Grid>
        )

      default:
        return (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">Please select a borrower constitution type to continue</Typography>
          </Box>
        )
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <SectionHeader title="Borrower Details" subtitle="Provide information about the borrower entity or individual" />

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="borrower-constitution-label">Borrower Constitution</InputLabel>
          <Select
            labelId="borrower-constitution-label"
            value={borrowerConstitution}
            onChange={(e) => setBorrowerConstitution(e.target.value)}
            required
            label="Borrower Constitution"
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

        {borrowerConstitution && <Box sx={{ mt: 2, mb: 4 }}>{renderFormFields()}</Box>}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained" color="primary" size="large" disabled={!borrowerConstitution}>
            Save & Continue
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default BorrowerDetails
