// import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { updatePassword } from "firebase/auth";
// import { doc, updateDoc } from "firebase/firestore";
// import { auth, db } from "../firebase/config";
// import { useAuth } from "../contexts/AuthContext";
// import api from "../services/api"
// import { useLocation } from "react-router-dom"

// function ForceResetPassword() {
//   const { currentUser } = useAuth();
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const history = useHistory();
  
//   // Extract the token from the URL (e.g. ?token=abc)
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const token = searchParams.get("token");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!newPassword || !confirmPassword) {
//       setError("Both fields are required.");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     if (newPassword.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }
//     if (!token) {
//         setError("Invalid reset link. Token is missing.");
//         return;
//     }

//     setLoading(true);
//     try {
//       // await updatePassword(auth.currentUser, newPassword);

//       // // Update Firestore to clear mustResetPassword flag
//       // await updateDoc(doc(db, "users", currentUser.uid), {
//       //   mustResetPassword: false,
//       // });

//       await api.post("/auth/reset-password", {
//           token: token,
//           newPassword: newPassword
//       });

//       setSuccess("Password updated successfully!");
//       setTimeout(() => {
//         history.push("/login");
//       }, 2000);
//     } catch (err) {
//       console.error("Password reset error:", err);
//       setError(err.message || "Failed to update password.Link may be expired.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 8 }}>
//       <Typography variant="h5" gutterBottom>
//         Reset Your Password
//       </Typography>
//       <Typography variant="body2" sx={{ mb: 3 }}>
//         This is your first login. Please set a new password to continue.
//       </Typography>

//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//       {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

//       <Box component="form" onSubmit={handleSubmit}>
//         <TextField
//           label="New Password"
//           type="password"
//           fullWidth
//           margin="normal"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//         />
//         <TextField
//           label="Confirm New Password"
//           type="password"
//           fullWidth
//           margin="normal"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//         />

//         <Button
//           type="submit"
//           variant="contained"
//           fullWidth
//           disabled={loading}
//           sx={{ mt: 3 }}
//         >
//           {loading ? <CircularProgress size={24} /> : "Reset Password"}
//         </Button>
//       </Box>
//     </Container>
//   );
// }

// export default ForceResetPassword;

import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
// Bring in your Axios instance
import api from "../services/api"; 

function ForceResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  
  // 1. Extract the token from the URL (e.g., http://localhost:3000/reset-password?token=xyz123)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid reset link. The security token is missing.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // 2. Send the token and new password to Spring Boot
      await api.post("/auth/reset-password", {
        token: token,
        newPassword: newPassword
      });

      setSuccess("Password updated successfully! Redirecting to login...");
      
      // 3. Send them to the login page so they can log in and get their JWT
      setTimeout(() => {
        history.push("/login"); 
      }, 1500);

    } catch (err) {
      console.error("Password reset error:", err);
      // Catch backend error messages (e.g., "Token has expired")
      setError(err.response?.data || "Failed to update password. The link may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Secure Your Account
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        Please set a secure password to activate your account and log in.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !token}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : "Set Password"}
        </Button>
      </Box>
    </Container>
  );
}

export default ForceResetPassword;