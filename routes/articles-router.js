const articlesRouter = require("express").Router();
const {
  getArticles,
  postArticle,
  getArticleById,
  updateArticleById,
  getCommentsByArticleId,
  postComment,
} = require("../controllers/news.controllers");

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
