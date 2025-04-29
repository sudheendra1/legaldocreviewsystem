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
} from "@mui/material"

function ReviewersList() {
  const [reviewers, setReviewers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "review"))
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setReviewers(data)
      } catch (err) {
        console.error("Error fetching reviewers:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviewers()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reviewers
      </Typography>
      <Grid container spacing={3}>
        {reviewers.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{user.name || "Unnamed User"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Assigned: {user.assignedCount || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default ReviewersList
