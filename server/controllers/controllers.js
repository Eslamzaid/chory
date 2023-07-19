const isAuth = (req, res, next) => {
  if (!req.session.user_id) {
    res.status(401).json({
      success: false,
    });
  } else {
    res.status(200).json({
      success: true,
    });
  }
};

const backUser = (req, res, next) => {
  res.json({
    hi: "Hello from express",
  });
};

module.exports = {
  isAuth,
  backUser,
};
