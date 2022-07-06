const express = require("express");
const app = express();
const { getTopics, getArticleById, updateArticleById, getUsers, getArticles, getCommentsByArticleId, postComment } = require("./controllers/news.controllers");
const { handleInvalidPaths, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./app.errors") 

// SERVER MIDDLEWARE
app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.patch("/api/articles/:article_id", updateArticleById);
app.post("/api/articles/:article_id/comments", postComment);

// ERROR HANDLING MIDDLEWARE
app.use("*", handleInvalidPaths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app; 