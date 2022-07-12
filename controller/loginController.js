const { People } = require("../model/people");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// login page - get controller
function getLogin(req, res, next) {
  res.render("index");
}

async function lognChecker(req, res, next) {
  try {
    const user = await People.findOne({
      $or: [{ mobile: req.body.username }, { email: req.body.username }],
    });

    if (user) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        const userObject = {
          userid: user._id,
          username: user.name,
          email: user.email,
          avatar: user.avatar || null,
          role: user.role || "user",
        };

        // generate token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        // st the cookie to store information
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRE,
          httpOnly: true,
          signed: true,
        });

        // set logged in users local identifier
        res.locals.loggedInUser = userObject;

        res.redirect("/inbox");
      } else {
        throw createError("Login Failed! Please try again");
      }
    } else {
      throw createError("Login Failed! Please try again");
    }
  } catch (error) {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
}

function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("logging out");
}
module.exports = {
  getLogin,
  lognChecker,
  logout,
};
