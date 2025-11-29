import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URL = process.env.DB_URI || "";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB Connected ✔");
  } catch (err) {
    console.error("MongoDB Error ❌", err);
    process.exit(1);
  }
};

export default connectDB;
