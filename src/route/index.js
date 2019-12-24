const Router = require('koa-router');
const apiRouter = require('./api');
const errorHanding = require('../middleware/errorHanding');

const router = new Router();

router.use('/api', errorHanding, apiRouter.routes());

module.exports = router;
