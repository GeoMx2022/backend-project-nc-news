const express = require("express");
const app = express();
const { getTopics, getArticleById } = require("./controllers/news.controllers");

// SERVER MIDDLEWARE
app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById)

// ERROR HANDLING MIDDLEWARE
//Invalid Path
app.get("/*", (req, res) => {
  res.status(404).send({msg: "Not Found - Invalid Path"}) 
})

//Custom Error
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);    
}); 

//Psql Error
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ msg: 'Bad Request - Invalid Input' });
    } else next(err);
  });

//Server Error
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app; 