const { fetchArticlebyId } = require('../model/articles.models')


exports.getArticleById = (req, res, next) => {
    const id = req.params.article_id
    fetchArticlebyId(id).then((article) => {
         res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}