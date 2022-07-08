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
    return db.query("SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles INNER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;", [article_id]).then((article) => {
        const articleData = article.rows
        if (articleData.length === 0 || articleData === 'undefined') {
            return Promise.reject({ status: 404, msg: "Not Found"})
        } else {
            return articleData[0];
        }
    });
};

exports.fetchCommentsByArticleId = async (article_id) => {
        const comments = await db.query("SELECT comments.comment_id, comments.body, comments.votes, comments.author, comments.created_at FROM comments WHERE comments.article_id = $1;", [article_id]);
    
        const article = await db.query("SELECT * FROM articles WHERE articles.article_id = $1;", [article_id])

        if (article.rows.length > 0 && comments.rows.length === 0) {
            return [];
        } else if (article.rows.length === 0 || comments.rows === 'undefined') {
            return Promise.reject({ status: 404, msg: "Not Found"});
        } else {
            return comments.rows
        }
};

exports.modifyArticleById = (article_id, inc_votes) => {
    return db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;", [inc_votes, article_id]).then((article) => {
        const updatedArticleData = article.rows;
        if (updatedArticleData.length === 0 || updatedArticleData === 'undefined') {
            return Promise.reject({ status: 404, msg: "Not Found"});
        }
        return updatedArticleData[0];
    });
};

exports.createComment = (article_id, username, body) => {
    return db.query("INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;", [body, username, article_id]).then((comment) => {
        const newComment = comment.rows; 
        if (newComment.length === 0 || newComment === 'undefined') {
            return Promise.reject({ status: 404, msg: "Not Found"});
        }
        console.log(newComment) 
        return newComment[0];
    });
};