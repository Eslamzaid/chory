const quires = require("../queires/queires");
const validator = require("validator");
const pool = require("../database");

//! Before

const isAuth = (req, res, next) => {
  console.log(req.session.user_id);
  if (req.session.user_id) {
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
        res.status(404).json({ message: "Something is wrong", success: false });
        return;
      }
      pool.query(quires.userId, [email], (err, fin) => {
        if (err) throw err;
        console.log(fin.rows);
        res
          .status(200)
          .json({ message: "user created successfully", success: true });
        return;
      });
    });
  } else {
    res
      .status(400)
      .json({ message: "Something went wrong please check your inputs" });
  }
};

const addUser = (req, res) => {
  const { email, password, name, username, phone, bio } = req.body;
  if (
    email == null ||
    password == null ||
    name == null ||
    username == null ||
    phone == null ||
    bio == null ||
    email.length === 0 ||
    password.length === 0 ||
    name.length === 0 ||
    username.length === 0 ||
    phone.length === 0 ||
    bio.length === 0
  ) {
    res.status(400).json({ message: "Email or password incorrect" });
    return;
  }

  pool.query(quires.getUser, [email], async (err, first) => {
    if (!err) {
      if (first.rowCount == 0) {
        if (
          (await validator.isEmail(email)) &&
          (await validator.isNumeric(phone)) &&
          (await validator.isLength(password, { min: 8, max: undefined })) &&
          (await validator.isLength(name, { min: 2, max: 20 })) &&
          (await validator.isLength(username, { min: 4, max: 20 })) &&
          (await validator.isLength(phone, { min: 4, max: 12 })) &&
          (await validator.isLength(bio, { min: 15, max: 200 }))
        ) {
          pool.query(
            quires.AddUser,
            [email, password, username, name, phone, bio],
            (err, result) => {
              if (err) throw err;
              pool.query(quires.userId, [email], (err, final) => {
                if (err) throw err;
                req.session.user_id = final.rows[0].user_id;
                res.status(201).json({
                  message: "User created successfully!",
                  success: true,
                });
                return;
              });
            }
          );
        } else {
          res.status(400).json({
            message: "Something went wrong, Please check your inputs",
            success: false,
          });
          return;
        }
      } else {
        res
          .status(409)
          .json({ message: "Email already exits, try log in", success: false });
        return;
      }
    }
    if (err) throw err;
  });

  // const check = pool.query(quires.getUser, [email], async (err, result) => {
  //   if (err) throw err;
  //   if (await validator.isEmail(email)) {
  //     if (result.rows != 0) {
  //       res.status(409).json({ message: "Email address already exists" });
  //       return;
  //     }
  //     if (await validator.isLength(password, { min: 8, max: undefined })) {
  //       pool.query(quires.AddUser, [email, password], (err, resulting) => {
  //         if (err) throw err;
  //         pool.query(quires.userId, [email], (err, fin) => {
  //           if (err) throw err;
  //           req.session.user_id = fin.rows[0].user_id;
  //           req.session.save(function (err) {
  //             if (err) return next(err);
  //             res.status(200).json({});
  //           });
  //           return;
  //         });
  //       });
  //     }
  //   } else {
  //     res.status(400).json({ message: "incorrect email" });
  //     return;
  //   }
  // });
};

//! After
const checkPerm = (req, res) => {};

module.exports = {
  isAuth,
  backUser,
  addUser,
  checkPerm,
};
