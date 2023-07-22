const { Router } = require("express");
const controller = require("../controllers/controllers");
const firCon = Router();
const secCon = Router();

//! before authentication
firCon.post("/login", controller.backUser);
firCon.post("/signUp", controller.addUser);

//! after authentication
secCon.post("/search", controller.searchUser);
secCon.post("/addUser", controller.requestUser)

module.exports = { firCon, secCon };
