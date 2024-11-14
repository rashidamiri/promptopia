import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);
    
    if (isConnected){
        console.log("MongoDB is already connected.");
        return;
    }

    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined in environment variables");
        throw new Error("Please define MONGODB_URI in environment variables");
    }

    try {
        console.log('Attempting MongoDB connection...');
        console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
        // Log first few chars of URI for debugging (don't log full URI for security)
        console.log('MONGODB_URI starts with:', process.env.MONGODB_URI.substring(0, 20) + '...');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "share_prompt",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        
        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch(error){
        console.error("MongoDB connection error:", error);
        throw error; // Re-throw the error for better error tracking
    }
}
