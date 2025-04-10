// uploadFile.js
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
  
    const res = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });
  
    const data = await res.json();
    return data.fileUrl;
    console.log(data.fileUrl); // Save this to Firebase Firestore
  }
  
  export default uploadFile;