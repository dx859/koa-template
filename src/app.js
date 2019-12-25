const config = require('config');
const Koa = require('koa');
const middleware = require('./middleware');
const db = require('./utils/db');
db.configure(config.get('dbConfig'));

const app = (module.exports = new Koa());
app.keys = config.get('keys');

app.use(middleware(app, config));

if (!module.parent) app.listen(config.get('port'));
