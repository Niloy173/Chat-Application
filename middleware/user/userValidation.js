const createError = require("http-errors");
const { check, validationResult } = require("express-validator");
const { People } = require("../../model/people");
const { unlink } = require("fs");
const path = require("path");
// add user
const adduservalidator = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet")
    .trim(),

  check("email")
    .isEmail()
    .withMessage("Email is required")
    .trim()
    .custom(async (value) => {
      try {
        const user = await People.findOne({ email: value });

        if (user) {
          throw createError("Email is already in use!");
        }
      } catch (error) {
        throw createError(error.message);
      }
    }),

  check("mobile")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Mobile number must be a valid Bangladeshi mobile number")
    .custom(async (value) => {
      try {
        const user = await People.findOne({ mobile: value });

        if (user) {
          throw createError("Mobile already is use!");
        }
      } catch (error) {
        throw createError(error.message);
      }
    }),

  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 character contain at least 1 uppercase 1 lowercase 1 number & 1 symbol"
    ),
];
function userValidatorHandler(req, res, next) {
  const errors = validationResult(req);
  const mappederror = errors.mapped();

  if (Object.keys(mappederror).length === 0) {
    next();
  } else {
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      console.log(filename);
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${filename}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    // response the error
    res.status(500).json({
      errors: mappederror,
    });
  }
}

module.exports = {
  adduservalidator,
  userValidatorHandler,
};
