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
const sendData = async (req, res) => {
  let obj = [];
  let pro1;
  let pro2;

  const id = await req.session.user_id;
  try {
    const getRec = await pool.query(quires.getReceiverId, [id]);
    const getSen = await pool.query(quires.getSenderId, [id]);
    if (getRec.rowCount == 0 && getSen.rowCount == 0) {
      res.json({
        message: "Your list is empty!",
        success: false,
      });
    } else if (getRec.rowCount !== 0 && getSen.rowCount !== 0) {
      const addReceiver = getRec.rows.map(async (ele) => {
        const fin = await pool.query(quires.getAllById, [ele.sender_id]);
        const bioo = await pool.query(quires.getUserData, [ele.sender_id]);
        return obj.push({
          message: "You received this!",
          success: true,
          type: "receiver",
          email: fin.rows[0].email,
          name: fin.rows[0].name,
          bio: bioo.rows[0].bio,
        });
      });

      const getIt = getSen.rows.map(async (ele) => {
        const fin = await pool.query(quires.getAllById, [ele.receiver_id]);
        return obj.push({
          message: "You sended this",
          success: true,
          type: "sender",
          email: fin.rows[0].email,
          name: fin.rows[0].name,
        });
      });
      pro1 = await Promise.all(getIt);
      pro2 = await Promise.all(addReceiver);
      res.json(obj);
    } else if (getRec.rowCount == 0 && getSen.rowCount !== 0) {
      const getIt = getSen.rows.map(async (ele) => {
        const fin = await pool.query(quires.getAllById, [ele.receiver_id]);
        // const bioo = await pool.query(quires.getUserData, [ele.receiver_id]);
        return {
          message: "You sended this",
          success: true,
          type: "sender",
          email: fin.rows[0].email,
          name: fin.rows[0].name,
          // bio: bioo.rows[0].bio,
        };
      });
      obj = await Promise.all(getIt);
      res.json(obj);
    } else if (getRec.rowCount !== 0 && getSen.rowCount == 0) {
      const addReceiver = getRec.rows.map(async (ele) => {
        const fin = await pool.query(quires.getAllById, [ele.sender_id]);
        const bioo = await pool.query(quires.getUserData, [ele.sender_id]);
        return {
          message: "You received this!",
          success: true,
          type: "receiver",
          email: fin.rows[0].email,
          name: fin.rows[0].name,
          bio: bioo.rows[0].bio,
        };
      });
      obj = await Promise.all(addReceiver);

      res.json(obj);
    }
  } catch (error) {
    throw error;
  }
};

const searchUser = async (req, res) => {
  const email = req.body.email;
  if (await validator.isEmail(email)) {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      res.json({ message: "Please enter a proper email.", success: false });
      return;
    }
    pool.query(quires.getUser, [email], async (err, result) => {
      if (!err) {
        pool.query(quires.searchUser, [email], async (err, result) => {
          if (!err) {
            if (result.rowCount == 0) {
              res
                .status(404)
                .json({ message: "User not found", success: false });
              return;
            }
            if ((await result.rows[0].user_id) == (await req.session.user_id)) {
              res.json({
                message: "You can't search for your self",
                success: false,
              });
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
      }
    });
  } else {
    res.json({ message: "Please type a proper email", success: false });
  }
};

const requestUser = async (req, res) => {
  const { email } = req.body;
  const id = await req.session.user_id;
  try {
    if (await validator.isEmail(email)) {
      pool.query(quires.getIdByEmail, [email], async (err, result) => {
        if (err) throw err;
        const receiverId = await result.rows[0].user_id;
        // checking
        const check2 = await pool.query(quires.checkExistingWaitingFriendReq, [
          id,
          receiverId,
        ]);
        if (check2.rowCount > 0) {
          res.json({
            message: "You already have a friend request from this user",
            success: false,
          });
          return;
        }
        const check1 = await pool.query(quires.checkExistingFriendRequest, [
          id,
          receiverId,
        ]);
        if (check1.rowCount > 0) {
          res.json({
            message: "You can't send more than one request!",
            success: false,
          });
          return;
        }
        pool.query(
          quires.addFriendRequest,
          [id, receiverId, "sent"],
          (err, result) => {
            if (err) throw err;
            res.json({
              message: "Request send successfully! (waiting for response)",
              success: true,
            });
          }
        );
      });
    }
  } catch (error) {
    throw error;
  }
};

const deleteRequest = async (req, res) => {
  const { email } = req.params;
  const id = req.session.user_id;
  const userId = await pool.query(quires.getIdByEmail, [email]);
  pool.query(quires.deleteRequest, [userId.rows[0].user_id, id], (err) => {
    if (err) throw err;
    res.json({ message: "Deleted successfully" });
    return;
  });
};

module.exports = {
  isAuth,
  backUser,
  addUser,
  searchUser,
  requestUser,
  sendData,
  deleteRequest,
};
