"use client"
import { useState, useEffect } from "react"
import { Link, Redirect } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Typography, Button, Container, Box, CircularProgress } from "@mui/material"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/config" // adjust path if needed

function Dashboard() {
  const { currentUser, loading } = useAuth()
  const [role, setRole] = useState(null)
  const [roleLoading, setRoleLoading] = useState(true)

  

  useEffect(() => {
    const fetchRole = async () => {
      if (!currentUser) {
        setRole(null)
        setRoleLoading(false)
        return
      }
  
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const userData = docSnap.data()
            setRole(userData.role || null)
          }
        } catch (error) {
          console.error("Error fetching role:", error)
        } finally {
          setRoleLoading(false)
        }
      }
  
    }
    if (!loading) {
      fetchRole()
    }
  }, [currentUser])

  if (loading || roleLoading) {
    return (
      <Container component="main" maxWidth="md">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (!loading && !currentUser) {
    return <Redirect to="/login" />
  }

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
          Welcome, {currentUser.email.split("@")[0]}!
        </Typography>
        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          {role === "upload" && (
            <>
            <Button component={Link} to="/upload" variant="contained" color="primary">
              Upload Documents
            </Button>

            <Button component={Link} to="/seeUploads" variant="contained" color="primary">
      See Uploads
    </Button>
            
            </>
            
          )}
          {role === "review" && (
            <Button component={Link} to="/review" variant="contained" color="secondary">
              Review Documents
            </Button>
          )}

{role === "admin" && (
  <>
            <Button component={Link} to="/adminDocs" variant="contained" color="secondary">
              View All Documents
            </Button>

            <Button component={Link} to="/reviewers" variant="contained" color="secondary">
              View All Employees
            </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default Dashboard
