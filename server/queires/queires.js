const AddUser =
  "INSERT INTO users_chory (email, password, user_name, name, phone, bio) VALUES ($1, $2, $3, $4, $5, $6)";
const getUser = "SELECT * FROM users_chory WHERE email = $1";
const getUserLogin =
  "SELECT * FROM users_chory WHERE email = $1 AND password = $2";
const userId = "SELECT user_id FROM users_chory WHERE email = $1";

module.exports = {
  AddUser,
  getUser,
  userId,
  getUserLogin,
};
