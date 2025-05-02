// "use client"

// import { useState, useEffect  } from "react"
// import {
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Paper,
//   Grid,
// } from "@mui/material"

// import { useFormData } from "./FormDataManager";

// function SanctionLetter({ onNext }) {
//   const { formData, setFormData } = useFormData();
//   const [description, setDescription] = useState(formData?.sanctionLetter?.description || "");
//   const [files, setFiles] = useState(formData?.sanctionLetter?.files || {});


//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       sanctionLetter: {
//         description,
//         files,
//       },
//     }));
//   }, [description, files, setFormData]);
  

//   // const handleFacilityChange = (index, field, value) => {
//   //   const newFacilities = [...facilities]
//   //   newFacilities[index][field] = value
//   //   setFacilities(newFacilities)
//   // }

//   const handleFileChange = (e, fieldName) => {
//     if (e.target.files[0]) {
//       setFiles((prevState) => ({
//         ...prevState,
//         [fieldName]: e.target.files[0],
//       }))
//     }
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     // onSave( {...formData,files,facilities})
//     onNext();
//   }

//   return (
//     <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         Sanction Letter
//       </Typography>
//       {/* <form onSubmit={handleSubmit}>
        
//           <Box key={index} sx={{ mb: 2 }}>
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} sm={4}>
//               <TextField
//             fullWidth
//             label="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//               <input type="file" onChange={(e) => handleFileChange(e, "SanctionLetter")} accept="application/pdf" />
//               <Typography variant="body1">Upload Sanction Letter (PDF only)</Typography>
//               </Grid>
              
//             </Grid>
//           </Box>
//         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, ml: 2 }}>
//           Save Sanction Letter
//         </Button>
//       </form> */}

// <form onSubmit={handleSubmit}>
//         <Box sx={{ mb: 2 }}>
//           <TextField
//             fullWidth
//             label="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />
//         </Box>

//         <Box sx={{ mb: 2 }}>
//           <Typography variant="body1" sx={{ mb: 1 }}>
//             Upload Sanction Letter (PDF only)
//           </Typography>
//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={handleFileChange}
//             required
//           />
//         </Box>

//         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
//           Save Sanction Letter
//         </Button>
//       </form>
//     </Paper>
//   )
// }

// export default SanctionLetter



"use client"

import { useState, useEffect } from "react"
import { TextField, Button, Box, Paper, Grid } from "@mui/material"
import FileUpload from "./fileUpload"
import SectionHeader from "./sectionHeader"
import { useFormData } from "./FormDataManager"

function SanctionLetter({ onNext }) {
  const { formData, setFormData } = useFormData()
  const [description, setDescription] = useState(formData?.sanctionLetter?.description || "")
  const [files, setFiles] = useState(formData?.sanctionLetter?.files || {})

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      sanctionLetter: {
        description,
        files,
      },
    }))
  }, [description, files, setFormData])

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFiles((prevState) => ({
        ...prevState,
        sanctionLetter: e.target.files[0],
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext()
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <SectionHeader
        title="Sanction Letter"
        subtitle="Upload the sanction letter issued by the financial institution"
      />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              placeholder="Enter a brief description of the sanction letter"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              variant="outlined"
              multiline
              rows={3}
              helperText="Provide details about the sanction letter, including date of issuance and key terms"
            />
          </Grid>

          <Grid item xs={12}>
            <FileUpload
              label="Sanction Letter"
              onChange={handleFileChange}
              required
              helperText="Upload the official sanction letter document issued by the bank or financial institution"
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button type="submit" variant="contained" color="primary" size="large">
            Save & Continue
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default SanctionLetter
