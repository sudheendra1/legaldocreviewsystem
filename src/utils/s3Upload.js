// src/utils/s3Upload.js

import AWS from "aws-sdk";



export const uploadToS3 = (file, onProgress) => {
  const S3_BUCKET =  process.env.REACT_APP_S3_BUCKET_NAME;
  const REGION = process.env.REACT_APP_S3_REGION;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

// console.log("s3_bucket", process.env.REACT_APP_S3_BUCKET_NAME);
// console.log("region", process.env.REACT_APP_S3_REGION);
// console.log("accessKeyId", process.env.REACT_APP_AWS_ACCESS_KEY_ID);
// console.log("secretAccessKey", process.env.REACT_APP_AWS_SECRET_ACCESS_KEY);

  // Initialize S3 client

const s3 = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

  const params = {
    Bucket: S3_BUCKET,
    Key: `${Date.now()}_${file.name}`,
    Body: file,
    // ACL: "public-read",
    ContentType: file.type,
  };

  return new Promise((resolve, reject) => {
    const upload = s3.upload(params, (err, data) => {
      if (err) {
        console.error("S3 Upload Error:", err);
        reject(err);
      } else {
        resolve(data.Location); // ✅ Public URL
      }
    });
    upload.on("httpUploadProgress", (evt) => {
      const percent = Math.round((evt.loaded / evt.total) * 100);
      if (onProgress) onProgress(percent);
    });
    upload.send((err, data) => {
      if (err) reject(err);
      else resolve(data.Location);
    });
  });
};
