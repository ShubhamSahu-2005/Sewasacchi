import mongoose from 'mongoose';
let isConnected = false; // tracking the connection of user and database
console.log(process.env.MONGODB_URI)
export const connectToDB = async () => {
    if (!isConnected) { // Check if not already connected
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                dbName: "SewaSacchi",
                useNewUrlParser: true, // Optional in newer versions
                useUnifiedTopology: true, // Optional in newer versions
            });
            isConnected = true; // Update connection state
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw new Error('Failed to connect to MongoDB');
        }
    }
};