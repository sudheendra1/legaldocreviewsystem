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

function Securities({ onNext }) {
  const { formData, setFormData } = useFormData()
  const [securityType, setSecurityType] = useState(formData?.securities?.securityType || "")
  const [mortgageType, setMortgageType] = useState(formData?.securities?.mortgageType || "")
  const [files, setFiles] = useState(formData?.securities?.files || {})

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      securities: {
        files,
        mortgageType,
        securityType,
      },
    }))
  }, [files,mortgageType,securityType, setFormData])

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
    onNext()
  }

  const renderSecurityFields = () => {
    switch (securityType) {
      case "Mortgage":
        return (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Select Mortgage Type
            </Typography>

            <RadioGroup
              aria-label="mortgage-type"
              name="mortgage-type"
              value={mortgageType}
              onChange={handleMortgageTypeChange}
              sx={{ mb: 3 }}
            >
              <FormControlLabel
                value="registered"
                control={<Radio color="primary" />}
                label={<Typography variant="body1">Registered Mortgage</Typography>}
              />
              <FormControlLabel
                value="equitable"
                control={<Radio color="primary" />}
                label={<Typography variant="body1">Equitable Mortgage</Typography>}
              />
            </RadioGroup>

            {mortgageType === "registered" && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Title Clearance Report"
                    onChange={(e) => handleFileChange("titleClearanceReport", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Registered Mortgage"
                    onChange={(e) => handleFileChange("registeredMortgage", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Encumbrance Certificate"
                    onChange={(e) => handleFileChange("encumbranceCertificate", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Other Documents"
                    onChange={(e) => handleFileChange("otherDocuments", e)}
                    
                  />
                </Grid>
              </Grid>
            )}

            {mortgageType === "equitable" && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Title Clearance Report"
                    onChange={(e) => handleFileChange("titleClearanceReport", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Letter of Confirmation of Mortgage"
                    onChange={(e) => handleFileChange("mortgageConfirmation", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Memorandum of Deposit"
                    onChange={(e) => handleFileChange("memorandumOfDeposit", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Document 1 mentioned in memorandum"
                    onChange={(e) => handleFileChange("document 1", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Document 2 mentioned in memorandum"
                    onChange={(e) => handleFileChange("document 2", e)}
                    
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Other Documents"
                    onChange={(e) => handleFileChange("otherDocuments", e)}
                    
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        )

      case "Hypothecation":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FileUpload
                label="Hypothecation Deed"
                onChange={(e) => handleFileChange("hypothecationDeed", e)}
                
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FileUpload
                label="Registration Copy for vehicles"
                onChange={(e) => handleFileChange("registrationCopy", e)}
                
              />
            </Grid>
          </Grid>
        )

      case "Assignment":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FileUpload label="Assignment Deed" onChange={(e) => handleFileChange("assignmentDeed", e)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FileUpload
                label="Insurance Documents"
                onChange={(e) => handleFileChange("insurance Docs", e)}
                
                helperText="Upload documents related to confirmation from insurance company"
              />
            </Grid>
          </Grid>
        )

      case "Negative Lien Letter":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FileUpload
                label="Negative Lien Letter"
                onChange={(e) => handleFileChange("negativeLienLetter", e)}
                
              />
            </Grid>
          </Grid>
        )

      case "Pledge":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <FileUpload label="Pledge Deed" onChange={(e) => handleFileChange("pledgeDeed", e)} required />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <FileUpload
                label="Registration Copy (if registered)"
                onChange={(e) => handleFileChange("registrationCopy", e)}
                
              />
            </Grid> */}
          </Grid>
        )

      default:
        return (
          <Alert severity="info" sx={{ mt: 2 }}>
            Please select a security type to continue
          </Alert>
        )
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <SectionHeader title="Securities" subtitle="Provide details about the securities offered against the loan" />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Security Type</InputLabel>
              <Select value={securityType} onChange={handleSecurityTypeChange} required label="Security Type">
                <MenuItem value="Mortgage">Mortgage</MenuItem>
                <MenuItem value="Hypothecation">Hypothecation</MenuItem>
                <MenuItem value="Assignment">Assignment</MenuItem>
                <MenuItem value="Negative Lien Letter">Negative Lien Letter</MenuItem>
                <MenuItem value="Pledge">Pledge</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {securityType && (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Divider sx={{ mb: 3 }} />
            {renderSecurityFields()}
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

export default Securities
