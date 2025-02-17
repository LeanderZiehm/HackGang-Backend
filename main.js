import express from 'express';
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import cors from 'cors'; // Import cors

config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests


// MongoDB setup
const uri = process.env.URI;
const client = new MongoClient(uri);

// Function to get all groups from MongoDB
async function getAllGroups() {
  try {
    // Connect to MongoDB
    await client.connect();

    // Access the database and collection
    const db = client.db('hackgang'); // Replace with your database name
    const collection = db.collection('groups'); // Replace with your collection name

    // Fetch all groups from the collection
    const groups = await collection.find().toArray();

    return groups; // Return groups as an array
  } catch (error) {
    console.error('Error retrieving groups from MongoDB:', error);
    throw error; // Throw error to be caught in the route handler
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}


app.get('/', async (req, res) => {
  try {
    const groups = await getAllGroups();
    res.status(200).json(groups); // Send the groups as a JSON response
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving groups' });
  }
});

// Route to get all groups
app.get('/groups', async (req, res) => {
  try {
    const groups = await getAllGroups();
    res.status(200).json(groups); // Send the groups as a JSON response
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving groups' });
  }
});






// Function to add a new group to MongoDB
async function addGroup(groupData) {
  try {
    // Connect to MongoDB
    await client.connect();

    // Access the database and collection
    const db = client.db('hackgang'); // Replace with your database name
    const collection = db.collection('groups'); // Replace with your collection name

    // Insert the new group into the collection
    const result = await collection.insertOne(groupData);

    return result; // Return the result of the insertion
  } catch (error) {
    console.error('Error adding group to MongoDB:', error);
    throw error; // Throw error to be caught in the route handler
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}
app.post('/addGroup', async (req, res) => {
  const groupData = req.body; // Extract the group data from the request body

  try {
    // Add the group to MongoDB
    const result = await addGroup(groupData);
    res.status(201).json(result); // Return the result of the insertion
  } catch (error) {
    res.status(500).json({ error: 'Error adding group to database' });
  }
});









app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
