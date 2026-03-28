const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(" MongoDB Connected");
  } catch (err) {
    console.error(" Connection Error:", err);
    process.exit(1);
  }
};

module.exports = {connectDB,MONGO_URL};