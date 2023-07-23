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
  const id = await req.session.user_id;
  try {
    const result = await pool.query(quires.getSenderId, [id]);
    // nothing comes from result
    if (result.rowCount === 0) {
      const userResult = await pool.query(quires.getReceiverId, [id]);
      if (userResult.rowCount === 0) {
        console.log("Am i here?!");
        res.json({
          message: "Your list is empty",
          success: false,
          test: id,
        });
      } else if (id === (await userResult.rows[0].receiver_id)) {
        console.log("Let's figure it out! or???!");
        pool.query(
          quires.getAllById,
          [await userResult.rows[0].sender_id],
          async (err, fin) => {
            pool.query(
              quires.getUserData,
              [await userResult.rows[0].sender_id],
              async (err, done) => {
                if (err) throw err;
                res.json({
                  message: "Your are the receiver choose wisely",
                  success: true,
                  type: "receiver",
                  email: await fin.rows[0].email,
                  name: await fin.rows[0].name,
                  bio: await done.rows[0].bio,
                });
                return;
              }
            );
          }
        );
      } else {
        res.json({ message: "Your list is empty", success: false, test: id });
      }
    } else {
      const result2 = await pool.query(quires.checkExistingFriendRequest, [
        id,
        await result.rows[0].receiver_id,
      ]);
      console.log("Yes this is the sender");
      if (id === (await result2.rows[0].sender_id)) {
        pool.query(
          quires.getAllById,
          [result2.rows[0].receiver_id],
          async (err, fin) => {
            res.json({
              message: "Your are the sender",
              success: true,
              type: "sender",
              email: await fin.rows[0].email,
              name: await fin.rows[0].name,
            });
          }
        );
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
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
  try {
    if (await validator.isEmail(email)) {
      pool.query(
        quires.getUserById,
        [await req.session.user_id],
        async (err, user) => {
          if (!err) {
            if (user.rowCount == 0) {
              res.json({
                message: "You can't search for your self",
                success: false,
              });
              return;
            }
            const userEmail = await user.rows[0];
            pool.query(
              quires.proUserId,
              [email, await userEmail.email],
              async (err, result) => {
                if (!err) {
                  const rowsId = result.rows;
                  if (rowsId.length !== 2) {
                    res.json({
                      message: "Something went wrong",
                      success: false,
                    });
                    return;
                  }
                  pool.query(
                    quires.existingRoom,
                    [rowsId[0].user_id, rowsId[1].user_id],
                    (err, check) => {
                      if (err) throw err;
                      if (check.rowCount > 0) {
                        res.json({
                          message: "You already sended a request",
                          success: false,
                        });
                        return;
                      } else {
                        // pool.query(
                        //   quires.addRoom,
                        //   [rowsId[0].user_id, rowsId[1].user_id, uuidv4()],
                        //   (err, fin) => {
                        if (err) throw err;
                        pool.query(
                          quires.addFriendRequest,
                          [rowsId[0].user_id, rowsId[1].user_id, "sent"],
                          (err, finish) => {
                            if (err) throw err;
                            res.status(201).json({
                              message: "Request send successfully!",
                              success: true,
                            });
                            return;
                          }
                          //   );
                          // }
                        );
                      }
                    }
                  );
                } else {
                  console.error(err);
                }
              }
            );
          } else {
            throw err;
          }
        }
      );
    }
  } catch (error) {
    throw error;
  }
};

const deleteRequest = async (req, res) => {

}

module.exports = {
  isAuth,
  backUser,
  addUser,
  searchUser,
  requestUser,
  sendData,
  deleteRequest,
  
};
