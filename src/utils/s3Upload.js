
import AWS from "aws-sdk"

// Configure AWS once
const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME
const REGION = process.env.REACT_APP_S3_REGION

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
})

// Initialize S3 client
const s3 = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
})

export const uploadToS3 = (file, onProgress) => {
  // console.log("s3_bucket", process.env.REACT_APP_S3_BUCKET_NAME);
  // console.log("region", process.env.REACT_APP_S3_REGION);
  // console.log("accessKeyId", process.env.REACT_APP_AWS_ACCESS_KEY_ID);
  // console.log("secretAccessKey", process.env.REACT_APP_AWS_SECRET_ACCESS_KEY);

  const params = {
    Bucket: S3_BUCKET,
    Key: `${Date.now()}_${file.name}`,
    Body: file,
    // ACL: "public-read",
    ContentType: file.type,
  }

  return new Promise((resolve, reject) => {
    const upload = s3.upload(params, (err, data) => {
      if (err) {
        console.error("S3 Upload Error:", err)
        reject(err)
      } else {
        resolve(data.Location) // ✅ Public URL
      }
    })

    upload.on("httpUploadProgress", (evt) => {
      const percent = Math.round((evt.loaded / evt.total) * 100)
      if (onProgress) onProgress(percent)
    })

    upload.send((err, data) => {
      if (err) reject(err)
      else resolve(data.Location)
    })
  })
}

/**
 * Delete a file from S3 using its URL
 * @param {string} fileUrl - The full S3 URL of the file to delete
 * @returns {Promise<boolean>} - Returns true if deletion was successful
 */
export const deleteFromS3 = async (fileUrl) => {
  try {
    if (!fileUrl) {
      throw new Error("File URL is required")
    }

    // Extract the key from the S3 URL
    let key

    if (fileUrl.includes("amazonaws.com")) {
      // Handle standard S3 URLs: https://bucket-name.s3.region.amazonaws.com/key
      const url = new URL(fileUrl)
      key = url.pathname.substring(1) // Remove leading slash
    } else if (fileUrl.includes("s3.")) {
      // Handle alternative S3 URL format: https://s3.region.amazonaws.com/bucket-name/key
      const url = new URL(fileUrl)
      const pathParts = url.pathname.split("/")
      key = pathParts.slice(2).join("/") // Remove bucket name and leading slash
    } else {
      // If it's just a key without full URL
      key = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl
    }

    if (!key) {
      throw new Error("Could not extract file key from URL")
    }

    console.log(`Attempting to delete file with key: ${key}`)

    const params = {
      Bucket: S3_BUCKET,
      Key: key,
    }

    await s3.deleteObject(params).promise()
    console.log(`Successfully deleted file: ${key}`)
    return true
  } catch (error) {
    console.error("Error deleting file from S3:", error)
    throw error
  }
}

/**
 * Delete multiple files from S3
 * @param {string[]} fileUrls - Array of S3 URLs to delete
 * @returns {Promise<{successful: string[], failed: string[]}>} - Returns arrays of successful and failed deletions
 */
export const deleteMultipleFromS3 = async (fileUrls) => {
  const results = {
    successful: [],
    failed: [],
  }

  if (!fileUrls || fileUrls.length === 0) {
    return results
  }

  // Process deletions in parallel but handle errors individually
  const deletePromises = fileUrls.map(async (fileUrl) => {
    try {
      await deleteFromS3(fileUrl)
      results.successful.push(fileUrl)
    } catch (error) {
      console.error(`Failed to delete ${fileUrl}:`, error)
      results.failed.push(fileUrl)
    }
  })

  await Promise.allSettled(deletePromises)

  console.log(`Deletion complete. Successful: ${results.successful.length}, Failed: ${results.failed.length}`)
  return results
}

/**
 * Check if a file exists in S3
 * @param {string} fileUrl - The S3 URL to check
 * @returns {Promise<boolean>} - Returns true if file exists
 */
export const checkFileExistsInS3 = async (fileUrl) => {
  try {
    if (!fileUrl) {
      return false
    }

    // Extract the key from the S3 URL (same logic as deleteFromS3)
    let key

    if (fileUrl.includes("amazonaws.com")) {
      const url = new URL(fileUrl)
      key = url.pathname.substring(1)
    } else if (fileUrl.includes("s3.")) {
      const url = new URL(fileUrl)
      const pathParts = url.pathname.split("/")
      key = pathParts.slice(2).join("/")
    } else {
      key = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl
    }

    if (!key) {
      return false
    }

    const params = {
      Bucket: S3_BUCKET,
      Key: key,
    }

    await s3.headObject(params).promise()
    return true
  } catch (error) {
    if (error.code === "NotFound") {
      return false
    }
    console.error("Error checking file existence:", error)
    throw error
  }
}
