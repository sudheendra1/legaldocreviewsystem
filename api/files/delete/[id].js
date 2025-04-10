import mongoose from "mongoose"
import connectToDatabase from "../../../lib/mongodb"

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { id } = req.query

  try {
    const conn = await connectToDatabase()
    const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "uploads",
    })

    await gfs.delete(new mongoose.Types.ObjectId(id))
    res.status(200).json({ message: "File deleted successfully" })
  } catch (error) {
    console.error("Error deleting file:", error)
    res.status(500).json({ error: "Failed to delete file" })
  }
}

