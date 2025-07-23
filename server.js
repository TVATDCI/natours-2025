const dotenv = require('dotenv');
// const mongoose = require('mongoose');
dotenv.config({ path: './config.env' }); // Load env vars FIRST
const connectDB = require('./config/db');
const app = require('./app');

dotenv.config({ path: './config.env' });

// Call the function from config/db to connect to mongoose database
connectDB();

// console.log(app.get('env'));
// console.log(process.env);
// console.log('NODE_ENV:', process.env.NODE_ENV);
// console.log('PORT:', process.env.PORT);
// console.log('USERNAME:', process.env.DEV_USERNAME);
// console.log('PASSWORD:', process.env.PASSWORD);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
