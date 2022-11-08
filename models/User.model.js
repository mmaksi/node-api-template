const UserDatabase = require("./User.mongo");

const registerUser = async (user) => {
  const registeredUser = await UserDatabase.create(user);
  return registeredUser;
};

module.exports = {
  registerUser,
};
