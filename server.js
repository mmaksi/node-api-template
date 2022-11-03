const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = 5000;

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan());
}

app.listen(PORT, () =>
  console.log(
    `App listening in ${process.env.NODE_ENV} mode on port ${PORT}...`
  )
);
