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
    describe("GET /api/topics", () => {
        test("Status: 200 when a successful request is made", () => {
            return request(app)
            .get("/api/topics")
            .expect(200);
        });

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
              }))
            })
          })
        })
    });    
});

describe("NC News Errors", () => {
  test("Status: 404 for route NOT FOUND", () => {
    return request(app)
      .get("/api/topicz")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found - Invalid Path");
      });
  });
});