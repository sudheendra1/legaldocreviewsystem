"use client"

import { useState } from "react"
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"

function Guarantors({ onSave }) {
  const [borrowerConstitution, setBorrowerConstitution] = useState("")
  const [formData, setFormData] = useState({})
  const [files, setFiles] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
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
    const newBorrowerNumber = Object.keys(formData).filter((key) => key.startsWith("borrowerName")).length + 1
    setFormData((prevState) => ({
      ...prevState,
      [`borrowerName${newBorrowerNumber}`]: "",
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...formData, files, borrowerConstitution })
  }

  const renderFormFields = () => {
    switch (borrowerConstitution) {
      case "individual":
        return (
          <>
            {Object.keys(formData)
              .filter((key) => key.startsWith("borrowerName"))
              .map((key, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10}>
                      <TextField
                        fullWidth
                        label={`Name of Guarantor no. ${index + 1}`}
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton
                        onClick={() => {
                          const newFormData = { ...formData }
                          delete newFormData[key]
                          setFormData(newFormData)
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            <Button startIcon={<AddIcon />} onClick={handleAddBorrower} sx={{ mt: 2 }}>
              Add Guarantor
            </Button>
          </>
        )
      case "partnership":
        return (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Name of Firm"
              name="firmName"
              value={formData.firmName || ""}
              onChange={handleInputChange}
              required
            />
            <input type="file" onChange={(e) => handleFileChange(e, "partnershipDeed")} accept="application/pdf" />
            <Typography variant="body1">Upload Partnership Deed (PDF only)</Typography>
            <input type="file" onChange={(e) => handleFileChange(e, "resolutionofpartners")} accept="application/pdf" />
            <Typography variant="body1">Upload Resolution of all Partners (PDF only)</Typography>
            <input type="file" onChange={(e) => handleFileChange(e, "guaranteeDeed")} accept="application/pdf" />
            <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
          </>
        )
      case "llp":
            return (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Name of LLP"
                  name="llpName"
                  value={formData.firmName || ""}
                  onChange={handleInputChange}
                  required
                />
                <input type="file" onChange={(e) => handleFileChange(e, "registrationDeed")} accept="application/pdf" />
                <Typography variant="body1">Upload Registration Deed (PDF only)</Typography>
                <input type="file" onChange={(e) => handleFileChange(e, "resolutionofpartners")} accept="application/pdf" />
                <Typography variant="body1">Upload Resolution of all Partners (PDF only)</Typography>
                <input type="file" onChange={(e) => handleFileChange(e, "guaranteeDeed")} accept="application/pdf" />
                <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
              </>
            )
      case "huf":
                return (
                     <>
                      <TextField
                         fullWidth
                           margin="normal"
                           label="Name of HUF"
                           name="hufName"
                           value={formData.firmName || ""}
                            onChange={handleInputChange}
                           required
                           />
                           <input type="file" onChange={(e) => handleFileChange(e, "declarationofkarta")} accept="application/pdf" />
                           <Typography variant="body1">Upload Declaration of Karta in Notarized copy (PDF only)</Typography>
                            <input type="file" onChange={(e) => handleFileChange(e, "resolutionofHuf")} accept="application/pdf" />
                           <Typography variant="body1">Upload Resolution of Members (PDF only)</Typography>
                           <input type="file" onChange={(e) => handleFileChange(e, "guaranteDeed")} accept="application/pdf" />
                           <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
                            </>
          )
       case "society":
                return (
                  <>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Name of Society"
                      name="societyName"
                      value={formData.firmName || ""}
                      onChange={handleInputChange}
                      required
                    />
                    <input type="file" onChange={(e) => handleFileChange(e, "societyMemorandum")} accept="application/pdf" />
                    <Typography variant="body1">Upload Memorandum of Society (PDF only)</Typography>
                    <input type="file" onChange={(e) => handleFileChange(e, "resolutionofSociety")} accept="application/pdf" />
                    <Typography variant="body1">Upload Resolution (PDF only)</Typography>
                    <input type="file" onChange={(e) => handleFileChange(e, "guaranteeDeed")} accept="application/pdf" />
                    <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
                    <input type="file" onChange={(e) => handleFileChange(e, "byLaws")} accept="application/pdf" />
                    <Typography variant="body1">Upload byLaws (PDF only)</Typography>
                  </>
                )
       case "trust":
                return (
                      <>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Name of Trust"
                          name="trustName"
                          value={formData.firmName || ""}
                          onChange={handleInputChange}
                          required
                        />
                        <input type="file" onChange={(e) => handleFileChange(e, "trustDeed")} accept="application/pdf" />
                        <Typography variant="body1">Upload Trust Deed (PDF only)</Typography>
                        <input type="file" onChange={(e) => handleFileChange(e, "resolutionofSociety")} accept="application/pdf" />
                        <Typography variant="body1">Upload Resolution (PDF only)</Typography>
                        <input type="file" onChange={(e) => handleFileChange(e, "guaranteeDeed")} accept="application/pdf" />
                        <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
                        <input type="file" onChange={(e) => handleFileChange(e, "permissionoftrus")} accept="application/pdf" />
                        <Typography variant="body1">Upload Permission of Commissioner of Trust (PDF only)</Typography>
                      </>
                    )
        case "company":
                        return (
                          <>
                            <TextField
                              fullWidth
                              margin="normal"
                              label="Name of Company"
                              name="companyName"
                              value={formData.firmName || ""}
                              onChange={handleInputChange}
                              required
                            />
                            <input type="file" onChange={(e) => handleFileChange(e, "associationMemorandum")} accept="application/pdf" />
                            <Typography variant="body1">Upload Memorandum of Association (PDF only)</Typography>
                            <input type="file" onChange={(e) => handleFileChange(e, "articleofassociation")} accept="application/pdf" />
                            <Typography variant="body1">Upload Article of Association(PDF only)</Typography>
                            <input type="file" onChange={(e) => handleFileChange(e, "resolution")} accept="application/pdf" />
                            <Typography variant="body1">Upload Resolution (PDF only)</Typography>
                            <input type="file" onChange={(e) => handleFileChange(e, "guaranteeDeed")} accept="application/pdf" />
                            <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
                           
                          </>
                        )
        case "other":
                return (
                              <>
                                <TextField
                                  fullWidth
                                  margin="normal"
                                  label="Name of Constitution"
                                  name="constitutionName"
                                  value={formData.firmName || ""}
                                  onChange={handleInputChange}
                                  required
                                />
                                <input type="file" onChange={(e) => handleFileChange(e, "establishment")} accept="application/pdf" />
                                <Typography variant="body1">Upload Document of Establishment (PDF only)</Typography>
                                <input type="file" onChange={(e) => handleFileChange(e, "resolution")} accept="application/pdf" />
                                <Typography variant="body1">Upload Resolution (PDF only)</Typography>
                                <input type="file" onChange={(e) => handleFileChange(e, "guaranteeDeed")} accept="application/pdf" />
                                <Typography variant="body1">Upload Guarantee Deed (PDF only)</Typography>
                                <input type="file" onChange={(e) => handleFileChange(e, "otherdocs")} accept="application/pdf" />
                                <Typography variant="body1">Upload Other Documents(PDF only)</Typography>
                               
                              </>
                            )
            
      // Add cases for 'llp', 'society', 'trust', 'huf', 'company', and 'other' here
      // The structure will be similar to the above cases
      default:
        return null
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Guarantor Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Guarantor Type</InputLabel>
          <Select value={borrowerConstitution} onChange={(e) => setBorrowerConstitution(e.target.value)} required>
            <MenuItem value="individual">Individual</MenuItem>
            <MenuItem value="partnership">Partnership</MenuItem>
            <MenuItem value="llp">LLP</MenuItem>
            <MenuItem value="society">Society</MenuItem>
            <MenuItem value="trust">Trust</MenuItem>
            <MenuItem value="huf">HUF</MenuItem>
            <MenuItem value="company">Company</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>

        {borrowerConstitution && <Box sx={{ mt: 2 }}>{renderFormFields()}</Box>}

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Save and Continue
        </Button>
      </form>
    </Paper>
  )
}

export default Guarantors

