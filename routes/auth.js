const express = require("express");
const {handleSignup,handleLogin,handleGetProfile} = require("../controllers/auth");
const customerRouter = express.Router();

customerRouter.route("/signup/").post(handleSignup)
customerRouter.route("/login/").post(handleLogin)
customerRouter.route("/get-profile").get(handleGetProfile)


module.exports = customerRouter;