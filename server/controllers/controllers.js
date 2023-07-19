const quires = require("../queires/queires");
const validator = require("validator");
const pool = require("../database");

const isAuth = (req, res, next) => {
  console.log(req.session.user_id);
  if (!req.session.user_id) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(401).json({
      success: false,
    });
  }
};

const backUser = (req, res, next) => {
  res.json({
    hi: "Hello from express",
    id: `${req.session.user_id}`,
  });
};

const addUser = (req, res) => {
  const { email, password } = req.body;
  if (
    email == null ||
    password == null ||
    email.length == 0 ||
    password.length == 0
  ) {
    res.status(400).json({ message: "Email or password incorrect" });
    return;
  }
  const check = pool.query(quires.getUser, [email], async (err, result) => {
    if (err) throw err;
    if (await validator.isEmail(email)) {
      if (result.rows != 0) {
        res.status(409).json({ message: "Email address already exists" });
        return;
      }
      if (await validator.isLength(password, { min: 8, max: undefined })) {
        pool.query(quires.AddUser, [email, password], (err, resulting) => {
          if (err) throw err;
          pool.query(quires.userId, [email], (err, fin) => {
            if (err) throw err;
            req.session.user_id = fin.rows[0].user_id;
            req.session.save(function (err) {
              if (err) return next(err);
              res.status(200).json({});
            });
            return;
          });
        });
      }
    } else {
      res.status(400).json({ message: "incorrect email" });
      return;
    }
  });
};

module.exports = {
  isAuth,
  backUser,
  addUser,
};
