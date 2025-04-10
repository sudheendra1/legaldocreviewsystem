import multer from "multer"
import { GridFsStorage } from "multer-gridfs-storage"
import crypto from "crypto"
import path from "path"
import connectToDatabase from "../lib/mongodb"

// Initialize MongoDB connection
let bucket
const mongoURI = process.env.MONGODB_URI

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

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    await connectToDatabase()

    // Use multer to handle the file upload
    upload.single("file")(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" })
      }

      // Return file information including the MongoDB ID
      res.status(200).json({
        fileId: req.file.id,
        filename: req.file.filename,
        originalName: req.file.metadata.originalName,
        documentType: req.file.metadata.documentType,
        uploadDate: req.file.metadata.uploadDate,
        url: `/api/files/${req.file.filename}`,
      })
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    res.status(500).json({ error: "Failed to upload file" })
  }
}

