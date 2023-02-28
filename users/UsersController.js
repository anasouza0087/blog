const express = require("express")
const router = express.Router()
const User = require("./User")
const bcrypt = require('bcryptjs')

router.get("/admin/users", (req, res) => {
    User.findAll()
        .then(users => {
            res.render("admin/users/index", { users: users })
        })
})

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
})

router.post("/users/create", (req, res) => {
    //title == email
    const title = req.body.title
    var password = req.body.password

    User.findOne({
        where: {
            title: title
        }
    }).then(user => {
        if (user == undefined) {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

            User.create({
                title: title,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch((err) => {
                console.log(err)
            })
        } else {
            res.redirect("/admin/users")
        }
    })


})

module.exports = router

