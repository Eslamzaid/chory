const AddUser =
  "INSERT INTO users_chory (email, password, name) VALUES ($1, $2, $3)";
const addUserData =
  "INSERT INTO user_data (user_id, user_name, phone, bio) VALUES ($1, $2, $3, $4)";
const getUser = "SELECT * FROM users_chory WHERE email = $1";
const getUserLogin =
  "SELECT * FROM users_chory WHERE email = $1 AND password = $2";
const userId = "SELECT user_id FROM users_chory WHERE email = $1";
const proUserId =
  "SELECT user_id FROM users_chory WHERE email = $1 OR email = $2";
const searchUser = "SELECT * FROM users_chory WHERE email = $1";
const getUserById = "SELECT email FROM users_chory WHERE user_id = $1";
const getAllById = "SELECT * FROM users_chory WHERE user_id = $1";
const getUserData = "SELECT * FROM user_data WHERE user_id = $1";
const addRoom =
  "INSERT INTO connections (user_id, freind_id, roomn) VALUES ($1, $2, $3)";
const existingRoom =
  "SELECT roomn FROM connections WHERE user_id = $1 AND freind_id = $2";
const getFriendId = "SELECT * FROM connections WHERE user_id = $1";
const getUserId = "SELECT * FROM connections WHERE freind_id = $1"
const addFriendRequest =
  "INSERT INTO friend_requests (sender_id, receiver_id, state) VALUES ($1, $2, $3)";
const checkExistingFriendRequest =
  "SELECT * FROM friend_requests WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)";

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
  getUserById,
  getFriendId,
  getAllById,
  addFriendRequest,
  checkExistingFriendRequest,
  getUserId,
};
