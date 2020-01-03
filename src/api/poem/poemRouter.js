const Router = require('koa-router');
const poemAction = require('./poemAction');

const router = new Router();

router.post('/list', poemAction.poemList);

module.exports = router;
