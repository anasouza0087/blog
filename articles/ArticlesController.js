const express = require('express')
const router = express.Router()
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")

router.get("/admin/articles", (req, res) => {
    Article
        .findAll({
            include: [{ model: Category }]
        }
        ).then(articles => {
            res.render("admin/articles/index", { articles: articles })
        })
})

router.get("/admin/articles/new", (req, res) => {
    Category
        .findAll()
        .then(categories => {
            res.render("admin/articles/new", { categories: categories })
        })
})

router.post("/articles/save", (req, res) => {
    const title = req.body.title
    const body = req.body.body
    const category = req.body.categories
    Article
        .create({
            title: title,
            slug: slugify(title),
            body: body,
            category: category
        }).then(() => {
            res.redirect("/admin/articles")
        })
})

router.post("/articles/delete", (req, res) => {
    const id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) {
            Article
                .destroy({
                    where: {
                        id: id
                    }
                }).then(() => res.redirect("/admin/articles"))
        } else {
            res.redirect("/admin/articles")
        }
    } else {
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/edit/:id", (req, res) => {
    const id = req.params.id
    Article
        .findByPk(id)
        .then(article => {
            if (article != null) {
                Category
                    .findAll()
                    .then(categories => {
                        res.render("admin/articles/edit", { categories: categories })
                    })
            } else {
                res.redirect("/")
            }
        }).catch(err => res.redirect("/"))
})

router.post("/articles/update", (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category

    Article.update({
        title: title,
        body: body,
        categoryId: category,
        slug: slugify(title)
    },
        {
            where: {
                id: id
            }
        }).then(() => {
            res.redirect("/admin/articles")
        }).
        catch(err => {
            res.redirect("/")
        })
})

router.get("/articles/page/:num", (req, res) => {
    const page = req.params.num
    var offset = 0
    if (isNaN(page) || page == 1) {
        offset = 0
    } else {
        offset = parseInt(page) * 5
    }
    Article
        .findAndCountAll({
            limit: 5,
            offset: offset
        })
        .then(articles => {
            var next
            if (offset + 4 >= articles.count) {
                next = false
            } else {
                next = true
            }
            const result = {
                next: next,
                articles: articles,
            }
            Category
                .findAll()
                .then(categories => {
                    res.render("admin/articles/page", { result: result, categories: categories })
                })
        })
})

module.exports = router