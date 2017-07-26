var express = require('express')
var path = require('path')
var ejs = require('ejs')
var fs = require('fs')
var app = express()
var router = express.Router()

var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

// 获取主路由
var ajaxRouter = require('./route/ajax')
var dateRouter = require('./route/date')

app.engine('html', ejs.__express)
app.set('views', path.join(__dirname, 'example'))
app.set('view engine', 'html')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/static', express.static(path.join(__dirname, 'dist')))

// router.get('/', function(req, res) {
//     console.log('get')
//     res.render('index', { title: ' Test title' })
//         // res.send('Hello world')
// })
app.get('/', (req, res) => {
    res.render('index', { title: ' Test title' })
})
app.use('/ajax', ajaxRouter)
app.use('/date', dateRouter) 




var server = app.listen(8060, function() {
    console.log('server start')
})