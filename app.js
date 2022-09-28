const express = require("express");
const cors = require("cors");
const app = express();
const { getApi, getTopics, getArticleById, updateArticleById, getUsers, getArticles, getCommentsByArticleId, postComment, deleteComment } = require("./controllers/news.controllers");
const { handleInvalidPaths, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./app.errors") 

// SERVER MIDDLEWARE
app.use(cors());
app.use(express.json());
app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", updateArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);

// ERROR HANDLING MIDDLEWARE
app.use("*", handleInvalidPaths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app; 