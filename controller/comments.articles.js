const { eraseCommentById } = require("../model/comments.model");

exports.deleteCommentById = (req, res, next) => {
  const id = req.params.comment_id;
  eraseCommentById(id)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};
