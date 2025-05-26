"use client"

import { useState, useEffect } from "react"
import {
  Button,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Divider,
  Alert,
  Card, 
  CardContent,
  IconButton,
  TextField
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import DescriptionIcon from "@mui/icons-material/Description"
import SectionHeader from "./sectionHeader"
import FileUpload from "./fileUpload"
import { useFormData } from "./FormDataManager"

function Facilities({ onNext }) {
  const { formData, setFormData } = useFormData()
  // const [facilityType, setFacilityType] = useState(formData?.loanFacilities?.facilityType || "")
  // const [annexureType, setAnnexureType] = useState(formData?.loanFacilities?.annexureType || "")
  const [files, setFiles] = useState(formData?.loanFacilities?.files || {})
   const [documents, setDocuments] = useState(formData?.loanFacilities?.documents || [{ description: "", file: null },{ description: "", file: null },{ description: "", file: null },{ description: "", file: null }])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      loanFacilities: {
        // facilityType,
        // annexureType,
        documents,
      },
    }))
  }, [documents, setFormData])

  // const handleFacilityTypeChange = (event) => {
  //   setFacilityType(event.target.value)
  //   setFiles({})
  //   setAnnexureType("")
  // }

  // const handleAnnexureTypeChange = (event) => {
  //   setAnnexureType(event.target.value)
  //   setFiles({})
  // }


  const handleAddDocument = () => {
    setDocuments([...documents, { description: "", file: null }])
  }

  const handleRemoveDocument = (index) => {
    const newDocuments = documents.filter((_, i) => i !== index)
    setDocuments(newDocuments)
  }

  const handleDocumentChange = (index, field, value) => {
    const newDocuments = [...documents]
    newDocuments[index][field] = value
    setDocuments(newDocuments)
  }

  // const handleFileChange = (fieldName, e) => {
  //   if (e.target.files[0]) {
  //     setFiles((prevFiles) => ({
  //       ...prevFiles,
  //       [fieldName]: e.target.files[0],
  //     }))
  //   }
  // }

  const handleFileChange = (index, e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0]
      handleDocumentChange(index, "file", file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext()
  }

  // const renderFacilityFields = () => {
  //   switch (facilityType) {
  //     case "SPC":
  //       return (
  //         <Box>
  //           <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
  //             Select Annexure Type
  //           </Typography>

  //           <RadioGroup
  //             aria-label="mortgage-type"
  //             name="annexure-type"
  //             value={annexureType}
  //             onChange={ handleAnnexureTypeChange}
  //             sx={{ mb: 3 }}
  //           >
  //             <FormControlLabel
  //               value="Annexure II"
  //               control={<Radio color="primary" />}
  //               label={<Typography variant="body1">Annexure II</Typography>}
  //             />
  //             <FormControlLabel
  //               value="Annexure III"
  //               control={<Radio color="primary" />}
  //               label={<Typography variant="body1">Annexure III</Typography>}
  //             />
  //           </RadioGroup>

  //           {annexureType === "Annexure II" && (
  //             <Grid container spacing={3}>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="D.P.Note"
  //                   onChange={(e) => handleFileChange("D.P.Note", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Letter of Continuing security (With negative Lien clause)"
  //                   onChange={(e) => handleFileChange("Letter of Continuing security", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Lodgment of Firm Export Orders and/or Prime Bank's Irrevocable Letters of Credit."
  //                   onChange={(e) => handleFileChange("Lodgment of Firm Export Orders and/or Prime Bank's Irrevocable Letters of Credit.", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Export Trust Receipt"
  //                   onChange={(e) => handleFileChange("Export Trust Receipt", e)}
                    
  //                 />
  //               </Grid>

  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Instrument of Hypothecation of Goods"
  //                   onChange={(e) => handleFileChange("Instrument of Hypothecation of Goods", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Letter of Pleaded of goods for advanced"
  //                   onChange={(e) => handleFileChange("Letter of Pleaded of goods for advanced", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="ECGC Guarantee"
  //                   onChange={(e) => handleFileChange("ECGC Guarantee", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Letter of Undertaking for adjusting Packing Credit drawings by negotiation of documents within stipulated period"
  //                   onChange={(e) => handleFileChange("Letter of Undertaking for adjusting Packing Credit drawings by negotiation of documents within stipulated period", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Letter of Guarantee"
  //                   onChange={(e) => handleFileChange("Letter of Guarantee", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Sole Proprietorship Letter."
  //                   onChange={(e) => handleFileChange("Sole Proprietorship Letter.", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Letter of Partnership"
  //                   onChange={(e) => handleFileChange("Letter of Partnership", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Copy of Board Resolutions of the Borrowing Company authorising borrowing and execution of documents."
  //                   onChange={(e) => handleFileChange("Copy of Board Resolutions of the Borrowing Company authorising borrowing and execution of documents.", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="letter regarding clearing and storage of stocks with approved clearing agents"
  //                   onChange={(e) => handleFileChange("letter regarding clearing and storage of stocks with approved clearing agents", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Combined Undertaking"
  //                   onChange={(e) => handleFileChange("Combined Undertaking", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Other documents"
  //                   onChange={(e) => handleFileChange("other Documents", e)}
                    
  //                 />
  //               </Grid>
                
  //             </Grid>
  //           )}

  //           {annexureType === "Annexure III" && (
  //             <Grid container spacing={3}>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Loan Agreement"
  //                   onChange={(e) => handleFileChange("Loan Agreement", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Lodgment of Firm Export Orders and/or Prime Bank's Irrevocable Letters of Credit."
  //                   onChange={(e) => handleFileChange("Lodgment of Firm Export Orders and/or Prime Bank's Irrevocable Letters of Credit.", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Export Trust Receipt"
  //                   onChange={(e) => handleFileChange("Export Trust Receipt", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="ECGC Guarantee"
  //                   onChange={(e) => handleFileChange("ECGC Guarantee", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Letter of Guarantee"
  //                   onChange={(e) => handleFileChange("Letter of Guarantee", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Sole Proprietorship Letter."
  //                   onChange={(e) => handleFileChange("Sole Proprietorship Letter", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Letter of Partnership"
  //                   onChange={(e) => handleFileChange("Letter of Partnership", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Copy of Board Resolutions of the Borrowing Company authorising borrowing and execution of documents."
  //                   onChange={(e) => handleFileChange("Copy of Board Resolutions of the Borrowing Company authorising borrowing and execution of documents.", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="letter of pledge of goods for advances"
  //                   onChange={(e) => handleFileChange("letter of pledge of goods for advances", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Letter regarding clearing and storage of stocks with approved clearing agents"
  //                   onChange={(e) => handleFileChange("Letter regarding clearing and storage of stocks with approved clearing agents", e)}
                    
  //                 />
  //               </Grid>
  //               <Grid item xs={12} md={6}>
  //                 <FileUpload
  //                   label="Other Documents"
  //                   onChange={(e) => handleFileChange("other Documents", e)}
                    
  //                 />
  //               </Grid>
  //             </Grid>
  //           )}
  //         </Box>
  //       )

      

  //     default:
  //       return (
  //         <Alert severity="info" sx={{ mt: 2 }}>
  //           Please select a facility type to continue
  //         </Alert>
  //       )
  //   }
  // }

  // return (
  //   <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
  //     <SectionHeader title="Facilities" subtitle="Provide details about the Facilities being provided" />

  //     <form onSubmit={handleSubmit}>
  //       <Grid container spacing={3}>
  //         <Grid item xs={12}>
  //           <FormControl fullWidth>
  //             <InputLabel>Facility Type</InputLabel>
  //             <Select value={facilityType} onChange={handleFacilityTypeChange} required label="Security Type">
  //               <MenuItem value="SPC">SECURED PACKING CREDITS</MenuItem>
                
  //             </Select>
  //           </FormControl>
  //         </Grid>
  //       </Grid>

  //       {facilityType && (
  //         <Box sx={{ mt: 3, mb: 3 }}>
  //           <Divider sx={{ mb: 3 }} />
  //           {renderFacilityFields()}
  //         </Box>
  //       )}

  //       {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
  //         <Button
  //           type="submit"
  //           variant="contained"
  //           color="primary"
  //           size="large"
  //           disabled={!securityType || (securityType === "Mortgage" && !mortgageType)}
  //         >
  //           Save & Continue
  //         </Button>
  //       </Box> */}
  //     </form>
  //   </Paper>
  // )

    return (
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <SectionHeader
          title="Documents for Loan Facilities"
          subtitle="Upload any documents relevant to the facilities of the  loan application"
        />
  
        <form onSubmit={handleSubmit}>
          {documents.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                border: "1px dashed rgba(0,0,0,0.12)",
                borderRadius: 2,
                mb: 3,
              }}
            >
              <DescriptionIcon sx={{ fontSize: 48, color: "primary.light", mb: 2, opacity: 0.7 }} />
              <Typography variant="h6" gutterBottom>
                No Additional Documents
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Click the button below to add supporting documents
              </Typography>
              <Button startIcon={<AddIcon />} onClick={handleAddDocument} variant="contained" color="primary">
                Add Document
              </Button>
            </Box>
          ) : (
            <>
              {documents.map((document, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    mb: 3,
                    borderColor: document.description ? "rgba(37, 99, 235, 0.2)" : "rgba(0,0,0,0.12)",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <DescriptionIcon sx={{ color: "primary.main", mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={500}>
                        Document #{index + 1}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <IconButton
                        onClick={() => handleRemoveDocument(index)}
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
  
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Document Description"
                          placeholder="Enter a brief description of this document"
                          value={document.description}
                          onChange={(e) => handleDocumentChange(index, "description", e.target.value)}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FileUpload
                          label="Upload Document"
                          onChange={(e) => handleFileChange(index, e)}
                          helperText="Upload the document in PDF format"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
  
              <Box sx={{ mb: 3 }}>
                <Button startIcon={<AddIcon />} onClick={handleAddDocument} variant="outlined">
                  Add Another Document
                </Button>
              </Box>
            </>
          )}
  
          <Divider sx={{ my: 3 }} />
  
          {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained" color="primary" size="large">
              Save & Continue
            </Button>
          </Box> */}
        </form>
      </Paper>
    )
}

export default Facilities
