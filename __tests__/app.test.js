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
/*
  describe("GET /api", () => {
    test("Status: 200 and replies with an object listing all the available endpoints in the app", () => {
      return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(expect.objectContaining({
          "GET /api": {
            "description": "responds with up a json object of all the available endpoints of the api"
          },
          "GET /api/topics": {
            "description": "responds an array of all topics",
            "exampleResponse": {
              "topics": [{ "slug": "football", "description": "Footie!" }]
            }
          },
          "GET /api/users": {
            "description": "responds an array of all users",
            "exampleResponse": {
              "users": [
                {
                "username": "butter_bridge",
                "name": "jonny",
                "avatar_url": "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
                }
              ]
            }
          },
        }));
      });
    });
  });
*/
  describe("GET /api/topics", () => {
    test("Status: 200 and replies with a JSON object of topics", () => {
      return request(app) 
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toHaveLength(3);
          body.topics.forEach((topic) => {
          expect(topic).toEqual(expect.objectContaining({
            description: expect.any(String),
            slug: expect.any(String)
            }));
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
          expect(user).toEqual(expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
            }));
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
          expect(body.articles).toBeSortedBy("created_at", {descending: true});
          body.articles.forEach((article) => {
          expect(article).toEqual(expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number)
            }));
          });
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
            comment_count: 11
            });
          });
    });
    test("Status: 404 for possibly valid article id but NOT FOUND in this database", () => {
      return request(app)
        .get("/api/articles/99999999")
        .expect(404)
        .then(({ body: { msg } }) => {
        expect(msg).toBe("Article id does not exist");
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
    test("Status: 200 and replies with an updated article JSON object - Votes increment", () => {
      const articleUpdates = {
        inc_votes: 5
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
            votes: 105
            });
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
        enc_botes: 5
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
        inc_votes: "Hi"
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
          expect(comment).toEqual(expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String)
            }));
          });
      });
    });
    test("Status: 404 for valid article id but comment NOT FOUND in this database", () => {
      return request(app)
        .get("/api/articles/7/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found - Article id does not exist OR No comments for a valid article id");
        });
    });
    test("Status: 404 for possibly valid article id but NOT FOUND in this database", () => {
      return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found - Article id does not exist OR No comments for a valid article id");
        });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("Status: 201 replies with newly created article comment", () => {
      const comment = {
        username: "butter_bridge", 
        body: "Let me accept the things I can't change, the courage to change those I can and the wisdom to know the difference"
      };
      return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(expect.objectContaining({
          comment_id: expect.any(Number),
          body: "Let me accept the things I can't change, the courage to change those I can and the wisdom to know the difference", 
          author: "butter_bridge", 
          article_id: expect.any(Number), 
          votes: expect.any(Number),
          created_at: expect.any(String)   
        }));
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
        bodyz: "Let me accept the things I can't change, the courage to change those I can and the wisdom to know the difference"
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
        bodyz: null
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(comment)
        .expect(400)
        .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request - Invalid Input");
        });
    });
  });
});
