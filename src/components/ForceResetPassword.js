import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";

function ForceResetPassword() {
  const { currentUser } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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
      await updatePassword(auth.currentUser, newPassword);

      // Update Firestore to clear mustResetPassword flag
      await updateDoc(doc(db, "users", currentUser.uid), {
        mustResetPassword: false,
      });

      setSuccess("Password updated successfully!");
      setTimeout(() => {
        history.push("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Reset Your Password
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        This is your first login. Please set a new password to continue.
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
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : "Reset Password"}
        </Button>
      </Box>
    </Container>
  );
}

export default ForceResetPassword;
