/* eslint-disable */
const mongoose = require('mongoose');

const connectDB = async () => {
  // No try/catch — let the rejection bubble up in server.js
  const DB = await mongoose.connect(process.env.MONGO_URL);
  console.log(`MongoDB 🍃 connected successfully 🟢 : ${DB.connection.host}`);
  console.log(`Port:🌐: ${DB.connection.port}`);
  console.log(`Database: ${DB.connection.name}`);
};

module.exports = connectDB;
