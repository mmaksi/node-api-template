const usersDatabase = require("./User.mongo");

const registerUser = async (user) => {
  const registeredUser = await usersDatabase.create(user);
  return registeredUser;
};

const getUserById = async (id) => {
  const user = await usersDatabase.findById(id);
  return user;
};

const findUser = async (criteria, data) => {
  const foundUser = await usersDatabase.findOne({ [criteria]: data });
  return foundUser;
};

const findAuthUser = async (resetPasswordToken) => {
  const user = await usersDatabase.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  return user;
};

const updateUserDetails = async (id, fieldsToUpdate) => {
  const user = await usersDatabase.findOneAndUpdate(id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  return user;
};

const deleteUser = async (id) => {
  await usersDatabase.findByIdAndDelete(id);
};

module.exports = {
  registerUser,
  getUserById,
  findUser,
  findAuthUser,
  updateUserDetails,
  deleteUser,
};
