const express = require('express');
const router = express.Router()
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground');
const campgrounds = require("../controllers/campgrounds")
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware")
const multer  = require('multer')
const {storage}=require("../cloudinary")
const upload = multer({storage})
router.get("/new", isLoggedIn, campgrounds.renderNewForm)

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array("image"),validateCampground,catchAsync(campgrounds.createCampground))

router.get("/:id", catchAsync(campgrounds.showCampground))
.put("/:id", isLoggedIn,upload.array("image"),validateCampground, catchAsync(campgrounds.editCampground))
.delete("/:id", isLoggedIn, catchAsync(campgrounds.deleteCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))
module.exports = router