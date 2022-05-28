const { status } = require("express/lib/response");
const db = require("../db/connection");

exports.eraseCommentById = (id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [id])
    .then((comment) => {
      if (!comment.rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};
