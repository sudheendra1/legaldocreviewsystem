"use client"

import { useState , useEffect } from "react"
import {
  Button,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material"
import { useFormData } from "./FormDataManager";

function RegistrationOfSecurity({ onNext }) {
  const { formData, setFormData } = useFormData();
  const [securityType, setSecurityType] = useState(formData?.registrationOfSecurity?.securityType || "");
  const [files, setFiles] = useState(formData?.registrationOfSecurity?.files || {}); 
  const [mortgageType, setMortgageType] = useState("")


  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      registrationOfSecurity: {
        securityType,
        files,
      },
    }));
  }, [securityType, files, setFormData]);

  const handleSecurityTypeChange = (event) => {
    setSecurityType(event.target.value)
    setFiles({})
    setMortgageType("")
  }

  const handleMortgageTypeChange = (event) => {
    setMortgageType(event.target.value)
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
    // onSave({ securityType, mortgageType, files })
    onNext();
  }

  const renderSecurityFields = () => {
    switch (securityType) {
      case "Company":
        return (
          <> 
                <input
                  type="file"
                  onChange={(e) => handleFileChange("CopyofCERSAI", e)}
                  accept="application/pdf"
                />
                <Typography variant="body1">Upload Copy of CERSAI (PDF only)</Typography>
                <input
                  type="file"
                  onChange={(e) => handleFileChange("CopyofRoc", e)}
                  accept="application/pdf"
                />
                <Typography variant="body1">Upload Copy of Roc (PDF only)</Typography>
           
          </>
        )
      case "Other_Than_Company":
        return (
          <>
            <input type="file" onChange={(e) => handleFileChange("CopyofCERSAI", e)} accept="application/pdf" />
            <Typography variant="body1">Upload Copy of CERSAI (PDF only)</Typography>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Registration Of Security
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Security Type</InputLabel>
              <Select value={securityType} onChange={handleSecurityTypeChange} required>
                <MenuItem value="Company">Company</MenuItem>
                <MenuItem value="Other_Than_Company">Other Than Company</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>{renderSecurityFields()}</Box>
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Registration
        </Button>
      </form>
    </Paper>
  )
}

export default RegistrationOfSecurity

