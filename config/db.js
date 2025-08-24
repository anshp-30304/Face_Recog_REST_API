const mongoose = require("mongoose");

const connectDB = async () => {
  try {
       const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/FaceAuth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
       serverSelectionTimeoutMS: 5000, 
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
