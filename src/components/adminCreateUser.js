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

// function AdminCreateUser() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const [name, setName] = useState("")
//   const history = useHistory()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError("")

//     try {
//         const currentUser = auth.currentUser;
//         const adminEmail = currentUser.email;


//       const adminPassword = prompt("Re-enter your admin password to Continue:");
//       let user = null

      
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password)
//         user = userCredential.user

//         // Create user document in Firestore
//         await setDoc(doc(db, "users", user.uid), {
//           email: user.email,
//           createdAt: new Date().toISOString(),
//           name: name,
//           role:"review",
//           allowed: false,
//         })

//         console.log("✅ User Created successfully. User:", user)

//         await auth.signOut();


//         await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      

//         history.goBack();
//     } catch (err) {
//       console.error("❌ Error during user Creation:", err)
//       setError(err.message || "user Creation failed.")
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
//            Create User
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mt: 2 }}>
//             {error}
//           </Alert>
//         )}

//         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//         <TextField
//             margin="normal"
//             required
//             fullWidth
//             label="Name"
//             autoComplete="name"
//             autoFocus
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             label="Email Address"
//             autoComplete="email"
//             autoFocus
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
//            Create User
//           </Button>
//         </Box>
//       </Box>
//     </Container>
//   )
// }

// export default AdminCreateUser


"use client"

import { useState,useEffect  } from "react"
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
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
import BadgeIcon from "@mui/icons-material/Badge"

function AdminCreateUser() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [role, setRole] = useState("review")
  const history = useHistory()

  const steps = ["User Details", "Confirmation"]

  useEffect(() => {
    if (email && password === "") {
      const prefix = email.split("@")[0];
      setPassword(`${prefix}123`);
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const currentUser = auth.currentUser
      const adminEmail = currentUser.email

      const adminPassword = prompt("Re-enter your admin password to Continue:")
      if (!adminPassword) {
        setError("Admin password is required to create a new user.")
        setLoading(false)
        return
      }

      let user = null

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user = userCredential.user

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        name: name,
        role: role,
        allowed: false,
        assignedCount: 0,
      })

      console.log("✅ User Created successfully. User:", user)

      await auth.signOut()
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword)

      setSuccess(`User ${name} (${email}) created successfully!`)
      setActiveStep(1)
    } catch (err) {
      console.error("❌ Error during user Creation:", err)
      setError(err.message || "User Creation failed.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    history.goBack()
  }

  const handleReset = () => {
    setEmail("")
    setPassword("")
    setName("")
    setActiveStep(0)
    setSuccess("")
  }

  const handleFinish = () => {
    history.goBack()
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h1" variant="h4" fontWeight="bold">
            Create New User
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 ? (
          <>
            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
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
                autoComplete="new-password"
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
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel id="role-select-label">User Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={role}
                  label="User Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="review">Reviewer</MenuItem>
                  <MenuItem value="user">Standard User</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 4, mb: 2, py: 1.5 }}
                disabled={loading || !email || !password || !name}
                startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
              >
                {loading ? "Creating User..." : "Create User"}
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Alert severity="success" sx={{ mb: 4 }}>
              {success}
            </Alert>

            <Typography variant="body1" paragraph>
              The user has been created successfully and can now log in with the provided credentials.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
              <Button onClick={handleReset} variant="outlined">
                Create Another User
              </Button>
              <Button onClick={handleFinish} variant="contained">
                Return to Dashboard
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  )
}

export default AdminCreateUser
