const router = require("express").Router();
const controller = require("../controllers/controllers");
const firCon = router;
const secCon = router;

//! before authentication
firCon.get("/", controller.isAuth);
firCon.get("/login", controller.backUser);
firCon.post("/login", controller.backUser);
firCon.post("/singUp", controller.addUser);

//! after authentication
secCon.get("/", controller.checkPerm);
module.exports = { firCon, secCon };
