const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
    attachment: [
      {
        data: Buffer,
        contentType: String,
      },
    ],
    sender: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: {
        data: Buffer,
        contentType: String,
      },
    },
    receiver: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: {
        data: Buffer,
        contentType: String,
      },
    },
    date_time: {
      type: Date,
      default: Date.now,
    },
    conversation_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = {
  Message,
};
