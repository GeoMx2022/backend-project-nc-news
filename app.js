const express = require("express");
const app = express();
const { getTopics, getArticleById } = require("./controllers/news.controllers");
const { handleInvalidPaths, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./app.errors") 

// SERVER MIDDLEWARE
app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById)

// ERROR HANDLING MIDDLEWARE
app.use("*", handleInvalidPaths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app; 