const commentsRouter = require("express").Router();
const { deleteComment, updateComment } = require("../controllers/news.controllers");

commentsRouter
.route("/:comment_id")
.patch(updateComment)
.delete(deleteComment);

module.exports = commentsRouter;
