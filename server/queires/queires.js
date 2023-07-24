const AddUser =
  "INSERT INTO users_chory (email, password, name) VALUES ($1, $2, $3)";
const addUserData =
  "INSERT INTO user_data (user_id, user_name, phone, bio) VALUES ($1, $2, $3, $4)";
const getUser = "SELECT * FROM users_chory WHERE email = $1";
const getUserLogin =
  "SELECT * FROM users_chory WHERE email = $1 AND password = $2";
const userId = "SELECT user_id FROM users_chory WHERE email = $1";
const getIdByEmail = "SELECT user_id FROM users_chory WHERE email = $1";
const searchUser = "SELECT * FROM users_chory WHERE email = $1";
const getEmailById = "SELECT email FROM users_chory WHERE user_id = $1";
const getAllById = "SELECT * FROM users_chory WHERE user_id = $1";
const getUserData = "SELECT * FROM user_data WHERE user_id = $1";
const addRoom =
  "INSERT INTO connections (user_id, roomn, freind_id) VALUES ($1, $2, $3)";
const existingRoom =
  "SELECT * FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2";
const getSenderId = "SELECT * FROM friend_requests WHERE sender_id = $1";
const getReceiverId = "SELECT * FROM friend_requests WHERE receiver_id = $1";
const getAllFromFriends =
  "SELECT * FROM friend_requests WHERE sender_id = $1 OR receiver_id = $1";
const addFriendRequest =
  "INSERT INTO friend_requests (sender_id, receiver_id, state) VALUES ($1, $2, $3)";
const checkExistingFriendRequest =
  "SELECT * FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2";
const checkExistingWaitingFriendReq =
  "SELECT * FROM friend_requests WHERE (receiver_id = $1 AND sender_id = $2)";
const deleteRequest =
  "DELETE FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2";
const updateStateFri =
  "UPDATE friend_requests SET state = 'friends' WHERE sender_id = $1 AND receiver_id = $2";
const checkRoomExits =
  "SELECT * FROM connections WHERE user_id = $1 AND freind_id = $2";
const getFriendsFromSen =
  "SELECT * FROM friend_requests WHERE state = 'friends' AND sender_id = $1 AND receiver_id = $2";
const getFriendsFromRes =
  "SELECT * FROM friend_requests WHERE state = 'friends' AND receiver_id = $1 AND sender_id = $2";
const addIntoList = "INSERT INTO friends (user_id, friendl_id) VALUES ($1, $2)";

const getAllByIds =
  "SELECT * FROM friends WHERE user_id = $1 OR friendl_id = $2";
const getAllByIds2 =
  "SELECT * FROM friends WHERE user_id = $1";
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
  getIdByEmail,
  getEmailById,
  getSenderId,
  getAllById,
  addFriendRequest,
  checkExistingFriendRequest,
  getReceiverId,
  getAllFromFriends,
  checkExistingWaitingFriendReq,
  deleteRequest,
  updateStateFri,
  checkRoomExits,
  getFriendsFromSen,
  getFriendsFromRes,
  addIntoList,
  getAllByIds,
  getAllByIds2,
};
