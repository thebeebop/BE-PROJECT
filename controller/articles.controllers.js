const { fetchArticlebyId, updateArticleById, fetchArticle, fetchCommentsByArticleId, addComment } = require('../model/articles.models')




exports.getArticle = (req, res, next) => {
    fetchArticle().then((articles) => {
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
    updateArticleById(id, updateVoteBy).then((update) => {
        res.status(200).send({ update })
    })
    .catch((err) => {
        next(err)
    })
}


 exports.getCommentsByArticleId = (req, res, next) => {
     const articleId = req.params.article_id
    fetchCommentsByArticleId(articleId)
    .then((comments) => {
        res.status(200).send({ comments })

    })
    .catch((err) => {
        next(err)
    })
 } 

 exports.postCommentByArticleId = (req, res, next) => {
     const articleId = req.params.article_id
     console.log(articleId);
     const commentBody = req.body
     console.log(commentBody, '<<<<body');
     addComment(articleId)
 }