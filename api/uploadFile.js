// // uploadFile.js
// async function uploadFile(file) {
//     const formData = new FormData();
//     formData.append('file', file);
  
//     const res = await fetch('http://your-backend-url/upload', {
//       method: 'POST',
//       body: formData,
//     });
  
//     const data = await res.json();
//     return data.fileUrl; // Save this to Firebase Firestore
//   }
  
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('http://localhost:5000/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload');
  }

  const data = await res.json();
  return data.fileUrl;
}

export default uploadFile;
