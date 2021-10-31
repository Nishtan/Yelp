const express = require('express');
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground');
const reviews=require("../controllers/reviews")
const Review = require("../models/review")
const {validateReview,isLoggedIn, isReview}=require("../middleware")

router.post("/",isLoggedIn,validateReview,catchAsync(reviews.addCampground))

router.delete("/:reviewId",isLoggedIn,isReview,catchAsync(reviews.deletecampground))

module.exports = router