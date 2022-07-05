const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;").then((topics) => {
        const topicsData = topics.rows;
        if (!topicsData) {
            return [];
        }
        return topicsData;
    });
};

exports.fetchArticleById = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id]).then((article) => {
        const articleData = article.rows[0]
        if (!articleData) {
            return Promise.reject({ status: 404, msg: "Not Found"});
        }
        return articleData;
    });
};