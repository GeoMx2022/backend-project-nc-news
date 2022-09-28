const express = require("express");
const cors = require("cors");
const app = express();
const apiRouter = require('./routes/api-router')
const { handleInvalidPaths, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./app.errors") 

// SERVER MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

// ERROR HANDLING MIDDLEWARE
app.use("*", handleInvalidPaths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app; 