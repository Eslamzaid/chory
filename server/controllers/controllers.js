const quires = require("../queires/queires");
const validator = require("validator");
const pool = require("../database");
const { v4: uuidv4 } = require("uuid");

//! Before

const isAuth = async (req, res, next) => {
  if (await req.session.user_id) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(401).json({
      success: false,
    });
  }
};

const backUser = async (req, res) => {
  const { email, password } = req.body;
  if (
    email == null ||
    password == null ||
    email.length === 0 ||
    password.length === 0
  ) {
    res.status(404).json({ message: "Something is missing" });
    return;
  } else if (
    (await validator.isEmail(email)) &&
    (await validator.isLength(password, { min: 8, max: undefined }))
  ) {
    pool.query(quires.getUserLogin, [email, password], (err, result) => {
      if (err) throw err;
      if (result.rowCount == 0) {
        res
          .status(404)
          .json({ message: "Email or password is incorrect", success: false });
        return;
      }
      pool.query(quires.userId, [email], async (err, fin) => {
        if (err) throw err;
        req.session.user_id = await fin.rows[0].user_id;
        res.status(200).json({
          message: "Welcome back!",
          success: true,
        });
        return;
      });
    });
  } else {
    res
      .status(400)
      .json({ message: "Something went wrong please check your inputs" });
  }
};

const addUser = async (req, res) => {
  const { email, password, name, username, phone, bio } = req.body;
  if (
    !email ||
    !password ||
    !name ||
    !username ||
    !phone ||
    !bio ||
    email.trim().length === 0 ||
    password.trim().length === 0 ||
    name.trim().length === 0 ||
    username.trim().length === 0 ||
    phone.trim().length === 0 ||
    bio.trim().length === 0
  ) {
    res.status(400).json({ message: "Please fill out all required fields" });
    return;
  }

  try {
    const first = await pool.query(quires.getUser, [email]);
    if (first.rowCount > 0) {
      res.status(409).json({
        message: "Email already exists, try logging in",
        success: false,
      });
      return;
    }

    if (
      (await validator.isEmail(email)) &&
      (await validator.isLength(password, {
        min: 8,
        max: undefined,
      })) &&
      (await validator.isLength(name, { min: 2, max: 20 })) &&
      (await validator.isLength(username, {
        min: 4,
        max: 20,
      })) &&
      (await validator.isLength(phone, { min: 4, max: 10 })) &&
      (await validator.isLength(bio, { min: 15, max: 200 }))
    ) {
      pool.query(quires.AddUser, [email, password, name], async (err, fin) => {
        if (err) throw err;
        const { rows } = await pool.query(quires.userId, [email]);
        req.session.user_id = await rows[0].user_id;
        pool.query(
          quires.addUserData,
          [await rows[0].user_id, username, phone, bio],
          (err, da) => {
            if (!err) {
              res.status(201).send({
                message: "User created successfully!",
                success: true,
                user_id: rows[0].user_id,
              });
              return;
            }
            throw err;
          }
        );
      });
    } else {
      res.status(400).json({
        message: "Something went wrong, please check your inputs",
        success: false,
      });
      return;
    }
  } catch (err) {
    console.error("Error during addUser:", err);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

//! After
const searchUser = async (req, res) => {
  const email = req.body.email;
  if (await validator.isEmail(email)) {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      res.json({ message: "Please enter a proper email.", success: false });
      return;
    }
    pool.query(quires.searchUser, [email], async (err, result) => {
      if (!err) {
        if (result.rowCount == 0) {
          res.status(404).json({ message: "User not found", success: false });
          return;
        }
        const id = await result.rows[0].user_id;
        pool.query(quires.getUserData, [await id], async (err, fin) => {
          if (err) throw err;
          const { phone, bio, color } = await fin.rows[0];
          result.rows[0]["phone"] = phone;
          result.rows[0]["bio"] = bio;
          result.rows[0]["color"] = color;
          res.json(result.rows);
          return;
        });
      } else throw err;
    });
  } else {
    res.json({ message: "Please type a proper email", success: false });
  }
};

const requestUser = async (req, res) => {
  const { email } = req.body;
  try {
    if (await validator.isEmail(email)) {
      pool.query(quires.userId, [email], async (err, result) => {
        if (!err) {
          const rowsId = await result.rows[0].user_id;
          pool.query(quires.existingRoom, [rowsId], (err, check) => {
            if (err) throw err;
            if (check.rowCount > 0) {
              res.json({
                message: "You already sended a request",
                success: false,
              });
              return;
            } else {
              pool.query(quires.addRoom, [rowsId, uuidv4()], (err, fin) => {
                if (err) throw err;
                res.json(fin);
                return;
              });
            }
          });
        } else {
          console.error(err);
        }
      });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  isAuth,
  backUser,
  addUser,
  searchUser,
  requestUser,
};
