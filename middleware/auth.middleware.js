const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const userDatabase = require("../models/User.mongo");
const asyncHandler = require("../utils/asyncHandler");

// Protect routes: verify token from auth headers and set req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
    // Set token from cookie
    req.cookies = token;
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach a user to the request object
    req.user = await userDatabase.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

module.exports = protect;
