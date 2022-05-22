const { checkExists } = require("../db/helpers/utils");
const {
  fetchArticlebyId,
  updateArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addComment,
} = require("../model/articles.models");

exports.getArticles = (req, res, next) => {
  const { author, topic } = req.query;
  if (author) {
    checkExists("users", "username", author)
      .then(() => {
        fetchArticles(req.query).then((articles) => {
          res.status(200).send({ articles });
        });
      })
      .catch((err) => {
        next(err);
      });
  } else if (topic) {
    checkExists("articles", "topic", topic)
      .then(() => {
        fetchArticles(req.query).then((articles) => {
          res.status(200).send({ articles });
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    fetchArticles(req.query)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticlebyId(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const updateVoteBy = req.body.inc_votes;
  const id = req.params.article_id;
  updateArticleById(id, updateVoteBy)
    .then((update) => {
      res.status(200).send({ update });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticlebyId(articleId)
    .then(() => {
      return fetchCommentsByArticleId(articleId).then((comments) => {
        res.status(200).send({ comments });
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const commentBody = req.body;
  addComment(articleId, commentBody)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};
