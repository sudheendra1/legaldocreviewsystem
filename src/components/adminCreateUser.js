// "use client"

// import { useState,useEffect  } from "react"
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
//   Paper,
//   Divider,
//   InputAdornment,
//   IconButton,
//   CircularProgress,
//   Stepper,
//   Step,
//   StepLabel,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Dialog, DialogTitle, DialogContent, DialogActions
// } from "@mui/material"
// import ArrowBackIcon from "@mui/icons-material/ArrowBack"
// import PersonAddIcon from "@mui/icons-material/PersonAdd"
// import VisibilityIcon from "@mui/icons-material/Visibility"
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
// import EmailIcon from "@mui/icons-material/Email"
// import LockIcon from "@mui/icons-material/Lock"
// import BadgeIcon from "@mui/icons-material/Badge"
// import api from "../services/api"

// function AdminCreateUser() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [name, setName] = useState("")
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [activeStep, setActiveStep] = useState(0)
//   const [role, setRole] = useState("review")
//   const [hasEditedPassword, setHasEditedPassword] = useState(false);
//   const [adminPasswordDialogOpen, setAdminPasswordDialogOpen] = useState(false);
//   const [adminPassword, setAdminPassword] = useState("");
  

//   const history = useHistory()

//   const steps = ["User Details", "Confirmation"]

//   // useEffect(() => {
//   //   if (email && !hasEditedPassword) {
//   //     const prefix = email.split("@")[0];
//   //     setPassword(`${prefix}123`);
//   //   }
//   // }, [email, hasEditedPassword]);
  

//   // const handleSubmit = async (e) => {
//   //   setAdminPasswordDialogOpen(false);
//   //   e.preventDefault()
//   //   setError("")
//   //   setLoading(true)

//   //   try {
//   //     const currentUser = auth.currentUser
//   //     const adminEmail = currentUser.email

//   //     // const adminPassword = prompt("Re-enter your admin password to Continue:")
//   //     // if (!adminPassword) {
//   //     //   setError("Admin password is required to create a new user.")
//   //     //   setLoading(false)
//   //     //   return
//   //     // }
      

//   //     let user = null

//   //     const userCredential = await createUserWithEmailAndPassword(auth, email, password)
//   //     user = userCredential.user

//   //     // Create user document in Firestore
//   //     await setDoc(doc(db, "users", user.uid), {
//   //       email: user.email,
//   //       createdAt: new Date().toISOString(),
//   //       name: name,
//   //       role: role,
//   //       allowed: false,
//   //       assignedCount: 0,
//   //       mustResetPassword: true
//   //     })

//   //     console.log("✅ User Created successfully. User:", user)

//   //     await auth.signOut()
//   //     await signInWithEmailAndPassword(auth, adminEmail, adminPassword)

//   //     setSuccess(`User ${name} (${email}) created successfully!`)
//   //     setActiveStep(1)
//   //   } catch (err) {
//   //     console.error("❌ Error during user Creation:", err)
//   //     setError(err.message || "User Creation failed.")
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError("")
//     setLoading(true)

//     try {
//       // Send only the email and role. Spring Boot generates the password and emails the user!
//       await api.post("/auth/create-user", {
//         email: email,
//         role: role,
//         name: name
//       });

//       setSuccess(`User (${email}) created successfully! An email has been sent to them.`);
//       setActiveStep(1)
//     } catch (err) {
//       console.error("❌ Error during user Creation:", err)
//       setError(err.response?.data || "User Creation failed.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleBack = () => {
//     history.goBack()
//   }

//   const handleReset = () => {
//     setEmail("")
//     setPassword("")
//     setName("")
//     setActiveStep(0)
//     setSuccess("")
//   }

//   const handleFinish = () => {
//     history.goBack()
//   }

//   return (
//     <Container component="main" maxWidth="md">
//       <Paper
//         elevation={0}
//         sx={{
//           mt: 8,
//           p: 4,
//           borderRadius: 2,
//           border: "1px solid",
//           borderColor: "divider",
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
//           <IconButton onClick={handleBack} sx={{ mr: 2 }}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography component="h1" variant="h4" fontWeight="bold">
//             Create New User
//           </Typography>
//         </Box>

//         <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         {activeStep === 0 ? (
//           <>
//             {error && (
//               <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
//                 {error}
//               </Alert>
//             )}

//             <Box component="form" onSubmit={(e)=>{setAdminPasswordDialogOpen(true); e.preventDefault();}} noValidate>
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 label="Full Name"
//                 autoComplete="name"
//                 autoFocus
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <BadgeIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 label="Email Address"
//                 autoComplete="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <EmailIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               {/* <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 label="Password"
//                 type={showPassword ? "text" : "password"}
//                 autoComplete="new-password"
//                 value={password}
//                 onChange={(e) => {
//                   setPassword(e.target.value);
//                   setHasEditedPassword(true);
//                 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <LockIcon />
//                     </InputAdornment>
//                   ),
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
//                         {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               /> */}

//               <FormControl fullWidth margin="normal">
//                 <InputLabel id="role-select-label">User Role</InputLabel>
//                 <Select
//                   labelId="role-select-label"
//                   value={role}
//                   label="User Role"
//                   onChange={(e) => setRole(e.target.value)}
//                 >
//                   <MenuItem value="review">Reviewer</MenuItem>
//                   <MenuItem value="user">Standard User</MenuItem>
//                   <MenuItem value="admin">Administrator</MenuItem>
//                 </Select>
//               </FormControl>

//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 4, mb: 2, py: 1.5 }}
//                 disabled={loading || !email || !name}
//                 startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
//               >
//                 {loading ? "Creating User..." : "Create User"}
//               </Button>
//             </Box>
//           </>
//         ) : (
//           <Box sx={{ textAlign: "center", py: 4 }}>
//             <Alert severity="success" sx={{ mb: 4 }}>
//               {success}
//             </Alert>

//             <Typography variant="body1" paragraph>
//               The user has been created successfully and can now log in with the provided credentials.
//             </Typography>

//             <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
//               <Button onClick={handleReset} variant="outlined">
//                 Create Another User
//               </Button>
//               <Button onClick={handleFinish} variant="contained">
//                 Return to Dashboard
//               </Button>
//             </Box>
//           </Box>
//         )}
//       </Paper>
//       <Dialog open={adminPasswordDialogOpen} onClose={() => setAdminPasswordDialogOpen(false)}>
//   <DialogTitle>Admin Password Required</DialogTitle>
//   <DialogContent>
//     <TextField
//       autoFocus
//       margin="dense"
//       label="Admin Password"
//       type="password"
//       fullWidth
//       variant="standard"
//       value={adminPassword}
//       onChange={(e) => setAdminPassword(e.target.value)}
//     />
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={() => setAdminPasswordDialogOpen(false)}>Cancel</Button>
//     <Button onClick={handleSubmit} disabled={!adminPassword}>
//       Confirm
//     </Button>
//   </DialogActions>
// </Dialog>

//     </Container>

    
//   )
// }

// export default AdminCreateUser


"use client"

import { useState } from "react"
import { useHistory } from "react-router-dom"
import api from "../services/api" // Ensure this path points to your Axios interceptor!
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  Paper,
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
import EmailIcon from "@mui/icons-material/Email"
import BadgeIcon from "@mui/icons-material/Badge"

function AdminCreateUser() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("REVIEWER") // Default to backend's expected uppercase format
  
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const history = useHistory()

  const steps = ["User Details", "Confirmation"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Send the request to your Spring Boot API
      // (Your API interceptor automatically attaches the Admin's JWT)
      await api.post("/auth/create-user", {
        name: name,
        email: email,
        role: role
      });

      setSuccess(`User ${name} (${email}) created successfully! An email with setup instructions has been sent to them.`);
      setActiveStep(1)
    } catch (err) {
      console.error("❌ Error during user Creation:", err)
      setError(err.response?.data || "User Creation failed.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    history.goBack()
  }

  const handleReset = () => {
    setEmail("")
    setName("")
    setRole("REVIEWER")
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

              <FormControl fullWidth margin="normal">
                <InputLabel id="role-select-label">User Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={role}
                  label="User Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  {/* Values mapped to match Spring Boot's uppercase expectations */}
                  <MenuItem value="REVIEWER">Reviewer</MenuItem>
                  <MenuItem value="USER">Standard User</MenuItem>
                  <MenuItem value="ADMIN">Administrator</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 4, mb: 2, py: 1.5 }}
                disabled={loading || !email || !name}
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
              The user account has been provisioned. They will receive an email shortly with a secure link to set their password.
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