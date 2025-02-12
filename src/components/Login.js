"use client"

import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, getUserInfo } from "../firebase/config"
import { useHistory } from "react-router-dom"
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userInfo = await getUserInfo(userCredential.user.uid)

      if (userInfo) {
        console.log("User info:", userInfo)
        // You can store user info in your app's state here if needed
        history.push("/dashboard")
      } else {
        setError("User information not found. Please contact support.")
      }
    } catch (error) {
      setError("Failed to log in. Please check your credentials.")
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Log In
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default Login

