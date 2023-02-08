const express = require('express')
const slugify = require('slugify')
const router = express.Router()
const Category = require('./Category')

router.get("/categories", (req, res) => {
    res.send('Categories Route')
})

router.get("/admin/categories/new", (req, res) => {
    res.render("admin/categories/new")
})

router.post("/categories/save", (req, res) => {
    const title = req.body.title
    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/')
        })
    } else {
        res.redirect('/admin/categories/new')
    }
})

module.exports = router