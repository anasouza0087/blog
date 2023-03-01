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

router.get("/admin/users/login", (req, res) => {
    res.render("admin/users/login")
})

router.post("/authenticate", (req, res) => {
    const title = req.body.title
    const password = req.body.password

    User.findOne({
        where: {
            title: title
        }
    }).then(user => {
        if (user != undefined) {
            const isCorrect = bcrypt.compareSync(password, user.password)

            if (isCorrect) {
                req.session.user = {
                    // id: user.id,
                    title: user.title
                }
                res.json(req.session.user)
            } else {
                res.redirect("/admin/users/login")
            }

        } else {
            res.redirect("/admin/users/login")
        }
    })
})

module.exports = router

