const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

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
let users = [];
let reviews = [];
try {
  tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
  users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
  reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
} catch (err) {
  console.error('Failed to read or parse tours JSON:', err.message);
  process.exit(1);
}

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    // NOTE: Turn of the validation to confirm the data import. Also encrypting middleware in userModel must be OFF, too!
    // REASON: the seed file often has plain passwords that won’t pass validation/middleware (like password hashing).

    console.log('Data loaded successfully');
  } catch (err) {
    console.error('Failed to import data:', err.message);
    console.error('Failed to import data:', err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted successfully');
  } catch (err) {
    console.error('Failed to delete data:', err.message);
  }
};

const seeder = async () => {
  await connectDB();

  // DEBUG: logs here
  console.log('Full argv array:', process.argv);
  console.log('Your command was:', process.argv[2]);

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

// TODO:import, export data with the script below:
// node dev-data/data/import-dev-data.js --import
// node dev-data/data/import-dev-data.js --delete
