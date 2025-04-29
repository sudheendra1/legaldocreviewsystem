"use client";

import { useState } from "react";
import { Button, CircularProgress, Box, Typography, Alert } from "@mui/material";
import { useFormData } from "./FormDataManager";
import { uploadFileToCloudinary } from "../utils/cloudinaryUpload";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


function ConfirmUpload() {
  const { formData, setFormData } = useFormData();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const history = useHistory();
  const { currentUser } = useAuth();



  const handleConfirmUpload = async () => {

    if (!currentUser) {
      setError("You must be logged in to upload documents.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const tempData = { ...formData };

      // Upload all files inside formData
      for (const section in tempData) {
        for (const key in tempData[section]) {
          if (typeof tempData[section][key] === "object") {
            if (tempData[section][key] instanceof File) {
              const fileUrl = await uploadFileToCloudinary(tempData[section][key]);
              tempData[section][key] = fileUrl;
            } else if (Array.isArray(tempData[section][key])) {
              // If it's an array (like multiple documents)
              tempData[section][key] = await Promise.all(
                tempData[section][key].map(async (item) => {
                  if (item?.file instanceof File) {
                    const fileUrl = await uploadFileToCloudinary(item.file);
                    return { ...item, file: fileUrl };
                  }
                  return item;
                })
              );
            } else if (typeof tempData[section][key] === "object") {
              // If it's a nested object with multiple files
              const nestedObj = { ...tempData[section][key] };
              for (const nestedKey in nestedObj) {
                if (nestedObj[nestedKey] instanceof File) {
                  const fileUrl = await uploadFileToCloudinary(nestedObj[nestedKey]);
                  nestedObj[nestedKey] = fileUrl;
                }
              }
              tempData[section][key] = nestedObj;
            }
          }
        }
      }

      // Push final data to Firestore
      const docRef = await addDoc(collection(db, "submissions"), {
        ...tempData,
        submittedBy: currentUser.displayName || (currentUser.email ? currentUser.email.split("@")[0] : "Unknown User"), 
        submittedByUid: currentUser.uid, 
        submittedAt: new Date(),          
        status: "pending" 
      });

      setSuccessMessage(`Upload Successful! Your Submission ID: ${docRef.id}`);
      setFormData({}); // Clear form after success

      setTimeout(() => {
        history.push("/dashboard"); // 🚀 Redirect after 2 seconds
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong during upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const generateUniqueId = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  return (
    <Box sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Upload
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Button variant="contained" color="primary" onClick={handleConfirmUpload} disabled={uploading}>
        {uploading ? <CircularProgress size={24} /> : "Upload All Documents"}
      </Button>
    </Box>
  );
}

export default ConfirmUpload;
