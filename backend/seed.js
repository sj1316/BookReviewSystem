require('dotenv').config();
const mongoose = require('mongoose');
const seedData = require('./seedData');

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await seedData();
    console.log('Data seeded successfully');

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  }
};

runSeed();