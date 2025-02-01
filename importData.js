import express from 'express';
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import cors from 'cors'; // Import cors
import fs from 'fs'; // Import fs module to read files

config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Add this line

// MongoDB setup
const uri = process.env.URI;
const client = new MongoClient(uri);

// Function to read the JSON file and insert it into MongoDB
async function loadDataIntoDB() {
  try {
    // Read the JSON file
    const jsonData = fs.readFileSync('data.json', 'utf-8');
    
    // Parse the JSON data
    const data = JSON.parse(jsonData);

    // Connect to MongoDB
    await client.connect();

    // Access the database and collection
    const db = client.db('hackgang'); // Change to your database name
    const collection = db.collection('groups'); // Change to your collection name

    // Insert the data into the collection
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted.`);

  } catch (error) {
    console.error('Error loading data into MongoDB:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

// Call the loadDataIntoDB function when the server starts
loadDataIntoDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
