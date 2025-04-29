export const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset"); // Replace with your Cloudinary Upload Preset
  
    const response = await fetch("https://api.cloudinary.com/v1_1/dnvfufzu0/raw/upload", {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error.message || "Failed to upload to Cloudinary");
    }
    return data.secure_url; // <- This is the file URL
  };
  