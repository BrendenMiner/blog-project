const express = require("express");
const userRoutes = express.Router();
const multer = require("multer");
const storage = require("../../config/cloudinary");
const {
  registerCtrl,
  loginCtrl,
  userDetailCtrl,
  userProfileCtrl,
  updateProfileImgCtrl,
  updateCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
} = require("../../controllers/users/usercontroller");
const protected = require("../../middlewares/protected");

const upload = multer({
  storage,
});

//rendering forms
//login
userRoutes.get("/login", (req, res) => {
  res.render("users/login", {
    error: "",
  });
});
//register
userRoutes.get("/register", (req, res) => {
  res.render("users/register", {
    error: "",
  });
});

//upload profile img
userRoutes.get("/upload-profile-photo-form", (req, res) => {
  res.render("users/uploadProfilePhoto", {
    error: "",
  });
});
//upload cover img
userRoutes.get("/upload-cover-photo-form", (req, res) => {
  res.render("users/uploadCoverPhoto", {
    error: "",
  });
});
// update password
userRoutes.get("/update-password", (req, res) => {
  res.render("users/updatePassword", {
    error: "",
  });
});

//register
//*POST/api/v1/users/register
userRoutes.post("/register", registerCtrl);

//*POST/api/v1/users/login
userRoutes.post("/login", loginCtrl);

//*PUT/api/v1/users/profile-photo-upload/
userRoutes.put(
  "/profile-photo-upload/",
  protected,
  upload.single("profile"),
  updateProfileImgCtrl
);

//*GET/api/v1/users/profile
userRoutes.get("/profile-page", protected, userProfileCtrl);

//*PUT/api/v1/users/cover-photo-upload/
userRoutes.put(
  "/cover-photo-upload",
  protected,
  upload.single("cover"),
  updateCoverImgCtrl
);

//*PUT/api/v1/users/update-password
userRoutes.put("/update-password", updatePasswordCtrl);

//*PUT/api/v1/users/update
userRoutes.put("/update", updateUserCtrl);

//*GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);

//*GET/api/v1/users/:id
userRoutes.get("/:id", userDetailCtrl);

module.exports = userRoutes;
