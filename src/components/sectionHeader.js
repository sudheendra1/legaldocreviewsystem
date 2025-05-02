"use client"

import { Box, Typography, Divider } from "@mui/material"

export default function SectionHeader({ title, subtitle }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" gutterBottom color="primary.dark">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {subtitle}
        </Typography>
      )}
      <Divider sx={{ mt: 1 }} />
    </Box>
  )
}
