const mysql = require('mysql');
const config = require('../config');

class DB {
  constructor(opts) {
    this.conn = null;
    this.opts = opts;
    if (opts != null) {
      this.conn = mysql.createPool(opts);
    }
  }

  configure(opts) {
    this.opts = opts;
    if (this.conn) this.end();
    this.conn = mysql.createConnection(opts);
  }

  query(
    sql,
    data,
    {
      typeCast = function(field, next) {
        if (field.type === 'DATETIME') {
          return field.string();
        }
        return next();
      }
    } = {}
  ) {
    return new Promise((resolve, reject) => {
      let startTime = Date.now();
      let query = this.conn.query(
        {
          sql,
          values: data,
          typeCast
        },
        function(err, results) {
          if ((process.env.NODE_ENV = 'development')) {
            let sqlTime = Date.now() - startTime;
            console.log(query.sql, `: ${sqlTime}ms`);
          }

          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  }

  end() {
    this.conn.end();
  }

  async unique(table, key, value) {
    const count = await this.query(
      `SELECT COUNT(id) count FROM ${table} WHERE ${key}=?`,
      [value]
    );
    return !count[0].count;
  }
}

module.exports = new DB(config.db);
