const express = require('express');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');

// Inisialisasi model ML
let model;
const loadModel = async () => {
  try {
    model = await tf.loadGraphModel('./model/model.json');
    console.log('Model loaded!');
  } catch (error) {
    console.error('Error loading model:', error);
  }
};
loadModel();

const app = express();
const port = 3000;

// Konfigurasi Multer untuk upload file
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Fungsi preprocessing gambar
const preprocessImage = (imageBuffer) => {
  const tensor = tf.node.decodeImage(imageBuffer, 3);
  return tensor.resizeBilinear([224, 224]).expandDims(0);
};

// Endpoint untuk prediksi
app.post('/predict', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  try {
    const imageBuffer = req.file.buffer;
    
    const inputTensor = preprocessImage(imageBuffer);

    const predictions = model.predict(inputTensor);
    const predictionArray = predictions.dataSync();

    const maxConfidence = Math.max(...predictionArray);
    const diseaseType = predictionArray.indexOf(maxConfidence);
    const confidencePercentage = (maxConfidence * 100).toFixed(2);

 
    const threshold = 75; 
    if (confidencePercentage >= threshold) {
      return res.status(200).json({
        message: 'success',
        disease_type: diseaseType.toString(),
        confident: confidencePercentage,
      });
    } else {
      return res.status(200).json({
        message: 'low confidence',
        disease_type: diseaseType.toString(),
        confident: confidencePercentage,
      });
    }
  } catch (error) {
    console.error('Error during prediction:', error);
    return res.status(500).json({
      message: 'Error during prediction',
      error: error.message,
    });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
