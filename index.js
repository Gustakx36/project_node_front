var express = require('express')
var app = express()
var path = require('path')

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'views')))

app.get('/burguer', (req, res) => {
    res.render('../views/index')
})

app.listen(3333)