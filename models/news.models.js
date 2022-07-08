const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchApi = async () => {
    const apiData = await fs.readFile(`/home/geomx22/Documents/Northcoders/Backend/be-project/be-nc-news/endpoints.json`, "utf-8");
        console.log(apiData)
        return apiData;
};

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
    return db.query("SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles INNER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;", [article_id]).then((article) => {
        const articleData = article.rows
        if (!articleData) {
            return Promise.reject({ status: 404, msg: "Not Found"});
        } else if (articleData.length === 0) {
            return Promise.reject({ status: 404, msg: "Article id does not exist"})
        } else {
            return articleData[0];
        }
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query("SELECT comments.comment_id, comments.body, comments.votes, comments.author, comments.created_at FROM comments WHERE comments.article_id = $1;", [article_id]).then((comments) => {
        const commentData = comments.rows
        if (!commentData) {
            return Promise.reject({ status: 404, msg: "Not Found"});
        } else if (commentData.length === 0) {
            return Promise.reject({ status: 404, msg: "Not Found - Article id does not exist OR No comments for a valid article id"})
        } else {
            return commentData;
        }
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

exports.createComment = (article_id, username, body) => {
    return db.query("INSERT INTO comments (body, votes, author, article_id, created_at) VALUES ($1, 0, $2, $3, '2022-07-06 15:55:14') RETURNING *;", [body, username, article_id]).then((comment) => {
        const newComment = comment.rows;
        if (!newComment) {
            return Promise.reject({ status: 404, msg: "Not Foundx"});
        } 
        return newComment[0];
    });
};