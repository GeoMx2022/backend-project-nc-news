const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  updateArticleById,
  getCommentsByArticleId,
  postComment,
} = require("../controllers/news.controllers");

articlesRouter.get("/", getArticles);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
