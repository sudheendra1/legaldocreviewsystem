"use client"

import { useState } from "react"
import { Box, Typography, Paper, LinearProgress, Alert } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"

export default function FileUpload({ label, onChange, accept = "application/pdf", required = false, helperText }) {
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    setError(null)
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.type.match(accept)) {
        setError("Invalid file type. Please upload a PDF file.")
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit.")
        return
      }

      setFileName(file.name)
      onChange(e)
    }
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </Typography>

      {!fileName ? (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            border: "1px dashed rgba(0, 0, 0, 0.2)",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "rgba(37, 99, 235, 0.04)",
            },
          }}
          component="label"
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept={accept}
            required={required}
            style={{ display: "none" }}
          />
          <CloudUploadIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
          <Typography variant="body1" align="center">
            Drag and drop your file here or click to browse
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 0.5 }}>
            {accept === "application/pdf" ? "PDF files only" : accept}
          </Typography>
          {helperText && (
            <Typography variant="caption" color="textSecondary" align="center" sx={{ mt: 1 }}>
              {helperText}
            </Typography>
          )}
        </Paper>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            bgcolor: "rgba(37, 99, 235, 0.04)",
            border: "1px solid rgba(37, 99, 235, 0.2)",
          }}
        >
          <PictureAsPdfIcon sx={{ color: "#ef4444", mr: 1.5 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
              {fileName}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                mt: 0.5,
                height: 4,
                borderRadius: 2,
                bgcolor: "rgba(37, 99, 235, 0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "primary.main",
                },
              }}
            />
          </Box>
          <CheckCircleIcon sx={{ color: "success.main", ml: 1.5 }} />
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  )
}
