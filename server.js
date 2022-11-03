const express = require("express");
const dotenv = require("dotenv");
const api = require("./routes/api");
const colors = require("colors");
const morgan = require("morgan");
const logger = require("./middleware/logger.middleware");
const { mongoConnect } = require("./services/mongo");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to the database
mongoConnect();

const app = express();
const PORT = 5000;

// Versioned API that mounts all routes
app.use("/v1", api);

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const server = app.listen(PORT, () =>
  console.log(
    `App listening in ${process.env.NODE_ENV} mode on port ${PORT}...`.yellow
      .bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.log(`Error: ${reason.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
