import mongoose from 'mongoose';

const WorkerSchema = new mongoose.Schema({
    // 1. IMAGE FIELD
    profileImage: { type: String, default: "" }, 

    // 2. PERSONAL DETAILS
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    sex: { type: String, required: true },
    birthday: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // 3. WORK DETAILS
    jobPosition: { type: String, default: "General Worker" }, 
    skills: { type: Array, default: [] },
    
    // 4. NEW STATUS FIELD (Automatically sets to "pending")
    status: { type: String, default: "pending" }, 

    // 5. REGISTRATION DATE
    registeredAt: { type: Date, default: Date.now }
}, { 
    collection: 'worker_details' 
});

export default mongoose.model('worker_details', WorkerSchema);