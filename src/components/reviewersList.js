import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase/config"
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Paper,
  Divider,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material"
import { Link, Redirect } from "react-router-dom"
import SearchIcon from "@mui/icons-material/Search"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import EmailIcon from "@mui/icons-material/Email"
import AssignmentIcon from "@mui/icons-material/Assignment"
import RefreshIcon from "@mui/icons-material/Refresh"

function ReviewersList() {
  const [reviewers, setReviewers] = useState([])
  const [filteredReviewers, setFilteredReviewers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchReviewers()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredReviewers(reviewers)
    } else {
      const filtered = reviewers.filter(
        (reviewer) =>
          (reviewer.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (reviewer.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredReviewers(filtered)
    }
  }, [searchTerm, reviewers])

  const fetchReviewers = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, "users"), where("role", "==", "review"))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setReviewers(data)
      setFilteredReviewers(data)
    } catch (err) {
      console.error("Error fetching reviewers:", err)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRandomColor = (id) => {
    const colors = [
      "#1976d2", // blue
      "#388e3c", // green
      "#d32f2f", // red
      "#f57c00", // orange
      "#7b1fa2", // purple
      "#0288d1", // light blue
      "#c2185b", // pink
      "#455a64", // blue grey
    ]
    const index = id ? id.charCodeAt(0) % colors.length : 0
    return colors[index]
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "70vh" }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading reviewers...
        </Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Reviewers Management
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip title="Refresh list">
              <IconButton onClick={fetchReviewers} aria-label="refresh">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              component={Link}
              to="/createUser"
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
            >
              Create Reviewer
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search reviewers by name or email..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {filteredReviewers.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No reviewers found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchTerm ? "Try adjusting your search" : "Create a reviewer to get started"}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredReviewers.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: getRandomColor(user.id),
                          width: 56,
                          height: 56,
                          mr: 2,
                        }}
                      >
                        {getInitials(user.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{user.name || "Unnamed User"}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                          <EmailIcon fontSize="small" sx={{ color: "text.secondary", mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <AssignmentIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
                      <Typography variant="body2">
                        <strong>Assigned Documents:</strong>{" "}
                        <Chip
                          label={user.assignedCount || 0}
                          size="small"
                          color={user.assignedCount > 0 ? "primary" : "default"}
                        />
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  )
}

export default ReviewersList
