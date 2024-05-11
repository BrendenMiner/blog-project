const bcrypt = require("bcryptjs");
const User = require("../../model/user/User");
const appErr = require("../../utils/appError");

const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.render("users/register", {
      error: "All fields are required",
    });
  }
  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.render("users/register", {
        error: "User already exists",
      });
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    const user = await User.create({
      fullname,
      email,
      password: passwordHashed,
    });
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.json(error);
  }
};

const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      if (userFound) {
        return res.render("users/login", {
          error: "Invalid login credentials",
        });
      }
    }
    req.session.userAuth = userFound._id;
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.json(error);
  }
};

const userDetailCtrl = async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await User.findById(userID);
    res.render("users/updateUser", {
      user,
      error: "",
    });
  } catch (error) {
    return res.render("users/updateUser", {
      error: error.message,
    });
  }
};

const userProfileCtrl = async (req, res) => {
  try {
    const userID = req.session.userAuth;
    const user = await User.findById(userID)
      .populate("posts")
      .populate("comments");
    res.render("users/profile", { user });
  } catch (error) {
    res.json(error);
  }
};

const updateProfileImgCtrl = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "Please upload image",
      });
    }
    const userID = req.session.userAuth;
    const userFound = await User.findById(userID);
    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
    }
    await User.findByIdAndUpdate(
      userID,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    );
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

const updateCoverImgCtrl = async (req, res) => {
  try {
    if (!req.file) {
      return res.render("users/uploadCoverPhoto", {
        error: "Please upload image",
      });
    }
    const userID = req.session.userAuth;
    const userFound = await User.findById(userID);
    if (!userFound) {
      return res.render("users/uploadCoverPhoto", {
        error: "User not found",
      });
    }
    await User.findByIdAndUpdate(
      userID,
      {
        coverImage: req.file.path,
      },
      {
        new: true,
      }
    );
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/uploadCoverPhoto", {
      error: error.message,
    });
  }
};

const updatePasswordCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password, salt);
      await User.findByIdAndUpdate(
        req.session.userAuth,
        {
          password: passwordHashed,
        },
        {
          new: true,
        }
      );
      res.redirect("/api/v1/users/profile-page");
    }
  } catch (error) {
    return res.render("users/updatePassword", {
      error: error.message,
    });
  }
};

const updateUserCtrl = async (req, res, next) => {
  const { fullname, email } = req.body;
  try {
    if (!fullname || !email) {
      return res.render("users/updateUser", {
        error: "All fields required",
        user: "",
      });
    }
    // if (email) {
    //   const emailTaken = await User.findOne({ email });
    //   if (emailTaken) {
    //     return res.render("users/updateUser", {
    //       error: "Email is already in use",
    //       user: "",
    //     });
    //   }
    // }
    await User.findByIdAndUpdate(
      req.session.userAuth,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/updateUser", {
      error: error.message,
    });
  }
};

const logoutCtrl = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/api/v1/users/login");
  });
};

module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailCtrl,
  userProfileCtrl,
  updateProfileImgCtrl,
  updateCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
};
