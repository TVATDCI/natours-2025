const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const connectDB = async () => {
  try {
    const DB = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected: ${DB.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

let tours = [];
try {
  tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
  );
} catch (err) {
  console.error('Failed to read or parse tours JSON:', err.message);
  process.exit(1);
}

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data loaded successfully');
  } catch (err) {
    console.error('Failed to import data:', err.message);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully');
  } catch (err) {
    console.error('Failed to delete data:', err.message);
  }
};

const seeder = async () => {
  await connectDB();

  const command = process.argv[2];

  if (command === '--import') {
    await importData();
  } else if (command === '--delete') {
    await deleteData();
  } else {
    console.log('\nPlease use --import or --delete as a command\n');
  }

  process.exit();
};

seeder();
