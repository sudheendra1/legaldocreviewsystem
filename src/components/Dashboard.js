import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Typography, Button, Container, Box } from "@mui/material"

function Dashboard() {
  const { currentUser } = useAuth()

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome, {currentUser.email}
        </Typography>
        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <Button component={Link} to="/upload" variant="contained" color="primary">
            Upload Documents
          </Button>
          <Button component={Link} to="/review" variant="contained" color="secondary">
            Review Documents
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default Dashboard

