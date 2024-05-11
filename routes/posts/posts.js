const express = require("express");
const postRoutes = express.Router();
const multer = require("multer");
const Post = require("../../model/post/Post");
const {
  createPostCtrl,
  postsListCtrl,
  postDetailCtrl,
  postDeletedCtrl,
  updatePostCtrl,
} = require("../../controllers/posts/postsCtrl");
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");

const upload = multer({ storage });

//forms
postRoutes.get("/get-post-form", (req, res) => {
  const post = Post.findById(req.params.id);
  res.render("posts/addPost", { error: "" });
});

postRoutes.get("/get-form-update/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("posts/updatePost", { post, error: "" });
  } catch (error) {
    res.render("posts/updatePost", { error, post: "" });
  }
});

//*POST/api/v1/posts
postRoutes.post("/", protected, upload.single("file"), createPostCtrl);

//*GET/api/v1/posts
postRoutes.get("/", postsListCtrl);

//*GET/api/v1/posts/:id
postRoutes.get("/:id", postDetailCtrl);

//*DELETE/api/v1/posts/:id
postRoutes.delete("/:id", protected, postDeletedCtrl);

//*PUT/api/v1/posts/:id
postRoutes.put("/:id", protected, upload.single("file"), updatePostCtrl);

module.exports = postRoutes;
