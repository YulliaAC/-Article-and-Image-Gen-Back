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
      app.listen(3005, () => {
        console.log("Server running. Use our API on port: 3005")

      })
    } catch (error) {
      console.log(error.message);
      process.exit(1)
    }
  };
  start();