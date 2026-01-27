/* eslint-disable no-undef */
import express from 'express';
// ... rest of your code
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'; // Import dotenv

// Load config
dotenv.config({ path: './config.env' });

import WorkerModel from './models/worker_details.js'; 

const app = express();

// Allow up to 10MB of data (enough for most images)
app.use(express.json({ limit: '10mb' }));


// ALLOW FRONTEND CONNECTION
app.use(cors()); 

// 1. CONNECT TO MONGODB
// Use the variable from your .env file or your connection string directly
const DB_URI = process.env.ATLAS_URI || "mongodb+srv://amodamendis:amodamendis@nomorebugsfulldb.juucjmo.mongodb.net/nomorebugsfulldb?appName=nomorebugsfulldb";
mongoose.connect(DB_URI, {
    dbName: 'nomorebugsfulldb'  
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));

// 2. REGISTER ROUTE
app.post('/register', (req, res) => {
    // Determine service type based on sex or add a dropdown later. Defaulting for now.
    const workerData = { ...req.body, serviceType: "General Worker" };

    WorkerModel.create(workerData)
        .then(worker => res.json({ status: "Success", data: worker }))
        .catch(err => {
            console.error(err);
            if (err.code === 11000) {
                res.json({ status: "Error", message: "Email already exists" });
            } else {
                res.json({ status: "Error", error: err });
            }
        });
});

// 3. LOGIN ROUTE
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    WorkerModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json({ status: "Success", user: user });
                } else {
                    res.json({ status: "Error", message: "Incorrect password" });
                }
            } else {
                res.json({ status: "Error", message: "User not found" });
            }
        })
        .catch(err => res.json({ status: "Error", error: err }));
});

// 4. GET WORKER DETAILS (BY ID)
app.get('/worker/:id', (req, res) => {
    const id = req.params.id;
    WorkerModel.findById(id)
        .then(user => res.json({ status: "Success", data: user }))
        .catch(err => res.json({ status: "Error", error: err }));
});

// 5. UPDATE WORKER DETAILS
app.put('/worker/:id', (req, res) => {
    const id = req.params.id;
    // We update only specific fields to be safe
    const updateData = {
        address: req.body.address,
        mobile: req.body.mobile,
        email: req.body.email,
        jobPosition: req.body.jobPosition,
        skills: req.body.skills // Expecting an array like ["Plumbing", "Wiring"]
    };

    WorkerModel.findByIdAndUpdate(id, updateData, { new: true }) // {new:true} returns the updated doc
        .then(updatedUser => res.json({ status: "Success", data: updatedUser }))
        .catch(err => res.json({ status: "Error", error: err }));
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});

