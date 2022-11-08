const { registerUser, getUserById } = require("../../models/User.model");
const asyncHandler = require("../../utils/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const userDatabase = require("../../models/User.mongo");

const httpRegisterUser = asyncHandler(async (req, res, next) => {
  const user = { ...req.body };
  const registeredUser = await registerUser(user);
  sendTokenResponse(registeredUser, 200, res);
});

const httpSigninUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email and password
  if (!email || !password) {
    return next(
      new ErrorResponse(`Please provide and email and password`, 400)
    );
  }

  // Check for user
  const user = await userDatabase.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  // Respond with cookie + token
  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  };

  // It's up for the client to decide how to handle the cookie
  user.getSignedJwtToken((err, token) => {
    if (!err)
      return res
        .status(statusCode)
        .cookie("token", token, options)
        .json({ success: true, token });
  });
};

const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await getUserById(req.user.id);
  return res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  httpRegisterUser,
  httpSigninUser,
  getCurrentUser,
};
