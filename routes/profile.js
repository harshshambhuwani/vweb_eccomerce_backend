const express = require("express");
const {handleUpdateProfile} = require("../controllers/auth");
const multer = require("multer");
const profileRouter = express.Router();



profileRouter.route("/update-profile").post(handleUpdateProfile);


module.exports = profileRouter;



