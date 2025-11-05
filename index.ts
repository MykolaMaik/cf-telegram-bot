import dotenv from 'dotenv';
import connectDB from './models/db';
import bot from './bot/bot';

dotenv.config();

const start = async (): Promise<void> => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');

    bot.launch().then(() => {
      console.log('Bot started');
    }).catch((error: Error) => {
      console.error('Bot launch error:', error);
      process.exit(1);
    });

    console.log('Application started');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

start();