
const { fetchArticlebyId, updateArticleById } = require('../model/articles.models')


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