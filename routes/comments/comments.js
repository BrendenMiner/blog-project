const express = require("express");
const protected = require("../../middlewares/protected");
const commentsRoutes = express.Router();
const {
  commentCreatedCtrl,
  postCommentCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../../controllers/comments/commentsCtrl");

//*POST/api/v1/comments/:id
commentsRoutes.post("/:id", protected, commentCreatedCtrl);

//*GET/api/v1/comments/:id
commentsRoutes.get("/:id", protected, postCommentCtrl);

//*DELETE/api/v1/comments/:id
commentsRoutes.delete("/:id", protected, deleteCommentCtrl);

//*PUT/api/v1/comments/:id
commentsRoutes.put("/:id", protected, updateCommentCtrl);

module.exports = commentsRoutes;
