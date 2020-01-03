const Router = require('koa-router');
const authRouter = require('../api/auth/authRouter');
const userRouter = require('../api/user/userRouter');
const settingRouter = require('../api/setting/settingRouter');
const poemRouter = require('../api/poem/poemRouter');

const authorize = require('../middleware/authorize');

const apiRouter = new Router();

apiRouter.use('/auth', authRouter.routes());
apiRouter.use('/user', authorize, userRouter.routes());
apiRouter.use('/setting', authorize, settingRouter.routes());
apiRouter.use('/poem', poemRouter.routes());

module.exports = apiRouter;
