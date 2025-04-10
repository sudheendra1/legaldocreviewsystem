const express = require("express")
const mongoose = require("mongoose")
const multer = require("multer")
const { GridFsStorage } = require("multer-gridfs-storage")
const cors = require("cors")
const crypto = require("crypto")
const path = require("path")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI

// Create mongoose connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const conn = mongoose.connection
conn.once("open", () => {
  console.log("MongoDB database connection established successfully")
})

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err)
        }
        const filename = buf.toString("hex") + path.extname(file.originalname)
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
          metadata: {
            originalName: file.originalname,
            userId: req.body.userId,
            uploadDate: new Date(),
            documentType: req.body.documentType,
          },
        }
        resolve(fileInfo)
      })
    })
  },
})

const upload = multer({ storage })

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" })
  }

  // Return file information including the MongoDB ID
  res.json({
    fileId: req.file.id,
    filename: req.file.filename,
    originalName: req.file.metadata.originalName,
    documentType: req.file.metadata.documentType,
    uploadDate: req.file.metadata.uploadDate,
    url: `/files/${req.file.filename}`,
  })
})

// Get file endpoint
app.get("/files/:filename", (req, res) => {
  const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  })

  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "File not found" })
    }

    // Check if image
    if (files[0].contentType.startsWith("image/")) {
      // Read output to browser
      const readstream = gfs.openDownloadStreamByName(req.params.filename)
      readstream.pipe(res)
    } else {
      // Read output to browser for PDF and other files
      res.set("Content-Type", files[0].contentType)
      const readstream = gfs.openDownloadStreamByName(req.params.filename)
      readstream.pipe(res)
    }
  })
})

// Delete file endpoint
app.delete("/files/:id", (req, res) => {
  const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  })

  gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ message: "File deleted successfully" })
  })
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})

