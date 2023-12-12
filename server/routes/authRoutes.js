const express = require("express");
const router = express.Router();


const{ register, login, signup_get, login_get,logout} = require("../controllers/authController");

router.get("/signup", signup_get)
router.get("/login", login_get);
router.post("/signup", register);
router.post("/login", login);
router.delete("/logout",logout)

module.exports = router;
