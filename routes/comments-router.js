const commentsRouter = require("express").Router();
const { deleteComment } = require("../controllers/news.controllers");

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
