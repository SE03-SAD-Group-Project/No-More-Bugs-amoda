const { MongoClient } = require('mongodb'); // FIX 1: Correct spelling (Capital 'M')
require('dotenv').config({path: './config.env'}); // FIX 2: Correct path relative to where you run the command

async function connectToDatabase() {
    const Db = process.env.ATLAS_URI;
    
    // Check if the URI loaded correctly
    if (!Db) {
        console.error("Error: ATLAS_URI is undefined. Check your .env file path.");
        return;
    }

    const client = new MongoClient(Db); // FIX 3: Pass the connection string (Db) into the client

    try {
        await client.connect();
        console.log("Successfully connected to MongoDB Atlas!");
        
        const collections = await client.db().collections();
        // FIX 4: Correct capitalization for .forEach()
        collections.forEach((collection) => console.log(collection.collectionName)); 
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    } finally {
        await client.close();
    }
}

// FIX 5: Call the actual function name
connectToDatabase();