"use client"

import { useState } from "react"
import { auth, db } from "../firebase/config"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { useHistory } from "react-router-dom"
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  Link,
  Paper,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  Fade,
} from "@mui/material"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import LoginIcon from "@mui/icons-material/Login"
import PersonAddIcon from "@mui/icons-material/PersonAdd"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      let user = null
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        user = userCredential.user

        const userDoc = await getDoc(doc(db, "users", user.uid))

        if (!userDoc.exists()) {
          setError("User info not found. Please contact support.")
          setLoading(false)
          return
        }

        console.log("✅ Login successful. User:", user.uid)
      

      history.push("/dashboard")
    } catch (err) {
      console.error("❌ Error during authentication:", err)

  
      if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.")
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up.")
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in instead.")
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.")
      } else {
        setError(err.message || "Authentication failed.")
      }
    } finally {
      setLoading(false)
    }
  }


  return (
    <Container component="main" maxWidth="sm">
      <Fade in={true} timeout={800}>
        <Paper
          elevation={0}
          sx={{
            mt: 8,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
            Legal Document Review System
          </Typography>

          {/* <Tabs
            value={isSignup ? 1 : 0}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ width: "100%", mb: 3 }}
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs> */}

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete={"current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading || !email || !password}
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
            >
              {loading ? "Processing..." : "Sign In"}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Container>
  )
}

export default Login
