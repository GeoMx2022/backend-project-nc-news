const express = require("express");
const app = express();
const { getTopics } = require("./controllers/news.controllers")

// SERVER MIDDLEWARE
app.use(express.json());

// ERROR HANDLING MIDDLEWARE