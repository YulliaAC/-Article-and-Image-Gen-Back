const app = require('./app');
const mongoose = require('mongoose');
require("dotenv").config();

const connectMongo =  async () => {
    mongoose.connect(process.env.MONGO_BASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  });
}

const start = async () => {
    try {
      await connectMongo();
      console.log("Database connection successful");
      app.listen(4000, () => {
        console.log("Server running. Use our API on port: 4000")
      })
    } catch (error) {
      console.log(error.message);
      process.exit(1)
    }
  };
  start();