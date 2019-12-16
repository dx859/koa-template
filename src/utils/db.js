const mysql = require('mysql');
const config = require('config');

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
    key = '`' + key + '`';
    const count = await this.query(
      `SELECT COUNT(id) count FROM ${table} WHERE ${key}=?`,
      [value]
    );
    return !count[0].count;
  }

  async queryPaging(
    sql,
    data = [],
    { countSql, page = 1, pageSize = 10 } = {}
  ) {
    if (!countSql) {
      countSql = sql.replace(/^select (.+) from/i, function(sql, q) {
        return `select COUNT(${q}) count from`;
      });
    }
    let total = (await this.query(countSql, data))[0].count;
    let list = [];
    if (total !== 0) {
      page = isNaN(page) ? 1 : parseInt(page);
      pageSize = isNaN(pageSize) ? 10 : parseInt(pageSize);
      page = page < 1 ? 1 : page;
      pageSize = pageSize < 1 ? 1 : pageSize;
      pageSize = pageSize > 100 ? 100 : pageSize;
      sql = sql += ` LIMIT ?, ?`;
      data = data.concat([(page - 1) * pageSize, pageSize]);
      list = await this.query(sql, data);
    }
    return { list, page, pageSize, total };
  }
}

module.exports = new DB(config.get('dbConfig'));
