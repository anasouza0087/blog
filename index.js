const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')

//View engine
app.set('view engine', 'ejs')

//Carregando arquivos estáticos (CSS, imagens, etc)
app.use(express.static('public'))

//body-parser (para trabalhar com forms)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Conectando com B.D.
connection
    .authenticate()
    .then(() => console.log("Connection estabilished!"))
    .catch((error) => console.log(error))

//Rota da tela home
app.get("/", (req, res) => {
    res.render('index.ejs')
})

//Rotas
app.use("/", categoriesController)
app.use("/", articlesController)

//Rodando o servidor
app.listen(8080, () => {
    console.log("Server UP!")
})