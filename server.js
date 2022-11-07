const express = require("express");
const dotenv = require("dotenv");
const api = require("./routes/api");
const colors = require("colors");
const morgan = require("morgan");
const logger = require("./middleware/logger.middleware");
const { mongoConnect } = require("./services/mongo");
const errorHandler = require("./middleware/error.middleware");
const bootcampsRouter = require("./routes/bootcamps/bootcamps.router");
const coursesRouter = require("./routes/courses/courses.router");

const app = express();
// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Versioned API that mounts all routes
app.use("/v1/bootcamps", bootcampsRouter);
app.use("/v1/courses", coursesRouter);
app.use(errorHandler);

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to the database
mongoConnect();

// Start Server
const PORT = process.env | 5000;
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

module.exports = app;
