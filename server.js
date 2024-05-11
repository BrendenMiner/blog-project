const express = require("express");
require("dotenv").config();
const Mongostore = require("connect-mongo");
const methodOverride = require("method-override");
const session = require("express-session");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentsRoutes = require("./routes/comments/comments");
const globalErrHandler = require("./middlewares/globalHandler");
const { truncatePost } = require("./utils/helpers");
const Post = require("./model/post/Post");
const PORT = 9000;

const app = express();

//ejs
app.set("view engine", "ejs");
app.use(express.static(__dirname, +"/public"));

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new Mongostore({
      mongoUrl: process.env.mongoURL,
      ttl: 24 * 60 * 60,
    }),
  })
);

//save the login user into local
app.use((req, res, next) => {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});

app.locals.truncatePost = truncatePost;

//home
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    res.render("index", { posts });
  } catch (error) {
    res.render("index", { error: error.message });
  }
});
//login
app.get("/login", (req, res) => {
  res.render("login");
});
//profile
app.get("/profile-page", (req, res) => {
  res.render(req.session.userAuth);
});

//middlewares

//!users routes
app.use("/api/v1/users", userRoutes);

//!posts route
app.use("/api/v1/posts", postRoutes);

//!comments route
app.use("/api/v1/comments", commentsRoutes);

app.use(globalErrHandler);

//error handler middlewares
require("./config/dbConnect");
app.listen(PORT, console.log("The server is running"));
