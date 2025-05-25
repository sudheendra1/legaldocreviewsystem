// "use client"

// import { useState, useEffect } from "react"
// import {
//   TextField,
//   Button,
//   Box,
//   Paper,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   IconButton,
//   Typography,
//   Card,
//   CardContent,
//   Chip,
// } from "@mui/material"
// import AddIcon from "@mui/icons-material/Add"
// import DeleteIcon from "@mui/icons-material/Delete"
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
// import SectionHeader from "./sectionHeader"
// import { useFormData } from "./FormDataManager"

// function LoanFacilities({ onNext }) {
//   const { formData, setFormData } = useFormData()
//   const [facilities, setFacilities] = useState(formData?.loanFacilities?.facilities || [])

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       loanFacilities: {
//         facilities,
//       },
//     }))
//   }, [facilities, setFormData])

//   const handleAddFacility = () => {
//     setFacilities([...facilities, { type: "", amount: "", currency: "INR" }])
//   }

//   const handleRemoveFacility = (index) => {
//     const newFacilities = facilities.filter((_, i) => i !== index)
//     setFacilities(newFacilities)
//   }

//   const handleFacilityChange = (index, field, value) => {
//     const newFacilities = [...facilities]
//     newFacilities[index][field] = value
//     setFacilities(newFacilities)
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     onNext()
//   }

//   // Function to format currency with commas
//   const formatCurrency = (value) => {
//     if (!value) return ""
//     return new Intl.NumberFormat("en-IN").format(value)
//   }

//   return (
//     <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
//       <SectionHeader title="Loan Facilities" subtitle="Add details about the loan facilities being provided" />

//       <form onSubmit={handleSubmit}>
//         {facilities.length === 0 ? (
//           <Box
//             sx={{
//               p: 4,
//               textAlign: "center",
//               border: "1px dashed rgba(0,0,0,0.12)",
//               borderRadius: 2,
//               mb: 3,
//             }}
//           >
//             <AccountBalanceIcon sx={{ fontSize: 48, color: "primary.light", mb: 2, opacity: 0.7 }} />
//             <Typography variant="h6" gutterBottom>
//               No Facilities Added
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//               Click the button below to add your first loan facility
//             </Typography>
//             <Button startIcon={<AddIcon />} onClick={handleAddFacility} variant="contained" color="primary">
//               Add Facility
//             </Button>
//           </Box>
//         ) : (
//           <>
//             {facilities.map((facility, index) => (
//               <Card
//                 key={index}
//                 variant="outlined"
//                 sx={{
//                   mb: 3,
//                   borderColor: facility.type ? "rgba(37, 99, 235, 0.2)" : "rgba(0,0,0,0.12)",
//                   transition: "all 0.2s",
//                   "&:hover": {
//                     boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
//                   },
//                 }}
//               >
//                 <CardContent>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <Typography variant="subtitle1" fontWeight={500}>
//                       Facility #{index + 1}
//                     </Typography>

//                     {facility.type && facility.amount && (
//                       <Chip
//                         label={`${facility.type}: ${facility.currency} ${formatCurrency(facility.amount)}`}
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                         sx={{ ml: 2 }}
//                       />
//                     )}

//                     <Box sx={{ flexGrow: 1 }} />

//                     <IconButton
//                       onClick={() => handleRemoveFacility(index)}
//                       color="error"
//                       size="small"
//                       sx={{
//                         bgcolor: "rgba(239, 68, 68, 0.1)",
//                         "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)" },
//                       }}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   </Box>

//                   <Grid container spacing={3}>
//                     <Grid item xs={12} md={5}>
//                       <TextField
//                         fullWidth
//                         label="Facility Type"
//                         placeholder="e.g., Term Loan, Cash Credit, Overdraft"
//                         value={facility.type}
//                         onChange={(e) => handleFacilityChange(index, "type", e.target.value)}
//                         required
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={4}>
//                       <TextField
//                         fullWidth
//                         label="Amount"
//                         type="number"
//                         placeholder="Enter amount"
//                         value={facility.amount}
//                         onChange={(e) => handleFacilityChange(index, "amount", e.target.value)}
//                         required
//                         InputProps={{
//                           inputProps: { min: 0 },
//                         }}
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={3}>
//                       <FormControl fullWidth>
//                         <InputLabel>Currency</InputLabel>
//                         <Select
//                           value={facility.currency}
//                           label="Currency"
//                           onChange={(e) => handleFacilityChange(index, "currency", e.target.value)}
//                         >
//                           <MenuItem value="INR">INR - Indian Rupee</MenuItem>
//                           <MenuItem value="USD">USD - US Dollar</MenuItem>
//                           <MenuItem value="EUR">EUR - Euro</MenuItem>
//                           <MenuItem value="GBP">GBP - British Pound</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>
//             ))}

//             <Box sx={{ mb: 3 }}>
//               <Button startIcon={<AddIcon />} onClick={handleAddFacility} variant="outlined">
//                 Add Another Facility
//               </Button>
//             </Box>
//           </>
//         )}

//         {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
//           <Button type="submit" variant="contained" color="primary" size="large" disabled={facilities.length === 0}>
//             Save & Continue
//           </Button>
//         </Box> */}
//       </form>
//     </Paper>
//   )
// }

// export default LoanFacilities

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
} from "@mui/material"
import SectionHeader from "./sectionHeader"
import FileUpload from "./fileUpload"
import { useFormData } from "./FormDataManager"

function Facilities({ onNext }) {
  const { formData, setFormData } = useFormData()
  const [facilityType, setFacilityType] = useState(formData?.loanFacilities?.facilityType || "")
  const [annexureType, setAnnexureType] = useState(formData?.loanFacilities?.annexureType || "")
  const [files, setFiles] = useState(formData?.loanFacilities?.files || {})

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      loanFacilities: {
        facilityType,
        annexureType,
        files,
      },
    }))
  }, [facilityType, annexureType, files, setFormData])

  const handleFacilityTypeChange = (event) => {
    setFacilityType(event.target.value)
    setFiles({})
    setAnnexureType("")
  }

  const handleAnnexureTypeChange = (event) => {
    setAnnexureType(event.target.value)
    setFiles({})
  }

  const handleFileChange = (fieldName, e) => {
    if (e.target.files[0]) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [fieldName]: e.target.files[0],
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext()
  }

  const renderFacilityFields = () => {
    switch (facilityType) {
      case "SPC":
        return (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Select Annexure Type
            </Typography>

            <RadioGroup
              aria-label="mortgage-type"
              name="annexure-type"
              value={annexureType}
              onChange={ handleAnnexureTypeChange}
              sx={{ mb: 3 }}
            >
              <FormControlLabel
                value="Annexure II"
                control={<Radio color="primary" />}
                label={<Typography variant="body1">Annexure II</Typography>}
              />
              <FormControlLabel
                value="Annexure III"
                control={<Radio color="primary" />}
                label={<Typography variant="body1">Annexure III</Typography>}
              />
            </RadioGroup>

            {annexureType === "Annexure II" && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="D.P.Note"
                    onChange={(e) => handleFileChange("D.P.Note", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Letter of Continuing security (With negative Lien clause)"
                    onChange={(e) => handleFileChange("Letter of Continuing security", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Lodgment of Firm Export Orders and/or Prime Bank's Irrevocable Letters of Credit."
                    onChange={(e) => handleFileChange("Lodgment of Firm Export Orders and/or Prime Bank's Irrevocable Letters of Credit.", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Export Trust Receipt"
                    onChange={(e) => handleFileChange("Export Trust Receipt", e)}
                    
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Instrument of Hypothecation of Goods"
                    onChange={(e) => handleFileChange("Instrument of Hypothecation of Goods", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Letter of Pleaded of goods for advanced"
                    onChange={(e) => handleFileChange("Letter of Pleaded of goods for advanced", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="ECGC Guarantee"
                    onChange={(e) => handleFileChange("ECGC Guarantee", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Letter of Undertaking for adjusting Packing Credit drawings by negotiation of documents within stipulated period"
                    onChange={(e) => handleFileChange("Letter of Undertaking for adjusting Packing Credit drawings by negotiation of documents within stipulated period", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Letter of Guarantee"
                    onChange={(e) => handleFileChange("Letter of Guarantee", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Sole Proprietorship Letter."
                    onChange={(e) => handleFileChange("Sole Proprietorship Letter.", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Letter of Partnership"
                    onChange={(e) => handleFileChange("Letter of Partnership", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Copy of Board Resolutions of the Borrowing Company authorising borrowing and execution of documents."
                    onChange={(e) => handleFileChange("Copy of Board Resolutions of the Borrowing Company authorising borrowing and execution of documents.", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="letter regarding clearing and storage of stocks with approved clearing agents"
                    onChange={(e) => handleFileChange("letter regarding clearing and storage of stocks with approved clearing agents", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Combined Undertaking"
                    onChange={(e) => handleFileChange("Combined Undertaking", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Other documents"
                    onChange={(e) => handleFileChange("other Documents", e)}
                    
                  />
                </Grid>
                
              </Grid>
            )}

            {annexureType === "Annexure III" && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Loan Agreement"
                    onChange={(e) => handleFileChange("Loan Agreement", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Lodgment of Firm Export Orders and/or Prime Bank's Irrevocable Letters of Credit."
                    onChange={(e) => handleFileChange("Lodgment of Firm Export Orders and/or Prime Bank's Irrevocable Letters of Credit.", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Export Trust Receipt"
                    onChange={(e) => handleFileChange("Export Trust Receipt", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="ECGC Guarantee"
                    onChange={(e) => handleFileChange("ECGC Guarantee", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Letter of Guarantee"
                    onChange={(e) => handleFileChange("Letter of Guarantee", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Sole Proprietorship Letter."
                    onChange={(e) => handleFileChange("Sole Proprietorship Letter", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Letter of Partnership"
                    onChange={(e) => handleFileChange("Letter of Partnership", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Copy of Board Resolutions of the Borrowing Company authorising borrowing and execution of documents."
                    onChange={(e) => handleFileChange("Copy of Board Resolutions of the Borrowing Company authorising borrowing and execution of documents.", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="letter of pledge of goods for advances"
                    onChange={(e) => handleFileChange("letter of pledge of goods for advances", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Letter regarding clearing and storage of stocks with approved clearing agents"
                    onChange={(e) => handleFileChange("Letter regarding clearing and storage of stocks with approved clearing agents", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Other Documents"
                    onChange={(e) => handleFileChange("other Documents", e)}
                    
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        )

      

      default:
        return (
          <Alert severity="info" sx={{ mt: 2 }}>
            Please select a facility type to continue
          </Alert>
        )
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <SectionHeader title="Facilities" subtitle="Provide details about the Facilities being provided" />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Facility Type</InputLabel>
              <Select value={facilityType} onChange={handleFacilityTypeChange} required label="Security Type">
                <MenuItem value="SPC">SECURED PACKING CREDITS</MenuItem>
                
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {facilityType && (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Divider sx={{ mb: 3 }} />
            {renderFacilityFields()}
          </Box>
        )}

        {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={!securityType || (securityType === "Mortgage" && !mortgageType)}
          >
            Save & Continue
          </Button>
        </Box> */}
      </form>
    </Paper>
  )
}

export default Facilities
