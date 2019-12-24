const Router = require('koa-router');
const authAction = require('./authAction');

const router = new Router();

router.post('/sign-in', authAction.signIn);
router.post('/sign-up', authAction.signUp);

module.exports = router;
