const db = require('../utils/db');

const attrs = [];

exports.getPostList = async ({
  condition,
  params = [],
  attrs = [],
  page,
  pageSize
} = {}) => {
  let sql = 'SELECT ?? FROM b_post';
  if (attrs.length === 0) {
    sql = sql.replace('??', '*');
  }

  if (condition) {
    sql += ` WHERE ${condition}`;
  }

  return await db.queryPaging(sql, [...attrs, ...params], { page, pageSize });
};
