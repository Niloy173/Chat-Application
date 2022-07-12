/* external imports */
const express = require("express");

/* internal imports */
const { checkLogin } = require("../middleware/common/CheckLogin");
const { attachmentUpload } = require("../middleware/inbox/attachmentUpload");
const {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
  DeleteConversation,
} = require("../controller/inboxController");
const {
  decorateHtmlResponse,
} = require("../middleware/common/decorateHtmlResponse");
/* router object */
const router = express.Router();

//login page
router.get("/", decorateHtmlResponse("inbox"), checkLogin, getInbox);

router.post("/search", checkLogin, searchUser);

router.post("/conversation", checkLogin, addConversation);

router.get("/messages/:conversation_id", checkLogin, getMessages);

router.post("/message", checkLogin, attachmentUpload, sendMessage);

router.post("/delete/:conversation_id", checkLogin, DeleteConversation);

module.exports = {
  router,
};
