const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const DB = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${DB.connection.host}`);
    console.log('DB connection successful!');
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
