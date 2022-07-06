\c nc_news_test

SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles INNER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = 1 GROUP BY articles.article_id; 