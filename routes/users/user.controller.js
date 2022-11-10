const {
  getUserById,
  updateUserDetails,
  deleteUser,
} = require("../../models/User.model");
const asyncHandler = require("../../utils/asyncHandler");

// @desc      Get users
// @route     GET /v1/auth/users
// @access    Public
const httpGetAllUsers = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});

// @desc      Get users
// @route     GET /v1/auth/users/:id
// @access    Public
const httpGetUser = asyncHandler(async (req, res, next) => {
  const user = await getUserById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`No user found with this id`, 404));
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update user
// @route     PUT /v1/auth/users/:id
// @access    Private
const httpUpdateUser = asyncHandler(async (req, res, next) => {
  const updatedUser = await updateUserDetails(req.params.id, req.body);

  return res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// @desc      Delete user
// @route     DELETE /v1/auth/users/:id
// @access    Private
const httpDeleteUser = asyncHandler(async (req, res, next) => {
  await deleteUser(req.params.id);

  return res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  httpGetAllUsers,
  httpGetUser,
  httpUpdateUser,
  httpDeleteUser,
};
