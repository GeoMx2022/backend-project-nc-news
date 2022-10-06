const db = require("../db/connection");
const fs = require("fs/promises");
const { checkExists } = require("../db/helpers/utils");

exports.fetchApi = async () => {
  const apiData = await fs.readFile(`${__dirname}/../endpoints.json`, "utf-8");
  const parsedApiData = JSON.parse(apiData);
  return parsedApiData;
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
  const validSortOptions = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrderOptions = ["asc", "desc"];
  const validTopicOptions = [
    "mitch",
    "cats",
    "paper",
    "coding",
    "football",
    "cooking",
  ];

  if (
    !validSortOptions.includes(sort_by) ||
    !validOrderOptions.includes(order)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  if (!topic) {
    return db
      .query(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`
      )
      .then((articles) => {
        const articlesData = articles.rows;
        return articlesData;
      });
  } else {
    if (!validTopicOptions.includes(topic)) {
      return Promise.reject({ status: 400, msg: "Topic does not exist" });
    } else {
      return db
        .query(
          `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE topic = '${topic}' GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`
        )
        .then((articles) => {
          const articlesData = articles.rows;
          return articlesData;
        });
    }
  }
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles INNER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
    )
    .then((article) => {
      const articleData = article.rows[0];
      if (!articleData) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return articleData;
      }
    });
};

exports.modifyArticleById = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then((article) => {
      const updatedArticleData = article.rows[0];
      if (!updatedArticleData) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return updatedArticleData;
    });
};

exports.fetchCommentsByArticleId = async (article_id) => {
  const comments = await db.query(
    "SELECT comments.comment_id, comments.body, comments.votes, comments.author, comments.created_at FROM comments WHERE comments.article_id = $1;",
    [article_id]
  );
  if (comments.rows.length === 0) {
    await checkExists("articles", "article_id", article_id);
    return [];
  } else {
    return comments.rows;
  }
};

exports.createComment = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [body, username, article_id]
    )
    .then((comment) => {
      const newComment = comment.rows[0];
      if (!newComment) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return newComment;
    });
};

exports.createArticle = async (username, title, body, topic) => {
  const validUsernameOptions = db
    .query("SELECT username FROM users")
    .then((result) => result.rows);
  const validTopicOptions = db
    .query("SELECT slug FROM topics")
    .then((result) => result.rows);

  const [returnValidUsernameOptions, returnValidTopicOptions] =
    await Promise.all([validUsernameOptions, validTopicOptions]);

  const validDbUsernames = returnValidUsernameOptions.map(
    (element) => element.username
  );
  const validDbTopics = returnValidTopicOptions.map((element) => element.slug);

  if (username != null && !validDbUsernames.includes(username)) {
    return Promise.reject({ status: 400, msg: "Invalid username" });
  } else if (topic != null && !validDbTopics.includes(topic)) {
    return Promise.reject({ status: 400, msg: "Invalid topic" });
  } else {
    return db
      .query(
        "INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *;",
        [username, title, body, topic]
      )
      .then((article) => {
        const newArticle = article.rows[0];
        const fullNewArticle = {
          ...newArticle,
          votes: 0,
          comment_count: 0,
          created_at: Date.now(),
        };
        if (!newArticle) {
          return Promise.reject({ status: 404, msg: "Not Found" });
        }
        return fullNewArticle;
      });
  }
};

exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then((deletedComment) => {
      const removedComment = deletedComment.rows[0];
      if (!removedComment) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return removedComment;
      }
    });
};
