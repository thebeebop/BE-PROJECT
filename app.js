const express = require("express");
const { getTopics } = require("./controller/topics.controller");
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controller/articles.controllers.js");
const { getUsers } = require("./controller/users.controllers");
const { deleteCommentById } = require("./controller/comments.articles");
const { getApi } = require("./controller/api.controller");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);

app.patch("/api/articles/:article_id", patchArticleById);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server errR." });
});

module.exports = app;
