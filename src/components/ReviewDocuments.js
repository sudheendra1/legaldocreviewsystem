import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import { useAuth } from "../contexts/AuthContext"
import { Button, Card, CardContent, Typography, TextField, CircularProgress, Container, Box } from "@mui/material"

function ReviewDocuments() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true)
      setError(null)
      try {
        const q = query(collection(db, "documents"), where("status", "==", "pending"))
        const querySnapshot = await getDocs(q)
        const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setDocuments(docs)
      } catch (err) {
        console.error("Error fetching documents: ", err)
        setError("Failed to fetch documents. Please try again.")
      }
      setLoading(false)
    }

    fetchDocuments()
  }, [])

  const handleReview = async (id, status, comments) => {
    try {
      await updateDoc(doc(db, "documents", id), {
        status,
        reviewedBy: currentUser.uid,
        reviewedAt: new Date(),
        comments,
      })

      setDocuments(documents.filter((doc) => doc.id !== id))
    } catch (err) {
      console.error("Error updating document: ", err)
      setError("Failed to update document status. Please try again.")
    }
  }

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Review Documents
        </Typography>
        {documents.map((doc) => (
          <Card key={doc.id} sx={{ width: "100%", mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{doc.fileName}</Typography>
              <Typography>Borrower: {doc.borrowerName}</Typography>
              <Typography>Constitution: {doc.borrowerConstitution}</Typography>
              <Typography>Loan Facility: {doc.loanFacility}</Typography>
              <Typography>Document Type: {doc.documentType}</Typography>
              <Button href={doc.fileUrl} target="_blank" rel="noopener noreferrer" sx={{ mt: 1, mb: 1 }}>
                View Document
              </Button>
              <TextField
                fullWidth
                margin="normal"
                label="Comments"
                multiline
                rows={4}
                variant="outlined"
                onChange={(e) => (doc.comments = e.target.value)}
              />
              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Button
                  onClick={() => handleReview(doc.id, "approved", doc.comments)}
                  color="primary"
                  variant="contained"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleReview(doc.id, "rejected", doc.comments)}
                  color="secondary"
                  variant="contained"
                >
                  Reject
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  )
}

export default ReviewDocuments

