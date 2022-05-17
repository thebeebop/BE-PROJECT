const express = require('express');
const db = require('./db/connection.js');
const { getTopics } = require('./controller/topics.controller');


const app = express();

// app.use(express.json())



app.get('/api/topics', getTopics )



app.use('/*', (req, res) => {
    console.log('<<<<<< app')
    res.status(404).send({ msg: '404: Not Found'})
})


app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg:'STATUS 500: Internal server error.' })
})

module.exports = app