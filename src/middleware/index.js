const compose = require('koa-compose');
const path = require('path');
const error = require('koa-error');
const favicon = require('koa-favicon');
const bodyparser = require('koa-bodyparser');
const json = require('koa-json');
const session = require('koa-session');


const page404 = require('./page404');
const validate = require('./validate');

const router = require('../route/index');

module.exports = function(app, config) {
  return compose([
    error(),
    favicon(path.join(__dirname, '../../public', config.get('faviconPath'))),
    bodyparser({ enableTypes: ['json', 'form', 'text'] }),
    json(),
    session(Object.assign({}, config.get('sessionConfig')), app),
    validate,
    router.routes(),
    router.allowedMethods(),
    page404
  ]);
};
