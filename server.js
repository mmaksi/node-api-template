const path = require("path");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const { mongoConnect } = require("./services/mongo");
const errorHandler = require("./middleware/error.middleware");
const coursesRouter = require("./routes/courses/courses.router");
const bootcampsRouter = require("./routes/bootcamps/bootcamps.router");
const authRouter = require("./routes/auth/auth.router");
const usersRouter = require("./routes/users/users.router");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Body parser
app.use(express.json());
// File upload middleware
app.use(fileUpload());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Cookie Parser
app.use(cookieParser());
// Sanitize data
app.use(mongoSanitize());
// Set Security headers
app.use(helmet());
// Prevent XSS Attacks
app.use(xss());
// Prevent HTTP Parameters Pollution Attacks
app.use(hpp());
// Rate limiting
app.use(limiter);
// Enabling CORS
app.use(cors());

// Set static directory
app.use(express.static(path.join(__dirname, "public")));

// Versioned API that mounts all routes
app.use("/v1/bootcamps", bootcampsRouter);
app.use("/v1/courses", coursesRouter);
app.use("/v1/auth", authRouter);
app.use("/v1/users", usersRouter);
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
