// "use client"

// import { useState, useEffect  } from "react"
// import { TextField, Button, Typography, Box, Paper, Grid, IconButton } from "@mui/material"
// import AddIcon from "@mui/icons-material/Add"
// import DeleteIcon from "@mui/icons-material/Delete"
// import { useFormData } from "./FormDataManager";

// function OtherDocuments({ onNext }) {
//   const { formData, setFormData } = useFormData();
//   const [documents, setDocuments] = useState(formData?.otherDocuments?.documents || [{ description: "", file: null }]);

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       otherDocuments: {
//         documents,
//       },
//     }));
//   }, [documents, setFormData]);

//   const handleAddDocument = () => {
//     setDocuments([...documents, { description: "", file: null }])
//   }

//   const handleRemoveDocument = (index) => {
//     const newDocuments = documents.filter((_, i) => i !== index)
//     setDocuments(newDocuments)
//   }

//   const handleDocumentChange = (index, field, value) => {
//     const newDocuments = [...documents]
//     newDocuments[index][field] = value
//     setDocuments(newDocuments)
//   }

//   const handleFileChange = (index, e) => {
//     const file = e.target.files[0]
//     handleDocumentChange(index, "file", file)
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     // onSave(documents)
//     onNext();
//   }

//   return (
//     <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         Other Documents
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         {documents.map((document, index) => (
//           <Box key={index} sx={{ mb: 2 }}>
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} sm={5}>
//                 <TextField
//                   fullWidth
//                   label="Document Description"
//                   value={document.description}
//                   onChange={(e) => handleDocumentChange(index, "description", e.target.value)}
                  
//                 />
//               </Grid>
//               <Grid item xs={12} sm={5}>
//                 <input type="file" onChange={(e) => handleFileChange(index, e)}  />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <IconButton onClick={() => handleRemoveDocument(index)} color="error">
//                   <DeleteIcon />
//                 </IconButton>
//               </Grid>
//             </Grid>
//           </Box>
//         ))}
//         <Button startIcon={<AddIcon />} onClick={handleAddDocument} sx={{ mt: 2 }}>
//           Add Document
//         </Button>
//         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, ml: 2 }}>
//           Save Documents
//         </Button>
//       </form>
//     </Paper>
//   )
// }

// export default OtherDocuments


"use client"

import { useState, useEffect } from "react"
import { TextField, Button, Box, Paper, Grid, IconButton, Typography, Card, CardContent, Divider } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import DescriptionIcon from "@mui/icons-material/Description"
import SectionHeader from "./sectionHeader"
import FileUpload from "./fileUpload"
import { useFormData } from "./FormDataManager"

function OtherDocuments({ onNext }) {
  const { formData, setFormData } = useFormData()
  const [documents, setDocuments] = useState(formData?.otherDocuments?.documents || [{ description: "", file: null }])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      otherDocuments: {
        documents,
      },
    }))
  }, [documents, setFormData])

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
        title="Other Documents"
        subtitle="Upload any additional documents relevant to the loan application"
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

export default OtherDocuments
