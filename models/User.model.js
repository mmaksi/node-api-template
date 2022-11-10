const userDatabase = require("./User.mongo");

const registerUser = async (user) => {
  const registeredUser = await userDatabase.create(user);
  return registeredUser;
};

const getUserById = async (id) => {
  const user = await userDatabase.findById(id);
  return user;
};

const findUser = async (criteria, data) => {
  const foundUser = await userDatabase.findOne({ [criteria]: data });
  return foundUser;
};

const findAuthUser = async (resetPasswordToken) => {
  const user = await userDatabase.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  return user;
};

const updateUserDetails = async (id, fieldsToUpdate) => {
  const user = await userDatabase.findOneAndUpdate(id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  return user;
};

module.exports = {
  registerUser,
  getUserById,
  findUser,
  findAuthUser,
  updateUserDetails,
};
