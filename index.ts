import dotenv from 'dotenv';
import connectDB from './models/db';

dotenv.config();

const start = async () => {
  try {
    await connectDB();
    console.log('Application started');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

start();