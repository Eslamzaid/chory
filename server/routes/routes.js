const router = require("express").Router();
const controller = require("../controllers/controllers");
const firCon = router;


firCon.get("/", controller.isAuth);
firCon.get("/login", controller.backUser);
firCon.post("/login", controller.addUser)

module.exports = firCon;
