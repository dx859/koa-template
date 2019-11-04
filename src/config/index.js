const path = require('path');
const fs = require('fs');
const rootPath = path.join(__dirname, '..', '..');

const NODE_ENV = process.env.NODE_ENV || 'development';

dotenvPath = path.join(rootPath, '.env');

[
  `${dotenvPath}.${NODE_ENV}.local`,
  `${dotenvPath}.${NODE_ENV}`,
  `${dotenvPath}.local`,
  dotenvPath
]
  .filter(Boolean)
  .forEach(dotenvFile => {
    if (fs.existsSync(dotenvFile)) {
      require('dotenv').config({
        path: dotenvFile
      });
    }
  });

module.exports = {
  port: process.env.PORT || 3000,
  keys: process.env.KEY ? [process.env.KEY] : ['koa this is for you'],
  name: 'koa-template',
  faviconPath: path.join(rootPath, 'favicon.ico'),

  sessionConfig: {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true /** (boolean) can overwrite or not (default true) */,
    httpOnly: true /** (boolean) httpOnly or not (default true) */,
    signed: true /** (boolean) signed or not (default true) */,
    rolling: false
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root',
    port: process.env.DB_PORT || '3306',
    database: process.env.DB_NAME || 'koa-template',
    connectionLimit: 5
  }
};
