const Router = require('koa-router');
const postAction = require('./postAction');

const router = new Router();

router.post('/list', postAction.list);
router.post('/tree-list', postAction.treeList);
router.post('/detail/:id', postAction.detail);
router.post('/delete/:id', postAction.delete);
router.post('/create', postAction.create);
router.post('/update/:id', postAction.update);

module.exports = router;
