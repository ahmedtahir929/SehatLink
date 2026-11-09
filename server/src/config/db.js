/**
 * SehatLink - Database Connection Manager
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * Role: MongoDB Schema Lead & Backend System Architect
 */

import mongoose from 'mongoose';

const DEFAULT_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sehatlink';

async function connectDB(customUri) {
  const uri = customUri || DEFAULT_URI;
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.warn(`[MongoDB Notice] For local testing/demo without local mongod, test suite uses in-memory mocked databases.`);
    return null;
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
}

export {
  connectDB,
  disconnectDB
};
