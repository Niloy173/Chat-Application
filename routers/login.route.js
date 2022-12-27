/* external imports */
const express = require("express");

/* internal imports */
const {
  doLoginValidator,
  doLoginValidatorHandler,
} = require("../middleware/login/loginValidator");

const {
  getLogin,
  lognChecker,
  logout,
} = require("../controller/loginController");

const { redirectLoggedIn } = require("../middleware/common/CheckLogin");
const { GetProfileAvatar } = require("../middleware/user/FetchAvatar");
const {
  decorateHtmlResponse,
} = require("../middleware/common/decorateHtmlResponse");
/* router object */
const router = express.Router();

//login page
router.get(
  "/",
  decorateHtmlResponse("login"),
  redirectLoggedIn,
  GetProfileAvatar,
  getLogin
);

router.post(
  "/",
  decorateHtmlResponse("login"),
  doLoginValidator,
  doLoginValidatorHandler,
  lognChecker
);

router.delete("/", logout);

module.exports = {
  router,
};
