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

module.exports = {
  registerUser,
  getUserById,
  findUser,
};
