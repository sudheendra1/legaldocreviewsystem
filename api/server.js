const express = require('express');
const multer = require('multer');
const { Readable } = require('stream');
const cors = require('cors');
const cloudinary = require('./cloudinaryConfig');

const app = express();
const upload = multer();
app.use(cors());

// File upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw' ,
        folder: 'document_verification',
      },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        console.log('File uploaded to Cloudinary:', result.secure_url);
        return res.status(200).json({ fileUrl: result.secure_url });
      }
    );

    Readable.from(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
