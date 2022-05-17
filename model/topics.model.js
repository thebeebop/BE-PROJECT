const db = require('../db/connection')
const pg = require('pg')


exports.fetchTopics = () => {
   return db.query('SELECT * FROM topics;')
    .then((data)=> {
        return data.rows
    })
}