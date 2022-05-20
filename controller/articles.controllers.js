
const { fetchArticlebyId, updateArticleById, fetchArticles, fetchCommentsByArticleId, addComment } = require('../model/articles.models')




exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({ articles })
    })
}


exports.getArticleById = (req, res, next) => {
    const id = req.params.article_id;

    fetchArticlebyId(id).then((article) => {
         res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })

}


exports.patchArticleById = (req, res, next) => {
    const updateVoteBy = req.body.inc_votes
    const id = req.params.article_id;
    updateArticleById(id, updateVoteBy).then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}


exports.getCommentsByArticleId = (req, res, next) => {
    const articleId = req.params.article_id
    fetchArticlebyId(articleId).then(() => {
        return fetchCommentsByArticleId(articleId)
     }).then((comments) => {
        res.status(200).send({ comments })

    })
    .catch((err) => {
        next(err)
    })
 } 


 exports.postCommentByArticleId = (req, res, next) => {
     const articleId = req.params.article_id
     const commentBody = req.body
     const user = req.body.author
     fetchArticlebyId(articleId).then(() => {
        return addComment(articleId, commentBody).then((comment) => {
            res.status(201).send(comment)
           })
     })
     .catch((err) => {
         next(err)
     })
 }

