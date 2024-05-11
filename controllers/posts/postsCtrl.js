const User = require("../../model/user/User");
const Post = require("../../model/post/Post");
const appErr = require("../../utils/appError");
const multer = require("multer");

const createPostCtrl = async (req, res, next) => {
  const { title, description, category, image, user } = req.body;
  try {
    if (!title || !description || !category) {
      return res.render("posts/addPost", {
        error: "All fields required",
      });
    }
    const userID = req.session.userAuth;
    const userFound = await User.findById(userID);
    const postCreated = await Post.create({
      title,
      description,
      category,
      user: userFound._id,
      // image: req.file.path,
    });
    userFound.posts.push(postCreated._id);

    await userFound.save();

    res.redirect("/");
  } catch (error) {
    return res.render("posts/addPost", {
      error: error.message,
    });
  }
};

const postsListCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("comments");
    res.json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

const postDetailCtrl = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id)
      .populate({
        path: "comments",
        populate: { path: "user" },
      })
      .populate("user");
    res.render("posts/postDetails", { post, error: "" });
  } catch (error) {
    return res.render("posts/postDetails", { error: error.message, post });
  }
};

const postDeletedCtrl = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.session.userAuth) {
      return res.render("posts/postDetails", {
        error: "You are not authorized to delete this post",
        post,
      });
    }
    const postDeleted = await Post.findByIdAndDelete(req.params.id);
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("posts/postDetails", { error: error.message, post });
  }
};

const updatePostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/updatePost", {
        error: "You are not authorized to update this post",
        post: "",
      });
    }

    if (req.file) {
      const postUpdated = await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
          image: req.file.path,
        },
        { new: true }
      );
    } else {
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
        },
        { new: true }
      );
    }

    res.redirect("/");
  } catch (error) {
    res.render("posts/updatePost", { error: error.message, post: "" });
  }
};

module.exports = {
  createPostCtrl,
  postsListCtrl,
  postDetailCtrl,
  postDeletedCtrl,
  updatePostCtrl,
};
