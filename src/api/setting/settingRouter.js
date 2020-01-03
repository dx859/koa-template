const Router = require('koa-router');
const settingAction = require('./settingAction');

const router = new Router();

router.post('/menu', settingAction.menu);


module.exports = router;
