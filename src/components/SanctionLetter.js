"use client"

import { useState } from "react"
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
} from "@mui/material"

function SanctionLetter({ onSave }) {
  const [facilities, setFacilities] = useState([{ type: "", amount: "", currency: "INR" }])
  const [formData, setFormData] = useState({})
  const [files, setFiles] = useState({})

  

  const handleFacilityChange = (index, field, value) => {
    const newFacilities = [...facilities]
    newFacilities[index][field] = value
    setFacilities(newFacilities)
  }

  const handleFileChange = (e, fieldName) => {
    if (e.target.files[0]) {
      setFiles((prevState) => ({
        ...prevState,
        [fieldName]: e.target.files[0],
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave( {...formData,files,facilities})
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Sanction Letter
      </Typography>
      <form onSubmit={handleSubmit}>
        {facilities.map((facility, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Description"
                  value={facility.type}
                  onChange={(e) => handleFacilityChange(index, "type", e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
              <input type="file" onChange={(e) => handleFileChange(e, "partnershipDeed")} accept="application/pdf" />
              <Typography variant="body1">Upload Sanction Letter (PDF only)</Typography>
              </Grid>
              
            </Grid>
          </Box>
        ))}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, ml: 2 }}>
          Save Sanction Letter
        </Button>
      </form>
    </Paper>
  )
}

export default SanctionLetter

