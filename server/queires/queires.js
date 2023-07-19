const AddUser = "INSERT INTO users_chory (email, password) VALUES ($1, $2)"
const getUser = "SELECT * FROM users_chory WHERE email = $1"
module.exports = {
    AddUser,
    getUser,
}