const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;").then((topics) => {
        const topicsData = topics.rows;
        return topicsData;
    });
};

exports.fetchUsers = () => {
    return db.query("SELECT * FROM users;").then((users) => {
        const usersData = users.rows;
        return usersData;
    });
};

exports.fetchArticles = () => {
    return db.query("SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;").then((articles) => {
        const articlesData = articles.rows;
        return articlesData;
    });
};

exports.fetchArticleById = (article_id) => {
    return db.query("SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles INNER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;;", [article_id]).then((article) => {
        const articleData = article.rows[0]
        if (!articleData) {
            return Promise.reject({ status: 404, msg: "Not Found"});
        }
        return articleData;
    });
};

exports.modifyArticleById = (article_id, inc_votes) => {
    return db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;", [inc_votes, article_id]).then((article) => {
        const updatedArticleData = article.rows[0];
        if (!updatedArticleData) {
            return Promise.reject({ status: 404, msg: "Not Found"});
        }
        return updatedArticleData;
    });
};