/* eslint-disable no-undef */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // IMPORT PATH
import { fileURLToPath } from 'url'; // IMPORT URL HELPERS

// Load config
dotenv.config({ path: './config.env' });

import WorkerModel from './models/worker_details.js'; 

// --- CONFIG FOR STATIC FILES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Allow up to 10MB of data
app.use(express.json({ limit: '10mb' }));

// ALLOW FRONTEND CONNECTION
app.use(cors()); 

// 1. CONNECT TO MONGODB (Hardcoded for safety as requested)
const DB_URI = "mongodb+srv://amodamendis:amodamendis@nomorebugsfulldb.juucjmo.mongodb.net/nomorebugsfulldb?appName=nomorebugsfulldb";

mongoose.connect(DB_URI)
.then(() => console.log("Connected to MongoDB (nomorebugsfulldb)"))
.catch(err => console.error("Could not connect to MongoDB", err));

// ---------------------------------------------
// API ROUTES
// ---------------------------------------------

// 2. REGISTER ROUTE
app.post('/register', (req, res) => {
    const workerData = { ...req.body, serviceType: "General Worker" };
    WorkerModel.create(workerData)
        .then(worker => res.json({ status: "Success", data: worker }))
        .catch(err => {
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
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    
    WorkerModel.findOne({ email: cleanEmail })
        .then(user => {
            if (user) {
                if (user.password === cleanPassword) {
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

// 4. GET WORKER DETAILS
app.get('/worker/:id', (req, res) => {
    WorkerModel.findById(req.params.id)
        .then(user => res.json({ status: "Success", data: user }))
        .catch(err => res.json({ status: "Error", error: err }));
});

// 5. UPDATE WORKER DETAILS
app.put('/worker/:id', (req, res) => {
    const updateData = {
        address: req.body.address,
        mobile: req.body.mobile,
        email: req.body.email,
        jobPosition: req.body.jobPosition,
        skills: req.body.skills,
        profileImage: req.body.profileImage
    };

    WorkerModel.findByIdAndUpdate(req.params.id, updateData, { new: true })
        .then(updatedUser => res.json({ status: "Success", data: updatedUser }))
        .catch(err => res.json({ status: "Error", error: err }));
});

// ---------------------------------------------
// SERVE FRONTEND (AZURE INTEGRATION)
// ---------------------------------------------

// 1. Serve static files from the 'dist' folder (created by npm run build)
// We go up one level (../) because index.js is inside server/ folder
app.use(express.static(path.join(__dirname, '../dist')));

// 2. Catch-all route: Send index.html for any request not handled by API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});