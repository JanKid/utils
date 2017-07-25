var express = require('express')
var path = require('path')
var ejs = require('ejs')
var fs = require('fs')
var app = express()
var router = express.Router

var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart()

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

app.get('/ajax', (req, res) => {
    res.render('ajax', { title: 'Ajax Test title' })
})
app.get('/ajax/get', (req, res) => {
    res.send('get ajax success')
})

app.post('/ajax/post', (req, res) => {
    res.send('get ajax success')
})

app.post('/ajax/upload', multipartMiddleware, function(req, res) {
    console.log(req.file, req.body, req.files)
        // 获得文件的临时路径
    var tmp_path = req.files.filename.path;
    // 指定文件上传后的目录 - 示例为"images"目录。 
    var target_path = './upload/' + req.files.filename.name;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // 删除临时文件夹文件, 
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.filename.size + ' bytes');
        });
    });
})
var server = app.listen(8060, function() {
    console.log('server start')
})