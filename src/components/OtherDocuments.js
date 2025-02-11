"use client"

import { useState } from "react"
import { TextField, Button, Typography, Box, Paper, Grid, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"

function OtherDocuments({ onSave }) {
  const [documents, setDocuments] = useState([{ description: "", file: null }])

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
    const file = e.target.files[0]
    handleDocumentChange(index, "file", file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(documents)
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Other Documents
      </Typography>
      <form onSubmit={handleSubmit}>
        {documents.map((document, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Document Description"
                  value={document.description}
                  onChange={(e) => handleDocumentChange(index, "description", e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <input type="file" onChange={(e) => handleFileChange(index, e)} required />
              </Grid>
              <Grid item xs={12} sm={2}>
                <IconButton onClick={() => handleRemoveDocument(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddDocument} sx={{ mt: 2 }}>
          Add Document
        </Button>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, ml: 2 }}>
          Save Documents
        </Button>
      </form>
    </Paper>
  )
}

export default OtherDocuments

