const Campground=require("./models/campground");
const Review = require("./models/review");
const { campgroundSchema } = require('./schemas');
const { reviewSchema } = require('./schemas');
const ExpressError=require("./utilities/ExpressError")
module.exports.isLoggedIn=(req,res,next) =>{
    if(!req.isAuthenticated())
    {req.session.returnTo=req.originalUrl
    req.flash("error","You must be Signed In First!")
    return res.redirect("/login")
    }
    next();
}
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        console.log(msg);
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}
module.exports.isAuthor=async(req,res,next) =>
{const {id}=req.params
const campground = await Campground.findById(id)
if (!campground.author._id.equals(req.user._id)) {
    req.flash("error", "You Do not have Permission")
   return res.redirect(`/campgrounds/${id}`)
}

next()
}
module.exports.isReview=async(req,res,next) =>
{const {reviewId,id}=req.params
const review = await Review.findById(reviewId)
if (!review.author._id.equals(req.user._id)) {
    req.flash("error", "You Do not have Permission")
   return res.redirect(`/campgrounds/${id}`)
}
next()
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        console.log(msg);
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}