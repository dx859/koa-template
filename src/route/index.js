const Router = require('koa-router');
const apiRouter = require('./api');
const errorHanding = require('../middleware/errorHanding');
const apiResponse = require('../middleware/apiResponse');
const router = new Router();

router.use('/api', errorHanding, apiResponse, apiRouter.routes());

module.exports = router;
