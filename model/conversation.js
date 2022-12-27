const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    creator: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: {
        data: Buffer,
        contentType: String,
      },
    },

    participant: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: {
        data: Buffer,
        contentType: String,
      },
    },

    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const conversation = mongoose.model("Conversation", conversationSchema);

module.exports = {
  conversation,
};
