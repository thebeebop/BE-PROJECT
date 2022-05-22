const db = require("../db/connection.js");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("/api", () => {
  describe("GET /api/topics", () => {
    test("200: Returns an array of topic objects with the following properties: slug, description.", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).toBeInstanceOf(Array);
          expect(res.body.topics.length).toBe(3);

          res.body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    test("404: Handles an error for a route that does not exist.", () => {
      return request(app)
        .get("/api/mango")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not Found");
        });
    });
  });

  describe("GET /api/articles/:article_id", () => {
    test("200: Returns the desired article when given an article_id ", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual(
            expect.objectContaining({
              article_id: 3,
              title: "Eight pug gifs that remind me of mitch",
              topic: "mitch",
              author: "icellusedkars",
              body: "some gifs",
              created_at: "2020-11-03T09:12:00.000Z",
              votes: 0,
            })
          );
        });
    });
    test('200: An article response object should now include the property "comment_count". ', () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          expect(response.body.article).toHaveProperty("comment_count");
        });
    });

    test("400: Given an invalid data-type, send the client a 400 bad request.", () => {
      return request(app)
        .get("/api/articles/silly")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Bad Request");
        });
    });
    test("404: Valid but non-existent ID", () => {
      return request(app)
        .get("/api/articles/999999")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Not Found");
        });
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    test("200: Should update the relevant property by the given value of the specified id.", () => {
      const updateVote = { inc_votes: 40 };

      return request(app)
        .patch("/api/articles/3")
        .expect(200)
        .send(updateVote)
        .then((response) => {
          expect(response.body.update).toEqual({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 40,
          });
        });
    });
    test("400: Given a malformed body, respond with a 400: bad request", () => {
      const badBody = {};
      return request(app)
        .patch("/api/articles/3")
        .expect(400)
        .send(badBody)
        .then((response) => {
          expect(response.body.msg).toEqual("Bad Request");
        });
    });
    test("400: Given an incorrect data type, respond with a 400: bad request ", () => {
      const wrongData = { inc_votes: "vote" };

      return request(app)
        .patch("/api/articles/3")
        .expect(400)
        .send(wrongData)
        .then((response) => {
          expect(response.body.msg).toEqual("Bad Request");
        });
    });
    test('400: Returns "Bad Request" when trying to patch an article by an invalid article_id.', () => {
      const updateVote = { inc_votes: 40 };

      return request(app)
        .patch("/api/articles/potato")
        .expect(400)
        .send(updateVote)
        .then((response) => {
          expect(response.body.msg).toEqual("Bad Request");
        });
    });
    test('404: Respond with a "not found" message when given an unkown article_id.', () => {
      const updateVote = { inc_votes: 70 };

      return request(app)
        .patch("/api/articles/5000")
        .send(updateVote)
        .then((response) => {
          expect(response.body.msg).toEqual("Not Found");
        });
    });
  });

  describe("GET /api/users", () => {
    test('200: Respond with an array of objects. Each object should have a property of "username".', () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          expect(response.body.users).toBeInstanceOf(Array);
          expect(response.body.users.length).toBe(5);
          response.body.users.forEach((user) => {
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
    test("404: Respond with a 404 not found when given an unkown route.", () => {
      return request(app)
        .get("/api/monkey")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Not Found");
        });
    });
  });

  describe("GET /api/articles/:article_id (comment count)", () => {
    test("should return the articles object plus the comment_count property. ", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            comment_count: 2,
          });
        });
    });
  });

  describe("GET /api/articles", () => {
    test("200: Should return an array of article objects, including the relevant properties + comment_count property, sorted by date in descending order. ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeInstanceOf(Array);
          expect(response.body.articles.length).toBe(12);
          response.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test('404: Return a message "not found" if an unkown route is requested. ', () => {
      return request(app)
        .get("/api/donkeys")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Not Found");
        });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    test("200: Returns an array of comments for the given article_id. ", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toBeInstanceOf(Array);
          expect(response.body.comments.length).toBe(2);
          response.body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                votes: expect.any(Number),
                author: expect.any(String),
                article_id: expect.any(Number),
                created_at: expect.any(String),
              })
            );
          });
        });
    });

    test('400: Given an incorrect data type, return message "Bad Request', () => {
      return request(app)
        .get("/api/articles/kingkong/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Bad Request");
        });
    });
    test("404: Valid ID but does not exist yet.", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Not Found");
        });
    });
    test("404: Given a valid ID but incorrect end path.", () => {
      request(app)
        .get("/api/articles/5/bananas")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Not Found");
        });
    });
    test("200: Valid Article ID, valid article but no existing comments.", () => {
      return request(app)
        .get("/api/articles/10/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual([]);
        });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("201: Request takes an object of a username and a body property. Reponds with the posted comment. ", () => {
      const comment = {
        author: "thebeebop",
        body: "If you are reading this then you are a... fine example of a human being!",
      };

      return request(app)
        .post("/api/articles/10/comments")
        .expect(201)
        .send(comment)
        .then((response) => {
          expect(response.body).toEqual({
            comment_id: expect.any(Number),
            body: "If you are reading this then you are a... fine example of a human being!",
            author: "thebeebop",
            article_id: 10,
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
    test("400: Given a malformed body, respond with a 400 bad request.", () => {
      const badComment = {};
      return request(app)
        .post("/api/articles/10/comments")
        .expect(400)
        .send(badComment)
        .then((response) => {
          expect(response.body.msg).toEqual("Bad Request");
        });
    });

    test("400: Given an invalid ID, respond with a 400 bad request.", () => {
      const comment = {
        author: "thebeebop",
        body: "If you are reading this then you are a... fine example of a human being!",
      };

      return request(app)
        .post("/api/articles/mario/comments")
        .expect(400)
        .send(comment)
        .then((response) => {
          expect(response.body.msg).toEqual("Bad Request");
        });
    });
    test("404: Given a valid articleID that does not exist, respond with a 404 not found.", () => {
      const comment = {
        author: "thebeebop",
        body: "If you are reading this then you are a... fine example of a human being!",
      };

      return request(app)
        .post("/api/articles/90/comments")
        .expect(404)
        .send(comment)
        .then((response) => {
          expect(response.body.msg).toEqual("Not Found");
        });
    });
    test("404: Username is a valid data-type, but user does not exist in the db.", () => {
      const comment = {
        author: "SpagYeti",
        body: "The Yeti of Spaghetti.",
      };

      return request(app)
        .post("/api/articles/10/comments")
        .expect(404)
        .send(comment)
        .then((response) => {
          expect(response.body.msg).toEqual("Not Found");
        });
    });
  });

  describe("GET /api/articles (queries)", () => {
    test("200: returns articles sorted by comment_count in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("comment_count", {
            descending: true,
          });
        });
    });
    test("200: returns articles that can be ordered by either asc or desc. ", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count&order=asc")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("comment_count", {
            descending: false,
          });
        });
    });
    test("200: returns articles filtered by the given topic value.", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then((response) => {
          response.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                title: expect.any(String),
                topic: "cats",
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("200: Given a valid author, return all articles related to this author", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then((response) => {
          console.log(response.body.articles, "<<<<< articles");
          response.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                title: expect.any(String),
                topic: expect.any(String),
                author: "icellusedkars",
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("400: Given an invalid sort-by query, respond with a 400 error.", () => {
      return request(app)
        .get("/api/articles?sort_by=donkeykong")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Bad Request");
        });
    });
    test("400: Given an invalid order query, respond with a 400 error.", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count&order=SQLinjection")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Bad Request");
        });
    });
    test("404: Given a valid topic value that does not yet exist, respond with a 404 error.", () => {
      return request(app)
        .get("/api/articles?topic=bananas")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Not Found");
        });
    });
    test("404: Given a valid topic value that has no existing articles, return a 404 error.", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Not Found");
        });
    });
    test("404: Given a valid author value that does not exist in the db, respond with a 404 error", () => {
      return request(app)
        .get("/api/articles?author=mario")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Not Found");
        });
    });
    test("200: Author exists in db but has no articles, respond with an empty array", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toEqual([]);
        });
    });
  });
});
