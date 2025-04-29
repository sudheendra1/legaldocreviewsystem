"use client"

import { useState , useEffect } from "react"
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import { useFormData } from "./FormDataManager";

function LoanFacilities({ onNext }) {
  const { formData, setFormData } = useFormData();
  const [facilities, setFacilities] = useState(formData?.loanFacilities?.facilities || []);
  

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      loanFacilities: {
        facilities,
      },
    }));
  }, [facilities, setFormData]);

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
    // onSave(facilities)
    onNext(); 
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Facilities
      </Typography>
      <form onSubmit={handleSubmit}>
        {facilities.map((facility, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Facility Type"
                  value={facility.type}
                  onChange={(e) => handleFacilityChange(index, "type", e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={facility.amount}
                  onChange={(e) => handleFacilityChange(index, "amount", e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={facility.currency}
                    onChange={(e) => handleFacilityChange(index, "currency", e.target.value)}
                  >
                    <MenuItem value="INR">INR</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <IconButton onClick={() => handleRemoveFacility(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddFacility} sx={{ mt: 2 }}>
          Add Facility
        </Button>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, ml: 2 }}>
          Save Facilities
        </Button>
      </form>
    </Paper>
  )
}

export default LoanFacilities

