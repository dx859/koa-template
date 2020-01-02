const Router = require('koa-router');
const userAction = require('./userAction');

const router = new Router();

router.post('/info', userAction.info);

module.exports = router;
