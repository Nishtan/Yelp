const express = require('express');
const router = express.Router()
const catchAsync = require("../utilities/catchAsync")
const users = require("../controllers/users")
const passport = require('passport');
const review = require('../models/review');
router.route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.Register))

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login)

router.get("/logout", users.logout)

module.exports = router;