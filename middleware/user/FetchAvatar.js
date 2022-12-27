const { People } = require("../../model/people");
const mongoose = require("mongoose");

const GetProfileAvatar = async function (req, res, next) {
  try {
    if (req.user) {
      const { userid } = req.user;
      const response = await People.findOne({
        _id: mongoose.Types.ObjectId(userid),
      });
      const { avatar } = response;
      res.locals.profileAvatar = avatar;
      // console.log(res.locals.loggedInUser);
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  GetProfileAvatar,
};
