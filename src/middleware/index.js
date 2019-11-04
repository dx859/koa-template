const compose = require('koa-compose');
const favicon = require('koa-favicon');
const bodyparser = require('koa-bodyparser');
const json = require('koa-json');
const session = require('koa-session');

const errorHanding = require('./errorHanding');
const page404 = require('./page404');
const validate = require('./validate');

const router = require('../route');

module.exports = function(app, config) {
  return compose([
    errorHanding,
    favicon(config.faviconPath),
    bodyparser({ enableTypes: ['json', 'form', 'text'] }),
    json(),
    session(config.sessionConfig, app),
    validate,
    router.routes(),
    router.allowedMethods(),
    page404
  ]);
};
