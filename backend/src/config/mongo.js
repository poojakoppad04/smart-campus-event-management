const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

let db;

const connectMongoDB = async () => {
  try {
    await client.connect();
    db = client.db(process.env.MONGO_DB_NAME);
    console.log("MongoDB connected successfully");
    return db;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

const getMongoDB = () => {
  if (!db) {
    throw new Error("MongoDB is not connected");
  }
  return db;
};

module.exports = { connectMongoDB, getMongoDB };
