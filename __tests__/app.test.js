const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("NC News App", () => {
  describe("GENERAL ERROR HANDLING", () => {
    test("Status: 404 for route NOT FOUND", () => {
      return request(app)
        .get("/api/bad_path")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found - Invalid Path");
        });
    });
  });

  describe("GET /api", () => {
    test("Status: 200 and replies with an object listing all the available endpoints in the app", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              apiData: expect.any(Object),
            })
          );
        });
    });
  });

  describe("GET /api/topics", () => {
    test("Status: 200 and replies with a JSON object of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toHaveLength(3);
          body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("GET /api/users", () => {
    test("Status: 200 and replies with a JSON object of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("GET /api/articles", () => {
    test("Status: 200 and replies with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(12);
          body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("Status: 200 and replies with default sort order of created_at: descending", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            coerce: true,
            descending: true,
          });
        });
    });
    test("Status: 200 and replies with sort order of created_at: ascending", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            coerce: true,
            descending: false,
          });
        });
    });
    test("Status: 200 and replies with sort order of comment_count: descending", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count&&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("comment_count", {
            descending: true,
          });
        });
    });
    test("Status: 200 and replies with sort order of comment_count: ascending", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count&&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("comment_count", {
            descending: false,
          });
        });
    });
    test("Status: 200 and replies with sort order of article_id: descending", () => {
      return request(app)
        .get("/api/articles?sort_by=author&&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("author", {
            descending: true,
          });
        });
    });
    test("Status: 200 and replies with sort order of article_id: ascending", () => {
      return request(app)
        .get("/api/articles?sort_by=author&&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("author", { descending: false });
        });
    });
    test("Status: 200 and replies with sort order of votes: descending", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("votes", { descending: true });
        });
    });
    test("Status: 200 and replies with sort order of votes: ascending", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("votes", { descending: false });
        });
    });
    test("Status: 200 and replies with sort order of title: descending", () => {
      return request(app)
        .get("/api/articles?sort_by=title&&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("title", { descending: true });
        });
    });
    test("Status: 200 and replies with sort order of title: ascending", () => {
      return request(app)
        .get("/api/articles?sort_by=title&&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("title", {
            descending: false,
          });
        });
    });
    test("Status: 200 and replies with sort order of topic: descending", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("topic", { descending: true });
        });
    });
    test("Status: 200 and replies with sort order of topic: ascending", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("topic", {
            descending: false,
          });
        });
    });
    test("Status: 200 and replies with sort order of author: descending", () => {
      return request(app)
        .get("/api/articles?sort_by=author&&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("author", { descending: true });
        });
    });
    test("Status: 200 and replies with sort order of author: ascending", () => {
      return request(app)
        .get("/api/articles?sort_by=author&&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("author", {
            descending: false,
          });
        });
    });
    test("Status: 200 and replies with articles filtered by a specific topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].topic).toEqual("cats");
        });
    });
    test("Status: 200 and replies with an empty array when there are no articles for the specified valid topic", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual([]);
        });
    });
    test("Status: 400 - BAD REQUEST for invalid sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=commentz_countz")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid sort_by query");
        });
    });
    test("Status: 400 - BAD REQUEST for invalid order query", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count&&order=ascending")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid order query");
        });
    });
    test("Status: 400 - BAD REQUEST for invalid topic filter", () => {
      return request(app)
        .get("/api/articles?topic=dogs")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Topic does not exist");
        });
    });
  });

  describe("GET /api/articles/:article_id", () => {
    test("Status: 200 and replies with an article JSON object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: 11,
          });
        });
    });
    test("Status: 404 for possibly valid article id but NOT FOUND in this database", () => {
      return request(app)
        .get("/api/articles/99999999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
    test("Status: 400 for route BAD REQUEST - Not a valid article id", () => {
      return request(app)
        .get("/api/articles/notAnIdNo")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request - Invalid Input");
        });
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    test("Status: 200 and replies with an updated article JSON object - Votes decrement", () => {
      const articleUpdates = {
        inc_votes: -5,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(articleUpdates)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 95,
          });
        });
    });
    test("Status: 200 and replies with an updated article JSON object - Votes increment", () => {
      const articleUpdates = {
        inc_votes: 5,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(articleUpdates)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 105,
          });
        });
    });
    test("Status: 404 for possibly valid article id but NOT FOUND in this database", () => {
      const articleUpdates = {
        inc_votes: 5,
      };
      return request(app)
        .patch("/api/articles/99999999")
        .send(articleUpdates)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
    test("Status: 400 for route BAD REQUEST - Not a valid article id", () => {
      const articleUpdates = {
        inc_votes: 5,
      };
      return request(app)
        .patch("/api/articles/notAnIdNo")
        .send(articleUpdates)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request - Invalid Input");
        });
    });
    test("Status: 400 for route BAD REQUEST - Empty patch input on votes", () => {
      const articleUpdates = {};
      return request(app)
        .patch("/api/articles/1")
        .send(articleUpdates)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request - Invalid Input");
        });
    });
    test("Status: 400 for route BAD REQUEST - Invalid key on inc_votes", () => {
      const articleUpdates = {
        enc_botes: 5,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(articleUpdates)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request - Invalid Input");
        });
    });
    test("Status: 400 for route BAD REQUEST - Invalid values in inc_votes", () => {
      const articleUpdates = {
        inc_votes: "Hi",
      };
      return request(app)
        .patch("/api/articles/1")
        .send(articleUpdates)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request - Invalid Input");
        });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    test("Status: 200 and replies with an array of comments objects", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(2);
          body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                votes: expect.any(Number),
                author: expect.any(String),
                created_at: expect.any(String),
              })
            );
          });
        });
    });
    test("Status: 200 for valid article id but comment NOT FOUND in this database", () => {
      return request(app)
        .get("/api/articles/7/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("Status: 404 for possibly valid article id but NOT FOUND in this database", () => {
      return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("Status: 201 replies with newly created article comment", () => {
      const comment = {
        username: "butter_bridge",
        body: "Let me accept the things I can't change, the courage to change those I can and the wisdom to know the difference",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(comment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: "Let me accept the things I can't change, the courage to change those I can and the wisdom to know the difference",
              author: "butter_bridge",
              article_id: 3,
              votes: 0,
              created_at: expect.any(String),
            })
          );
        });
    });
    test("Status: 400 for route BAD REQUEST - Empty post input", () => {
      const comment = {};
      return request(app)
        .post("/api/articles/3/comments")
        .send(comment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request - Invalid Input");
        });
    });
    test("Status: 400 for route BAD REQUEST - Invalid key on username and body", () => {
      const comment = {
        usernamerz: "butter_bridge",
        bodyz:
          "Let me accept the things I can't change, the courage to change those I can and the wisdom to know the difference",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(comment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request - Invalid Input");
        });
    });
    test("Status: 400 for route BAD REQUEST - Username is a valid string but does not exist in the database", () => {
      const comment = {
        username: "philosphical-troll",
        body: "Let me accept the things I can't change, the courage to change those I can and the wisdom to know the difference",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(comment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request - Invalid Input");
        });
    });
    test("Status: 400 for route BAD REQUEST - Null values on username and body", () => {
      const comment = {
        usernamerz: null,
        bodyz: null,
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(comment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request - Invalid Input");
        });
    });
    test("Status: 400 for attempting to post a comment with an invalid article_id", () => {
      const comment = {
        username: "butter_bridge",
        body: "Let me accept the things I can't change, the courage to change those I can and the wisdom to know the difference",
      };
      return request(app)
        .post("/api/articles/99999/comments")
        .send(comment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request - Invalid Input");
        });
    });
    test("Status: 400 for route BAD REQUEST - Not a valid article id", () => {
      const comment = {
        username: "butter_bridge",
        body: "Let me accept the things I can't change, the courage to change those I can and the wisdom to know the difference",
      };
      return request(app)
        .post("/api/articles/notAnIdNo/comments")
        .send(comment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request - Invalid Input");
        });
    });
  });

  describe("DELETE /api/comments/:comment_id", () => {
    test("Status: 204", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("Status: 404 for possibly valid comment id but NOT FOUND in this database", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
    });
    test("Status: 400 for route BAD REQUEST - Not a valid comment id", () => {
    return request(app)
      .delete("/api/comments/notAnIdNo")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request - Invalid Input");
      });
    });  
  });
});
