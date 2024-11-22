const { Storage } = require('@google-cloud/storage');
const mimeTypes = require('mime-types');
require('dotenv').config();

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Path to your service account key
});

const bucket = storage.bucket(process.env.BUCKET_NAME); // Use your GCS bucket name

// Function to upload image to Google Cloud Storage (GCS)
async function uploadImageToGCS(buffer, fileName, folderName = 'predict-images') {
  try {
    const mimeType = mimeTypes.lookup(fileName) || 'application/octet-stream';

    // Upload the buffer directly to GCS
    const file = bucket.file(`${folderName}/${fileName}`);
    
    await file.save(buffer, {
      contentType: mimeType,  // Set the content type of the file
      // Removed legacy ACLs here, instead use "public: true" in the metadata if needed
    });

    console.log(`File uploaded to ${folderName}/${fileName}`);

    // Return the public URL of the uploaded file
    return `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${folderName}/${fileName}`;
  } catch (err) {
    console.error('Error uploading image to GCS:', err);
    throw new Error('Error uploading image to GCS');
  }
}

// Function to get the public URL for an object in the bucket
function getPublicUrl(folderName, fileName) {
  return `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${folderName}/${fileName}`;
}

module.exports = {
  uploadImageToGCS,
  getPublicUrl, // Export the new function
};
