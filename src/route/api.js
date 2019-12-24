const Router = require('koa-router');
const authRouter = require('../api/auth/authRouter');

const apiRouter = new Router();

apiRouter.use('/auth', authRouter.routes())

module.exports = apiRouter;
