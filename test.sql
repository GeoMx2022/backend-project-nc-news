\c nc_news_test

SELECT comments.comment_id, comments.body, comments.votes, comments.author, comments.created_at FROM comments WHERE comments.article_id = 3;