import mongoose from 'mongoose';
let isConnected= false; //tracking the connection of user and database

export const connectToDB = async () => {
    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName:"SewaSacchi",
          useNewUrlParser: true, // Optional in newer versions
          useUnifiedTopology: true, // Optional in newer versions
        });
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('MongoDB connection error:', error);
        throw new Error('Failed to connect to MongoDB');
      }
    }
  };