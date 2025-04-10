import mongoose from "mongoose"
import connectToDatabase from "../../lib/mongodb"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { filename } = req.query

  try {
    const conn = await connectToDatabase()
    const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "uploads",
    })

    const files = await gfs.find({ filename }).toArray()

    if (!files || files.length === 0) {
      return res.status(404).json({ error: "File not found" })
    }

    // Set appropriate content type
    res.setHeader("Content-Type", files[0].contentType)

    // Create a readable stream
    const readstream = gfs.openDownloadStreamByName(filename)

    // Pipe the file to the response
    readstream.pipe(res)
  } catch (error) {
    console.error("Error retrieving file:", error)
    res.status(500).json({ error: "Failed to retrieve file" })
  }
}

