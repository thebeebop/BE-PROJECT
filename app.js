const express = require('express');
const { getTopics } = require('./controller/topics.controller');
const { getArticleById } = require('./controller/articles.controllers.js');


const app = express();

// app.use(express.json())



app.get('/api/topics', getTopics)


app.get('/api/articles/:article_id', getArticleById)


app.use('/*', (req, res) => {
    res.status(404).send({ msg: '404: Not Found'})
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
        res.status(400).send( { msg:'400: Bad Request!' })
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg:'STATUS 500: Internal server error.' })
})

module.exports = app