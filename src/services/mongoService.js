import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

export const uploadFileToMongoDB = async (file, userId, documentType) => {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("userId", userId)
    formData.append("documentType", documentType)

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  } catch (error) {
    console.error("Error uploading file to MongoDB:", error)
    throw error
  }
}

export const getFileFromMongoDB = (filename) => {
  return `${API_URL}/files/${filename}`
}

export const deleteFileFromMongoDB = async (fileId) => {
  try {
    const response = await axios.delete(`${API_URL}/files/${fileId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting file from MongoDB:", error)
    throw error
  }
}

