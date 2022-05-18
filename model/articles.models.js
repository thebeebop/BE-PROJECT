const db = require('../db/connection')


exports.fetchArticlebyId = (id) => {
    return db.query(
    `SELECT articles.*,
    COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [id])
    .then((response) => {
        console.log(response, '<<<<<< controller')
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