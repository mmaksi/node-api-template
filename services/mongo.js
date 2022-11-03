const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!".cyan.underline.bold);
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  const connection = await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
