const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDb Database");
  } catch (error) {
    console.log("Error :( While Connecting to MongoDb Database");
  }
};

module.exports = connectToDb;

// 'mongodb://127.0.0.1:27017/BlogApp'
