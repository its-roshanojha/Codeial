const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home _controller');

console.log('Router Loaded ')

router.get('/', homeController.home);
// middleware
router.use('/users', require('./users'));

router.use('/posts', require('./post'));

router.use('/comments',require('./comments'));

router.use('/likes', require('./likes'));



router.use('/api', require('./api'));
// for any futher routes, access from here
// router.use('/routername', require('./routerfile))

module.exports = router;