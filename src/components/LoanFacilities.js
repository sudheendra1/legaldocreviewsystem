// "use client"

// import { useState , useEffect } from "react"
// import {
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Paper,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   IconButton,
// } from "@mui/material"
// import AddIcon from "@mui/icons-material/Add"
// import DeleteIcon from "@mui/icons-material/Delete"
// import { useFormData } from "./FormDataManager";

// function LoanFacilities({ onNext }) {
//   const { formData, setFormData } = useFormData();
//   const [facilities, setFacilities] = useState(formData?.loanFacilities?.facilities || []);
  

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       loanFacilities: {
//         facilities,
//       },
//     }));
//   }, [facilities, setFormData]);

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
//     // onSave(facilities)
//     onNext(); 
//   }

//   return (
//     <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         Facilities
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         {facilities.map((facility, index) => (
//           <Box key={index} sx={{ mb: 2 }}>
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   label="Facility Type"
//                   value={facility.type}
//                   onChange={(e) => handleFacilityChange(index, "type", e.target.value)}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   fullWidth
//                   label="Amount"
//                   type="number"
//                   value={facility.amount}
//                   onChange={(e) => handleFacilityChange(index, "amount", e.target.value)}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <FormControl fullWidth>
//                   <InputLabel>Currency</InputLabel>
//                   <Select
//                     value={facility.currency}
//                     onChange={(e) => handleFacilityChange(index, "currency", e.target.value)}
//                   >
//                     <MenuItem value="INR">INR</MenuItem>
//                     <MenuItem value="USD">USD</MenuItem>
//                     <MenuItem value="EUR">EUR</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <IconButton onClick={() => handleRemoveFacility(index)} color="error">
//                   <DeleteIcon />
//                 </IconButton>
//               </Grid>
//             </Grid>
//           </Box>
//         ))}
//         <Button startIcon={<AddIcon />} onClick={handleAddFacility} sx={{ mt: 2 }}>
//           Add Facility
//         </Button>
//         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, ml: 2 }}>
//           Save Facilities
//         </Button>
//       </form>
//     </Paper>
//   )
// }

// export default LoanFacilities


"use client"

import { useState, useEffect } from "react"
import {
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import SectionHeader from "./sectionHeader"
import { useFormData } from "./FormDataManager"

function LoanFacilities({ onNext }) {
  const { formData, setFormData } = useFormData()
  const [facilities, setFacilities] = useState(formData?.loanFacilities?.facilities || [])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      loanFacilities: {
        facilities,
      },
    }))
  }, [facilities, setFormData])

  const handleAddFacility = () => {
    setFacilities([...facilities, { type: "", amount: "", currency: "INR" }])
  }

  const handleRemoveFacility = (index) => {
    const newFacilities = facilities.filter((_, i) => i !== index)
    setFacilities(newFacilities)
  }

  const handleFacilityChange = (index, field, value) => {
    const newFacilities = [...facilities]
    newFacilities[index][field] = value
    setFacilities(newFacilities)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext()
  }

  // Function to format currency with commas
  const formatCurrency = (value) => {
    if (!value) return ""
    return new Intl.NumberFormat("en-IN").format(value)
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <SectionHeader title="Loan Facilities" subtitle="Add details about the loan facilities being provided" />

      <form onSubmit={handleSubmit}>
        {facilities.length === 0 ? (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              border: "1px dashed rgba(0,0,0,0.12)",
              borderRadius: 2,
              mb: 3,
            }}
          >
            <AccountBalanceIcon sx={{ fontSize: 48, color: "primary.light", mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" gutterBottom>
              No Facilities Added
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Click the button below to add your first loan facility
            </Typography>
            <Button startIcon={<AddIcon />} onClick={handleAddFacility} variant="contained" color="primary">
              Add Facility
            </Button>
          </Box>
        ) : (
          <>
            {facilities.map((facility, index) => (
              <Card
                key={index}
                variant="outlined"
                sx={{
                  mb: 3,
                  borderColor: facility.type ? "rgba(37, 99, 235, 0.2)" : "rgba(0,0,0,0.12)",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      Facility #{index + 1}
                    </Typography>

                    {facility.type && facility.amount && (
                      <Chip
                        label={`${facility.type}: ${facility.currency} ${formatCurrency(facility.amount)}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ ml: 2 }}
                      />
                    )}

                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton
                      onClick={() => handleRemoveFacility(index)}
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
                    <Grid item xs={12} md={5}>
                      <TextField
                        fullWidth
                        label="Facility Type"
                        placeholder="e.g., Term Loan, Cash Credit, Overdraft"
                        value={facility.type}
                        onChange={(e) => handleFacilityChange(index, "type", e.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Amount"
                        type="number"
                        placeholder="Enter amount"
                        value={facility.amount}
                        onChange={(e) => handleFacilityChange(index, "amount", e.target.value)}
                        required
                        InputProps={{
                          inputProps: { min: 0 },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Currency</InputLabel>
                        <Select
                          value={facility.currency}
                          label="Currency"
                          onChange={(e) => handleFacilityChange(index, "currency", e.target.value)}
                        >
                          <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                          <MenuItem value="USD">USD - US Dollar</MenuItem>
                          <MenuItem value="EUR">EUR - Euro</MenuItem>
                          <MenuItem value="GBP">GBP - British Pound</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Box sx={{ mb: 3 }}>
              <Button startIcon={<AddIcon />} onClick={handleAddFacility} variant="outlined">
                Add Another Facility
              </Button>
            </Box>
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button type="submit" variant="contained" color="primary" size="large" disabled={facilities.length === 0}>
            Save & Continue
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default LoanFacilities
