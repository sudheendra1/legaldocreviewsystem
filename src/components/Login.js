// "use client"

// import { useState, useEffect } from "react"
// import { signInWithEmailAndPassword } from "firebase/auth"
// import { auth, getUserInfo } from "../firebase/config"
// import { useHistory } from "react-router-dom"
// import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material"

// function Login() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const history = useHistory()

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         history.push("/")
//       }
//     })

//     return () => unsubscribe()
//   }, [history])

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError("")

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password)
//       const userInfo = await getUserInfo(userCredential.user.uid)

//       if (userInfo) {
//         console.log("User info:", userInfo)
//         history.push("/")
//       } else {
//         setError("User information not found. Please contact support.")
//       }
//     } catch (error) {
//       setError("Failed to log in. Please check your credentials.")
//     }
//   }

//   return (
//     <Container component="main" maxWidth="xs">
//       <Box
//         sx={{
//           marginTop: 8,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Typography component="h1" variant="h5">
//           Log In
//         </Typography>
//         {error && <Alert severity="error">{error}</Alert>}
//         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="Email Address"
//             name="email"
//             autoComplete="email"
//             autoFocus
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="password"
//             label="Password"
//             type="password"
//             id="password"
//             autoComplete="current-password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
//             Log In
//           </Button>
//         </Box>
//       </Box>
//     </Container>
//   )
// }

// export default Login

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
} from "@mui/material"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSignup, setIsSignup] = useState(false)
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      let user = null

      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        user = userCredential.user

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date().toISOString(),
        })

        console.log("✅ Signup successful. User:", user)
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        user = userCredential.user

        const userDoc = await getDoc(doc(db, "users", user.uid))

        if (!userDoc.exists()) {
          setError("User info not found. Please contact support.")
          return
        }

        console.log("✅ Login successful. User:", user.uid)
      }

      history.push("/dashboard")
    } catch (err) {
      console.error("❌ Error during authentication:", err)
      setError(err.message || "Authentication failed.")
    }
  }

  const toggleMode = () => {
    setIsSignup((prev) => !prev)
    setError("")
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
          {isSignup ? "Sign Up" : "Log In"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus={!isSignup}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {isSignup ? "Sign Up" : "Log In"}
          </Button>

          <Box textAlign="center">
            <Link component="button" onClick={toggleMode} variant="body2">
              {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Login
