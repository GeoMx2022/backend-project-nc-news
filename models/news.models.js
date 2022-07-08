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

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
    const validSortOptions = ["article_id", "title", "topic", "author", "created_at", "votes", "comment_count"];
    const validOrderOptions = ["asc", "desc"];
    const validTopicOptions = ["mitch", "cats", "paper", "coding", "football", "cooking"];

    if (!validSortOptions.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
      } else if (!validSortOptions.includes(sort_by) && !validOrderOptions.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid sort_by or order query" });
      } else if (!validOrderOptions.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order query" });
      }; 

    if (!topic) {
        return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`).then((articles) => {
            const articlesData = articles.rows;
            return articlesData;
        });    
    } else {
        if (!validTopicOptions.includes(topic)) {
            return Promise.reject({ status: 400, msg: "Topic does not exist" });
        } else {
            return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE topic = '${topic}' GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`).then((articles) => {
                const articlesData = articles.rows;
                return articlesData;
            });  
        };
    };  
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

exports.removeComment = (comment_id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [comment_id]).then((deletedComment) => {
        const removedComment = deletedComment.rows;
        if (removedComment.length === 0 || removedComment.length === 'undefined') {
            return Promise.reject({ status: 404, msg: "Not Found"})
        } else {
            return removedComment[0];
        }
    });
};

