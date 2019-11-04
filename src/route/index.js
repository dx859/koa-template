const fs = require('fs');
const path = require('path');
const Router = require('koa-router');

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

const controller = requireController(path.join(__dirname, '..', 'controller'));

const router = new Router();

router.get('/auth/sign-in', controller.auth.signIn);
router.post('/auth/sign-up', controller.auth.signUp);

module.exports = router;
