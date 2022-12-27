const { People } = require("../model/people");
const { conversation } = require("../model/conversation");
const createError = require("http-errors");
const { escape } = require("../utilities/escape");
const { Message } = require("../model/Message");
const { default: mongoose } = require("mongoose");
const { readFileSync, unlink } = require("fs");
const path = require("path");

// login page - get controller
async function getInbox(req, res, next) {
  try {
    const conversation_data = await conversation.find({
      $or: [
        { "creator.id": req.user.userid },
        { "participant.id": req.user.userid },
      ],
    });

    res.locals.data = conversation_data;
    res.render("inbox");
  } catch (error) {
    next(error);
  }
}

async function searchUser(req, res, next) {
  const user = req.body.user;
  const searchQuery = user.replace("+88", "");

  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
  const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

  try {
    if (searchQuery != "") {
      const users = await People.find({
        $or: [
          {
            name: name_search_regex,
          },
          {
            mobile: mobile_search_regex,
          },
          {
            email: email_search_regex,
          },
        ],
      });

      res.json(users);
    } else {
      throw createError("You must provide some text to search!");
    }
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
}

// add conversation
async function addConversation(req, res, next) {
  try {
    const Owner = await People.findOne({
      _id: mongoose.Types.ObjectId(req.user.userid),
    });

    const Participant = await People.findOne({
      _id: mongoose.Types.ObjectId(req.body.id),
    });

    const conversation_data = await conversation.find({
      $or: [
        {
          $and: [
            { "creator.id": req.user.userid },
            { "participant.id": req.body.id },
          ],
        },

        {
          $and: [
            { "creator.id": req.body.id },
            { "participant.id": req.user.userid },
          ],
        },
      ],
    });

    if (conversation_data.length > 0) {
      res.status(500).json({
        errors: {
          common: {
            msg: "Already connected",
          },
        },
      });
    } else if (Owner.id === Participant.id) {
      res.status(500).json({
        errors: {
          common: {
            msg: "Try another user",
          },
        },
      });
    } else {
      const newConversation = new conversation({
        creator: {
          id: req.user.userid,
          name: req.user.username,
          avatar: Owner.avatar,
        },
        participant: {
          name: req.body.participant,
          id: req.body.id,
          avatar: Participant.avatar,
        },
      });

      const result = await newConversation.save();
      res.status(200).json({
        message: "Conversation was added successfully!",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

//get messages of a conversation
async function getMessages(req, res, next) {
  // console.log(req.params.conversation_id);
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const { participant } = await conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      info: {
        messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured",
        },
      },
    });
  }
}

function BinaryToImage(avatar) {
  let binary = "";
  let bytes = new Uint8Array(avatar.data);
  let len = bytes.length;

  for (let index = 0; index < bytes.length; index++) {
    binary += String.fromCharCode(bytes[index]);
  }

  return binary;
}

async function sendMessage(req, res, next) {
  // console.log(req.files);
  // console.log(req.body.message);
  const Owner = await People.findOne({
    _id: mongoose.Types.ObjectId(req.user.userid),
  });

  const Participant = await People.findOne({
    _id: mongoose.Types.ObjectId(req.body.receiverId),
  });

  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      // save message text/attachment in database
      let attachments = null;

      if (req.files && req.files.length > 0) {
        attachments = [];
        req.files.forEach((element) => {
          attachments.push({
            data: readFileSync(
              path.join(
                __dirname,
                "/../public/uploads/attachments/",
                element.filename
              )
            ),
            contentType: path.extname(element.filename).replace(".", ""),
          });
        });
      }

      // console.log(attachments);
      const newMessage = new Message({
        text: req.body.message,
        attachment: attachments,
        sender: {
          id: req.user.userid,
          name: req.user.username,
          avatar: Owner.avatar,
        },

        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: Participant.avatar,
        },

        conversation_id: req.body.conversationId,
      });

      const result = await newMessage.save();

      global.io.emit("new_message", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            id: req.user.userid,
            name: req.user.username,
            avatar: Owner.avatar,
          },

          message_: req.body.message,
          attachment: attachments,
          date_time: result.date_time,
        },
      });

      req.files.forEach(async (file) => {
        await unlink(
          path.join(
            __dirname,
            "/../public/uploads/attachments/",
            file.filename
          ),
          (err) => {
            if (err) console.log(err);
          }
        );
        // console.log("file deleted");
      });

      res.status(200).json({
        message: "Successful!",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        errors: {
          common: {
            msg: error.message,
          },
        },
      });
    }
  } else {
    res.status(500).json({
      errors: {
        common: "message txt or attachment is required",
      },
    });
  }
}

async function DeleteConversation(req, res, next) {
  const conversationid = req.params.conversation_id;

  try {
    const result = await Message.deleteMany({
      conversation_id: conversationid,
    });

    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
}
module.exports = {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
  DeleteConversation,
};
