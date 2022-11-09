// external package
const createError = require("http-errors");
const bcrpyt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

// internal imports
const { People } = require("../model/people");
const { conversation } = require("../model/conversation");
const { Message } = require("../model/Message");

// login page - get controller
async function getUsers(req, res, next) {
  try {
    const users = await People.find();
    res.render("users", {
      users: users,
      role: req.user.role,
    });
  } catch (error) {
    throw createError(error.message);
  }
}

async function addUsers(req, res, next) {
  let newUser;

  const hashedPassoword = await bcrpyt.hash(req.body.password, 10);

  if (req.files && req.files.length > 0) {
    newUser = new People({
      ...req.body,
      avatar: req.files[0].filename,
      password: hashedPassoword,
    });
  } else {
    newUser = new People({
      ...req.body,
      password: hashedPassoword,
    });
  }

  try {
    const result = await newUser.save();
    res.status(200).json({
      message: "User was added successfuly",
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unkown error occured!",
        },
      },
    });
  }
}

async function removeuser(req, res, next) {
  try {
    const user = await People.findByIdAndDelete({
      _id: req.params.id,
    });

    if (user.avatar) {
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
        async (err) => {
          if (err) console.log(err);
          else {
            // delete the co-responding conversation
            const delete_conversation = await conversation.deleteMany({
              $or: [
                { "creator.id": req.params.id },
                { "participant.id": req.params.id },
              ],
            });

            // delete the co-responding messages
            const delete_messages = await Message.deleteMany({
              $or: [
                { "sender.id": req.params.id },
                { "receiver.id": req.params.id },
              ],
            });

            res.status(200).json({
              message: "User was deleted successfully",
            });
          }
        }
      );
    } else {
      // delete the co-responding conversation
      const delete_conversation = await conversation.deleteMany({
        $or: [
          { "creator.id": req.params.id },
          { "participant.id": req.params.id },
        ],
      });

      // delete the co-responding messages
      const delete_messages = await Message.deleteMany({
        $or: [{ "sender.id": req.params.id }, { "receiver.id": req.params.id }],
      });

      res.status(200).json({
        message: "User was deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user",
        },
      },
    });
  }
}

module.exports = {
  getUsers,
  addUsers,
  removeuser,
};
