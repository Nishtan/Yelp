if(process.env.NODE_ENV!=="production")
 {require("dotenv").config()}

const express = require('express')
const app = express()
const path = require('path');
const mongoose = require('mongoose');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require("connect-flash")
const methodOverride = require('method-override');
const campgroundRoutes = require("./routes/campgrounds")
const reviewRoutes = require("./routes/reviews")
const usersRoutes=require("./routes/users")
const passport = require('passport');
const localStrategy = require("passport-local")
const User = require("./models/user");
const mongoSantize=require("express-mongo-sanitize")
const helmet=require("helmet")
const MongoStore = require('connect-mongo');
const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
//'mongodb://localhost:27017/yelp-camp'
console.log("hey");
console.log(dbUrl);
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Open!!");

    }).catch((er) => {
        console.log("erorr 404");

    });
app.engine("ejs", ejsMate)
app.use(mongoSantize())
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))
const secret=process.env.SECRET || "thisshouldbesecret"
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
store.on("error",function(e)
{console.log("SESSION ERROR",e);}
)
const sessionConfig = {
    store,
    name:"session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser=req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
}
)
app.use("/", usersRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)
app.get("/", (req, res) => { res.render("home") }
)
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
}
)
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) {
        err.message = "Something Went Wrong"
    }
    res.status(statusCode).render("error", { err })
}
)
const port=process.env.PORT || 3000
app.listen(port, () => { console.log(`listening on ${port}`); }
)