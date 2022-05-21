const db = require("../db/connection");

exports.fetchArticles = (query) => {
  const validSortBy = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];

  const ValidOrder = ["asc", "desc"];

  const { sort_by = "created_at", order = "desc", topic } = query;

  console.log(sort_by, "<<<< sort_by");
  console.log(order, "<<<<<< order");
  console.log(topic, "<<<<< topic");

  //Query Strings
  let queryStr = `
  SELECT articles.*,
  COUNT(comment_id)::int AS comment_count
  FROM articles
  LEFT JOIN comments
  ON comments.article_id = articles.article_id `;

  let queryCond = `
  WHERE topic = $1`;

  let queryStrTwo = `
  GROUP BY articles.article_id
  `;

  //SORT_BY
  if (validSortBy.includes(sort_by)) {
    queryStrTwo += `ORDER BY ${sort_by}`;
  } else {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  //ORDER
  if (ValidOrder.includes(order)) {
    if (order === "desc") {
      queryStrTwo += ` DESC`;
    } else {
      queryStrTwo += ` ASC`;
    }
  } else {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let queryVal = [];
  let finalQueryStr = ``;

  if (topic !== undefined) {
    finalQueryStr = queryStr + queryCond + queryStrTwo;
    queryVal.push(topic);
  } else {
    finalQueryStr = queryStr + queryStrTwo;
  }

  console.log(finalQueryStr, "<<<< final query");

  return db.query(finalQueryStr, queryVal).then((response) => {
    if (!response.rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    } else {
      return response.rows;
    }
  });
};

exports.fetchArticlebyId = (id) => {
  console.log(id, "<<<< id");
  return db
    .query(
      `SELECT articles.*,
    COUNT(comment_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return response.rows[0];
      }
    });
};

exports.updateArticleById = (id, updateVoteBy) => {
  return db
    .query(
      `UPDATE articles
    SET votes = $1
    WHERE article_id = $2
    RETURNING *`,
      [updateVoteBy, id]
    )
    .then((updatedArticle) => {
      if (updatedArticle.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return updatedArticle.rows[0];
    });
};

exports.fetchCommentsByArticleId = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments
         WHERE article_id = $1`,
      [articleId]
    )
    .then((comments) => {
      return comments.rows;
    });
};

exports.addComment = (articleId, comment) => {
  const { body, author } = comment;
  return db
    .query(
      `
    INSERT INTO comments (body, author, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;`,
      [body, author, articleId]
    )
    .then((response) => {
      return response.rows[0];
    });
};
