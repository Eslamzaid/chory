const AddUser =
  "INSERT INTO users_chory (email, password, name) VALUES ($1, $2, $3)";
const addUserData =
  "INSERT INTO user_data (user_id, user_name, phone, bio) VALUES ($1, $2, $3, $4)";
const getUser = "SELECT * FROM users_chory WHERE email = $1";
const getUserLogin =
  "SELECT * FROM users_chory WHERE email = $1 AND password = $2";
const userId = "SELECT user_id FROM users_chory WHERE email = $1";
const proUserId =
  " SELECT user_id FROM users_chory WHERE email = $1 OR email = $2";
const searchUser = "SELECT * FROM users_chory WHERE email = $1";
const getUserData = "SELECT * FROM user_data WHERE user_id = $1";
const addRoom =
  "INSERT INTO connections (user_id, friend_id, roomn) VALUES ($1, $2, $3)";
const existingRoom = "SELECT roomn FROM connections WHERE user_id = $1";

module.exports = {
  AddUser,
  getUser,
  userId,
  getUserLogin,
  searchUser,
  addUserData,
  getUserData,
  addRoom,
  existingRoom,
  proUserId,
};
