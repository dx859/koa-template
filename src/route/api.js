const Router = require('koa-router');
const authRouter = require('../api/auth/authRouter');
const userRouter = require('../api/user/userRouter');
const authorize = require('../middleware/authorize');

const apiRouter = new Router();

apiRouter.use('/auth', authRouter.routes());
apiRouter.use('/user', authorize, userRouter.routes());

module.exports = apiRouter;
