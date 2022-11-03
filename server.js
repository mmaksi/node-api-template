const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const api = require("./routes/api");

// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = 5000;

// Body parser
app.use(express.json());
// Versioned API that mounts all routes
app.use("/v1", api);

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan());
}

app.listen(PORT, () =>
  console.log(
    `App listening in ${process.env.NODE_ENV} mode on port ${PORT}...`
  )
);
