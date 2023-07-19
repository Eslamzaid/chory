const AddUser =
  "INSERT INTO users_chory (name, email, password) VALUES ($1, $2)";
const getUser = "SELECT * FROM users_chory WHERE email = $1";
const getUserLogin = "SELECT * FROM users_chory WHERE email = $1 AND password = $2";
const userId = "SELECT user_id FROM users_chory WHERE email = $1";

module.exports = {
  AddUser,
  getUser,
  userId,
  getUserLogin,
};
