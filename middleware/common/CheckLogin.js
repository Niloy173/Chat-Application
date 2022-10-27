const jwt = require("jsonwebtoken");
const path = require("path");

const checkLogin = function (req, res, next) {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    try {
      const token = cookies[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // for the json response

      if (res.locals.html) {
        res.locals.loggedInUser = decoded;
      }
      next();
    } catch (error) {
      if (res.locals.html) {
        res.redirect("/");
      } else {
        res.status(500).json({
          errors: {
            common: {
              msg: "Authentication failure",
            },
          },
        });
      }
    }
  } else {
    if (res.locals.html) {
      res.redirect("/");
    } else {
      res.status(500).json({
        error: "Authentication failure!",
      });
    }
  }
};

const redirectLoggedIn = function (req, res, next) {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    let token = cookies[process.env.COOKIE_NAME];
    if (token) {
      res.redirect("/inbox");
    } else {
      next();
    }
  } else {
    next();
  }
};

function RoleBaseAuthorize(role) {
  return function (req, res, next) {
    if (req.user.role && role.includes(req.user.role)) {
      next();
    }
    // else {
    //   res.sendFile(
    //     path.join(__dirname, "../../views/partials/ImportantMsg.html")
    //   );
    // }
  };
}

module.exports = {
  checkLogin,
  redirectLoggedIn,
  RoleBaseAuthorize,
};
