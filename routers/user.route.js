/* external imports */
const express = require("express");

/* internal imports */

const {
  checkLogin,
  RoleBaseAuthorize,
} = require("../middleware/common/CheckLogin");

const {
  getUsers,
  addUsers,
  removeuser,
} = require("../controller/userController");
const {
  decorateHtmlResponse,
} = require("../middleware/common/decorateHtmlResponse");

const {
  adduservalidator,
  userValidatorHandler,
} = require("../middleware/user/userValidation");
const { avatarUpload } = require("../middleware/user/avatarUpload");
const { GetProfileAvatar } = require("../middleware/user/FetchAvatar");
/* router object */
const router = express.Router();

//login page
router.get(
  "/",
  decorateHtmlResponse("user"),
  checkLogin,
  RoleBaseAuthorize(["admin", "user"]),
  GetProfileAvatar,
  getUsers
);

router.post(
  "/",
  checkLogin,
  RoleBaseAuthorize(["admin"]),
  avatarUpload,
  adduservalidator,
  userValidatorHandler,
  addUsers
);

router.delete("/:id", removeuser);
module.exports = {
  router,
};
