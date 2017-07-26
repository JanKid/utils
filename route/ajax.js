var express = require('express');
var router = express.Router();

// express 4.0后，用于文件上传解析的中间件
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart()
    // 该路由使用的中间件
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
router.get('/', (req, res) => {
    res.render('ajax', { title: 'Ajax Test title' })
})
router.get('/get', (req, res) => {
    res.send('get ajax success')
})

router.post('/post', (req, res) => {
    res.send('post ajax success')
})

router.post('/upload', multipartMiddleware, function(req, res) {
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
module.exports = router;