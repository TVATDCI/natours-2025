// SITUATION: catching try/catch exiting immediately inside connectDB(), which means the unhandledRejection global handler never even has a chance to run.
// Because the promise rejection is already being handled right there in the catch.
// To intercept an unhandled rejection before Express starts serving requests.
// And Centralize failure of entire error-handling ecosystem in server.js
// REFACTOR PLAN:
// STEP: 1. Remove try/catch from connectDB(). so the rejection will bubbles up!
// STEP: 2. Call connectDB() in server.js and attach .catch() only in a global process.on('unhandledRejection') handler.
// STEP: 3.Store the server in a variable so it can be shut down timely

const mongoose = require('mongoose');

const connectDB = async () => {
  // No try/catch — let the rejection bubble up
  const DB = await mongoose.connect(process.env.MONGO_URL);
  console.log(`MongoDB connected successfully 🛸 : ${DB.connection.host}`);
  console.log(`Port:👉 ${DB.connection.port}`);
  console.log(`Database: ${DB.connection.name}`);
};

module.exports = connectDB;

// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const DB = await mongoose.connect(process.env.MONGO_URL);
//     console.log(`MongoDB Connected: ${DB.connection.host}`);
//     console.log(`Port: ${DB.connection.port}`);
//     console.log(`Database: ${DB.connection.name}`);
//   } catch (error) {
//     console.error(`MongoDB connection error: ${error.message}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
