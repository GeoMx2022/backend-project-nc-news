const { fetchTopics, fetchArticleById, modifyArticleById } = require("../models/news.models");

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;  
    fetchArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch((err) => {
        next(err);
    });
};

exports.updateArticleById = (req, res, next) => {
    const { article_id } = req.params; 
    const { inc_votes } = req.body; 
    modifyArticleById(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch((err) => {
        next(err);
    });
};