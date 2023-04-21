const app = require('./app');
const mongoose = require('mongoose');
// const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// const client = new Client({
//   intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.MessageContent,
//     // GatewayIntentBits.GuildMembers,
//   ],
// });

const connectMongo =  async () => {
    mongoose.connect(process.env.MONGO_BASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  });
}

// const connectDiscord = async () => {
//   client.on("ready", () => {
//       // const channel = client.channels.cache.get('1097873441333448789')
//       // channel.send('image')
//       console.log(`Logged in as ${client.user.tag}!`);
//     });
// }

// client.login(process.env.DISCORD_TOKEN);

const start = async () => {
    try {
      await connectMongo();
      console.log("Database connection successful");
      // await connectDiscord();
      app.listen(3005, () => {
        console.log("Server running. Use our API on port: 3005")

      })
    } catch (error) {
      console.log(error.message);
      process.exit(1)
    }
  };
  start();