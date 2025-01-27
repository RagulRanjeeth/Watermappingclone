const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http'); // Import the 'http' module for creating the server

const app = express();

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB using promise-based syntax
mongoose.connect("mongodb+srv://ragulranjeeth2105116:Ragul655@watermappingcluster1.n9pozag.mongodb.net/SensorData?retryWrites=true&w=majority&appName=WaterMappingCluster1")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Define schema and model for sensor data
const sensorDataSchema = new mongoose.Schema({
  values: {
    type: Number,
    required: true
  }
});

const SensorData = mongoose.model('sensordatawaterqualitymanagements', sensorDataSchema);

// Route to handle root endpoint
app.get('/', (req, res) => {
  res.send('Water mapping sensor data!');
});

// Route to handle incoming sensor data
app.get('/sensor', (req, res) => {
  const sensorData = 9000; // Accessing sensor data from query parameters
  res.send('Received sensor data:', sensorData);

  // Save the sensor data to MongoDB
  const newData = new SensorData({ values: sensorData });
  newData.save()
    .then(() => {
      console.log('Sensor data saved to MongoDB');
      res.status(201).send('Sensor data saved successfully');
    })
    .catch((err) => {
      console.error('Error saving sensor data to MongoDB:', err);
      res.status(500).send('Internal server error');
    });
});

// Create HTTP server
const PORT = 8080;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
