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
import SectionHeader from "../sectionHeader"
import FileUpload from "../fileUpload"
import { useFormData } from "./FormDataManager"

function Facilities({ onNext }) {
  const { formData, setFormData } = useFormData()
  const [facilityType, setFacilityType] = useState(formData?.loanFacilities?.facilityType || "")
  const [documents, setDocuments] = useState(formData?.loanFacilities?.documents || [{ description: "", file: null },{ description: "", file: null },{ description: "", file: null },{ description: "", file: null }])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      loanFacilities: {
        facilityType,
        documents,
      },
    }))
  }, [facilityType, documents, setFormData])

  const handleFacilityTypeChange = (event) => {
    setFacilityType(event.target.value)
  }

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

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <SectionHeader
        title="Documents for Loan Facilities"
        subtitle="Select facility type and upload relevant documents"
      />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Facility Type</InputLabel>
              <Select 
                value={facilityType} 
                onChange={handleFacilityTypeChange} 
                required 
                label="Facility Type"
              >
                <MenuItem value="Term Loan">Term Loan</MenuItem>
                <MenuItem value="Cash Credit">Cash Credit</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {facilityType && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 3 }} />
            
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
                  Click the button below to add supporting documents for {facilityType}
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
                          Document #{index + 1} - {facilityType}
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
          </Box>
        )}

        {!facilityType && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Please select a facility type to continue with document upload
          </Alert>
        )}

        <Divider sx={{ my: 3 }} />

        
      </form>
    </Paper>
  )
}

export default Facilities