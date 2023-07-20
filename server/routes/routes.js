const { Router } = require("express");
const controller = require("../controllers/controllers");
const firCon = Router();
const secCon = Router();

//! before authentication
firCon.get("/", controller.isAuth)
firCon.post("/login", controller.backUser);
firCon.post("/signUp", controller.addUser);

//! after authentication
secCon.get("/", controller.checkPerm);
module.exports = { firCon, secCon };
