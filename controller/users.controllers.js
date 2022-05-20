const { fetchUsers } = require("../model/users.models")





exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({ users })

    })
}

exports.getUserbyID = (req, res, next) => {
    const username = req.params
}