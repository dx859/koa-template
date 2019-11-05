const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const authorize = require('../middleware/authorize');

const controller = requireController(path.join(__dirname, '..', 'controller'));

const router = new Router();
const postRouter = new Router();

router.post('/auth/sign-in', controller.auth.signIn);
router.post('/auth/sign-up', controller.auth.signUp);

postRouter.get('/', controller.post.list);
postRouter.get('/detail/:id', controller.post.detail);
postRouter.post('/delete/:id', controller.post.delete);
postRouter.post('/create', controller.post.create);
postRouter.post('/update/:id', controller.post.update);

router.use('/post', authorize, postRouter.routes());
module.exports = router;

function requireController(filePath, controller = {}) {
  let files = fs.readdirSync(filePath);
  files.forEach(filename => {
    let fpath = path.join(filePath, filename);
    let stat = fs.statSync(fpath);
    if (stat.isDirectory()) {
      controller[filename] = {};
      requireController(fpath, controller[filename]);
    }

    if (
      stat.isFile() &&
      filename.substr(filename.lastIndexOf('.') + 1) === 'js'
    ) {
      controller[
        filename.substring(0, filename.lastIndexOf('.'))
      ] = require(fpath);
    }
  });
  return controller;
}
