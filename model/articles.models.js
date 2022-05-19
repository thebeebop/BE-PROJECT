const db = require('../db/connection')




exports.fetchArticles = () => {
    return db.query(
        `SELECT articles.*,
        COUNT(comment_id)::int AS comment_count
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC;`)
    .then((response) => {
        console.log(response.rows)
       return response.rows
    })
}



exports.fetchArticlebyId = (id) => {
    return db.query(
    `SELECT articles.*,
    COUNT(comment_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [id])
    .then((response) => {
        if (response.rows.length === 0) {
           return Promise.reject({ status: 404, msg: 'Not Found'})
        } else {
        return response.rows[0]
        }
    })
}


exports.updateArticleById = (id, updateVoteBy) => {
    return db.query(
    `UPDATE articles
    SET votes = $1
    WHERE article_id = $2
    RETURNING *`, [updateVoteBy, id])
    .then((updatedArticle) => {
        if (updatedArticle.rows.length === 0) {
            return Promise.reject( { status: 404, msg: 'Not Found'})
            
        }
        return updatedArticle.rows[0]

    })
    
}


exports.fetchCommentsByArticleId = (articleId) => {
    return db.query(
        `SELECT * FROM comments
         WHERE article_id = $1`, [articleId]).then((comments) => {
              if (comments.rows.length === 0) {
                 return Promise.reject({ status: 404, msg: 'Not Found'})
             } else {
             return comments.rows
             }
         })
}

exports.addComment = (articleId, comment) => {
    const { body, author } = comment
    return db.query(`
    INSERT INTO comments (body, author, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [body, author, articleId]).then((response) => {
        return response.rows[0]
    })
}