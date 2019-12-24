const Router = require('koa-router');

const router = new Router();

router.use('/api', apiRouter);

module.exports = router;
