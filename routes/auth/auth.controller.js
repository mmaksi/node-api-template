const { registerUser } = require("../../models/User.model");
const asyncHandler = require("../../utils/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const userDatabase = require("../../models/User.mongo");

const httpRegisterUser = asyncHandler(async (req, res, next) => {
  const user = { ...req.body };
  const registeredUser = await registerUser(user);
  registeredUser.getSignedJwtToken((err, token) => {
    if (!err) return res.status(200).json({ success: true, token });
  });
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
  console.log({ user });
  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }
  // Create token
  user.getSignedJwtToken((err, token) => {
    if (!err) return res.status(200).json({ success: true, token });
  });
});

module.exports = {
  httpRegisterUser,
  httpSigninUser,
};
