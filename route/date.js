var express = require('express');
var router = express.Router();

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
router.get('/', (req, res) => {
    res.render('date', { title: 'Date Test title' })
})
module.exports = router;