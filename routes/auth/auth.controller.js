const {
  registerUser,
  getUserById,
  findUser,
} = require("../../models/User.model");
const asyncHandler = require("../../utils/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const userDatabase = require("../../models/User.mongo");
const sendEmail = require("../../utils/nodemailer");

// @desc      POST auth
// @route     POST /v1/auth/register
// @access    Public
const httpRegisterUser = asyncHandler(async (req, res, next) => {
  const user = { ...req.body };
  const registeredUser = await registerUser(user);
  sendTokenResponse(registeredUser, 200, res);
});

// @desc      POST auth
// @route     POST /v1/auth/signin
// @access    Public
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

// @desc      GET auth
// @route     GET /v1/auth/me
// @access    Public
const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await getUserById(req.user.id);
  return res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      POST auth
// @route     POST /v1/auth/forgotpassword
// @access    Public
const httpForgotPassword = asyncHandler(async (req, res, next) => {
  const user = await findUser("email", req.body.email);
  if (!user) {
    return next(new ErrorResponse(`Email not found`, 404));
  } else {
    // Get resetToken
    const resetToken = user.getResetPasswordToken();
    user.save({ validateBeforeSave: false });
    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/v1/resetpassword/${resetToken}`;
    const message = `You are recieving this email because you or someone else a has requested a password reset. Please make a PUT request to \n\n ${resetUrl}`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      });
      return res.status(200).json(`Reset email sent`);
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      user.save({ validateBeforeSave: false });
      return next(new ErrorResponse(`Email could not be sent`), 500);
    }
  }
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

module.exports = {
  httpRegisterUser,
  httpSigninUser,
  getCurrentUser,
  httpForgotPassword,
};
