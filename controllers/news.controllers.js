const { fetchTopics, fetchArticleById, modifyArticleById, fetchUsers, fetchArticles, fetchCommentsByArticleId } = require("../models/news.models");

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getUsers = (req, res, next) => {
    fetchUsers()
    .then((users) => {
        res.status(200).send({ users });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticles = (req, res, next) => {
    const { sort_by } = req.query;
    const { order } = req.query;
    fetchArticles(sort_by, order)
    .then((articles) => {
        res.status(200).send({ articles })
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

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;  
    fetchCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).send({ comments });
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

