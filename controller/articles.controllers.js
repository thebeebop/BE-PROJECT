const { fetchArticlebyId, updateArticleById, fetchArticle } = require('../model/articles.models')




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