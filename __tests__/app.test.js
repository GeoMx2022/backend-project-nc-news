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
            votes: 100
            });
          });
    });
    test("Status: 404 for possibly valid article id but NOT FOUND in this database", () => {
      return request(app)
        .get("/api/articles/9999999")
        .expect(404)
        .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
        });
    });
    test("Status: 400 for route BAD REQUEST - Not a valid article id", () => {
        return request(app)
          .get("/api/articles/notAnId")
          .expect(400)
          .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request - Invalid Input");
          });
    });
  });    
});
