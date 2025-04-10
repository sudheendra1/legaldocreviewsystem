"use client"

import { useState, useEffect } from "react"
import { Redirect } from "react-router-dom"
import { db } from "../firebase/config"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import { getFileFromMongoDB } from "../services/mongoService"
import { useAuth } from "../contexts/AuthContext"
// import { Button, Card, CardContent, Typography, TextField, CircularProgress, Container, Box } from "@mui/material"
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
  Container,
  Box,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material"
// import { redirect } from "next/navigation"

// function ReviewDocuments() {
//   // const [documents, setDocuments] = useState([])
//   const [submissions, setSubmissions] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const { currentUser } = useAuth()

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       setLoading(true)
//       setError(null)
//       try {
//         const q = query(collection(db, "documents"), where("status", "==", "pending"))
//         const querySnapshot = await getDocs(q)
//         const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//         setDocuments(docs)
//       } catch (err) {
//         console.error("Error fetching documents: ", err)
//         setError("Failed to fetch documents. Please try again.")
//       }
//       setLoading(false)
//     }

//     fetchDocuments()
//   }, [])
function ReviewDocuments() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser, loading: authLoading } = useAuth()
  // const [redirecting, setRedirecting] = useState(false)
  useEffect(() => {
    if (authLoading) {
      return // Do nothing until auth is loaded
    }

    if (!currentUser) {
      // setRedirecting(true)
      // return // Redirect after authLoading is false
      return // Will redirect in render
    }

    const fetchSubmissions = async () => {
      setLoading(true)
      setError(null)
      try {
        const q = query(collection(db, "submissions"), where("status", "==", "pending"))
        const querySnapshot = await getDocs(q)
        const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setSubmissions(docs)
      } catch (err) {
        console.error("Error fetching submissions: ", err)
        setError("Failed to fetch submissions. Please try again.")
      }
      setLoading(false)
    }

    fetchSubmissions()
  }, [currentUser, authLoading])
  const handleReview = async (id, status, comments) => {
    try {
      // await updateDoc(doc(db, "documents", id), {
        await updateDoc(doc(db, "submissions", id), {
        status,
        reviewedBy: currentUser.uid,
        reviewedAt: new Date(),
        comments,
      })

      // setDocuments(documents.filter((doc) => doc.id !== id))
      setSubmissions(submissions.filter((submission) => submission.id !== id))

    } catch (err) {
      console.error("Error updating document: ", err)
      setError("Failed to update document status. Please try again.")
    }
  }

  if (authLoading) {
    return (
      <Container component="main" maxWidth="md">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  // if (redirecting) {
  //   redirect("/login")
    if (!currentUser) {
      return <Redirect to="/login" />
  }

//   if (loading) {
//     return <CircularProgress />
//   }

//   if (error) {
//     return <Typography color="error">{error}</Typography>
//   }

//   return (
//     <Container component="main" maxWidth="md">
//       <Box
//         sx={{
//           marginTop: 8,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Typography component="h1" variant="h4" gutterBottom>
//           Review Documents
//         </Typography>
//         {documents.map((doc) => (
//           <Card key={doc.id} sx={{ width: "100%", mb: 2 }}>
//             <CardContent>
//               <Typography variant="h6">{doc.fileName}</Typography>
//               <Typography>Borrower: {doc.borrowerName}</Typography>
//               <Typography>Constitution: {doc.borrowerConstitution}</Typography>
//               <Typography>Loan Facility: {doc.loanFacility}</Typography>
//               <Typography>Document Type: {doc.documentType}</Typography>
//               <Button href={doc.fileUrl} target="_blank" rel="noopener noreferrer" sx={{ mt: 1, mb: 1 }}>
//                 View Document
//               </Button>
//               <TextField
//                 fullWidth
//                 margin="normal"
//                 label="Comments"
//                 multiline
//                 rows={4}
//                 variant="outlined"
//                 onChange={(e) => (doc.comments = e.target.value)}
//               />
//               <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
//                 <Button
//                   onClick={() => handleReview(doc.id, "approved", doc.comments)}
//                   color="primary"
//                   variant="contained"
//                 >
//                   Approve
//                 </Button>
//                 <Button
//                   onClick={() => handleReview(doc.id, "rejected", doc.comments)}
//                   color="secondary"
//                   variant="contained"
//                 >
//                   Reject
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         ))}
//       </Box>
//     </Container>
//   )
// }
if (loading) {
  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    </Container>
  )
}

if (error) {
  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    </Container>
  )
}

return (
  <Container component="main" maxWidth="md">
    <Box sx={{ mt: 8 }}>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Review Documents
      </Typography>

      {submissions.length === 0 ? (
        <Alert severity="info">No pending submissions to review.</Alert>
      ) : (
        submissions.map((submission) => (
          <Card key={submission.id} sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6">Submission ID: {submission.id}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Submitted: {submission.submittedAt?.toDate().toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Borrower Details
              </Typography>
              {submission.documents.borrowerDetails && (
                <Typography variant="body2">
                  Constitution: {submission.documents.borrowerDetails.borrowerConstitution}
                </Typography>
              )}

              <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                Documents
              </Typography>
              <List dense>
                {submission.mongoDBFiles &&
                  submission.mongoDBFiles.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={file.originalName}
                        secondary={`Category: ${file.category} | Type: ${file.documentType}`}
                      />
                      {/* <Link href={getFileFromMongoDB(file.filename)} target="_blank" rel="noopener noreferrer">
                        <Button variant="outlined" size="small">
                          View
                        </Button>
                      </Link> */}
                    </ListItem>
                  ))}
              </List>

              <TextField
                fullWidth
                margin="normal"
                label="Comments"
                multiline
                rows={4}
                variant="outlined"
                onChange={(e) => (submission.comments = e.target.value)}
              />

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  onClick={() => handleReview(submission.id, "approved", submission.comments)}
                  color="primary"
                  variant="contained"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleReview(submission.id, "rejected", submission.comments)}
                  color="secondary"
                  variant="contained"
                >
                  Reject
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  </Container>
)
}

export default ReviewDocuments

