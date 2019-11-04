const Koa = require('koa');
const config = require('./config');
const middleware = require('./middleware');

const app = (module.exports = new Koa());
app.keys = config.keys;

app.use(middleware(app, config));

if (!module.parent) app.listen(config);
