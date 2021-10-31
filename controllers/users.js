const Campground = require('../models/campground');
const Review = require("../models/review")
const User = require("../models/user");
const passport = require('passport');
module.exports.renderRegister=(req, res) => { res.render("users/register") }
module.exports.Register=async (req, res,next) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash("success", "Welcome To Yelp camp!")
            res.redirect("/campgrounds")
        }
        )
    }
    catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
}
module.exports.renderLogin=(req, res) => {
    res.render("users/login")
}
module.exports.login= (req, res) => {
    req.flash("success", "Welcome back!")
    const redirectUrl=req.session.returnTo 
  if(redirectUrl)
  {delete req.session.returnTo
    return res.redirect(redirectUrl)
}
    res.redirect("/campgrounds")
}
module.exports.logout=(req, res) => {
    req.logOut()
    req.flash("success", "Goodbye!")
    res.redirect("/campgrounds")
}