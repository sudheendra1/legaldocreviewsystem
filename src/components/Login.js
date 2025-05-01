// "use client"

// import { useState } from "react"
// import { auth, db } from "../firebase/config"
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
// import { doc, setDoc, getDoc } from "firebase/firestore"
// import { useHistory } from "react-router-dom"
// import {
//   TextField,
//   Button,
//   Typography,
//   Container,
//   Box,
//   Alert,
//   Link,
// } from "@mui/material"

// function Login() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const [isSignup, setIsSignup] = useState(false)
//   const history = useHistory()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError("")

//     try {
//       let user = null

//       if (isSignup) {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password)
//         user = userCredential.user

//         // Create user document in Firestore
//         await setDoc(doc(db, "users", user.uid), {
//           email: user.email,
//           createdAt: new Date().toISOString(),
//         })

//         console.log("✅ Signup successful. User:", user)
//       } else {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password)
//         user = userCredential.user

//         const userDoc = await getDoc(doc(db, "users", user.uid))

//         if (!userDoc.exists()) {
//           setError("User info not found. Please contact support.")
//           return
//         }

//         console.log("✅ Login successful. User:", user.uid)
//       }

//       history.push("/dashboard")
//     } catch (err) {
//       console.error("❌ Error during authentication:", err)
//       setError(err.message || "Authentication failed.")
//     }
//   }

//   const toggleMode = () => {
//     setIsSignup((prev) => !prev)
//     setError("")
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
//           {isSignup ? "Sign Up" : "Log In"}
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mt: 2 }}>
//             {error}
//           </Alert>
//         )}

//         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             label="Email Address"
//             autoComplete="email"
//             autoFocus={!isSignup}
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             label="Password"
//             type="password"
//             autoComplete="current-password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
//             {isSignup ? "Sign Up" : "Log In"}
//           </Button>

//           <Box textAlign="center">
//             <Link component="button" onClick={toggleMode} variant="body2">
//               {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
//             </Link>
//           </Box>
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
