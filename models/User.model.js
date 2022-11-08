const userDatabase = require("./User.mongo");

const registerUser = async (user) => {
  const registeredUser = await userDatabase.create(user);
  return registeredUser;
};

const getUserById = async (id) => {
  const user = await userDatabase.findById(id);
  return user;
};

module.exports = {
  registerUser,
  getUserById,
};
