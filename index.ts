import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './models/db';
import bot from './bot/bot';

dotenv.config();

const shutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} received. Shutting down...`);
  
  try {
    bot.stop(signal);
    console.log('Bot stopped');
    
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => {
  shutdown('SIGINT').catch((err) => {
    console.error('Error during shutdown:', err);
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM').catch((err) => {
    console.error('Error during shutdown:', err);
    process.exit(1);
  });
});

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