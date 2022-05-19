const express = require('express');
const { getTopics } = require('./controller/topics.controller');
const { getArticleById, patchArticleById, getArticle, getCommentsByArticleId } = require('./controller/articles.controllers.js');
const { getUsers } = require('./controller/users.controllers');


const app = express();

app.use(express.json())



app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.get('/api/users', getUsers)
app.get('/api/articles', getArticle)

app.patch('/api/articles/:article_id', patchArticleById)




app.use('/*', (req, res) => {
    res.status(404).send({ msg: 'Not Found'})
})

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg: err.msg })
    } else {
        next(err)
    }
})


app.use((err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send( { msg:'Bad Request' })
    } else if (err.code === '23502') {
        res.status(400).send( {msg: 'Bad Request'})
    }else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg:'Internal server error.' })
})

module.exports = app