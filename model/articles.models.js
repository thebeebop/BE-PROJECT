const db = require('../db/connection')


exports.fetchArticlebyId = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id])
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
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`, [updateVoteBy, id])
    .then((updatedArticle) => {
        if (updatedArticle.rows.length === 0) {
            return Promise.reject( { status: 404, msg: 'Not Found'})
            
        }
        return updatedArticle.rows[0]

    })
    
}