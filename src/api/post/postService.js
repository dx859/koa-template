const db = require('../../utils/db');
const { array2children } = require('../../utils/common');

const generatePostSql = ({ condition, params = [], attrs = [] } = {}) => {
  let sql = 'SELECT ?? FROM b_post';
  if (attrs.length === 0) {
    sql = sql.replace('??', '*');
  }

  if (condition) {
    sql += ` WHERE ${condition}`;
  }
  return sql;
};

exports.getPostList = async ({
  condition,
  params = [],
  attrs = [],
  page,
  pageSize
} = {}) => {
  return await db.queryPaging(
    generatePostSql({ condition, params, attrs }),
    [...attrs, ...params],
    {
      page,
      pageSize
    }
  );
};

exports.getTreeList = async ({ condition, params = [], attrs = [] }) => {
  let p = [];
  if (attrs.length > 0) {
    p.push(attrs);
  }
  p = p.concat(params);
  let result = await db.query(generatePostSql({ condition, params, attrs }), p);
  return array2children(result);
};

exports.getPost = async ({ condition, params = [], attrs = [] } = {}) => {
  let p = [];
  if (attrs.length > 0) {
    p.push(attrs);
  }
  p = p.concat(params);
  return (await db.query(generatePostSql({ condition, params, attrs }), p))[0];
};

exports.deletePost = async ({ condition, params = [] } = {}) => {
  if (!condition) {
    throw Error('请添加删除条件');
  }
  let sql = `DELETE FROM b_post WHERE ${condition}`;
  let result = await db.query(sql, params);
  return result.affectedRows;
};

exports.createPost = async data => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  let postCategoryIndex = keys.indexOf('post_category_id');

  if (postCategoryIndex > -1) {
    let post_category_id = values[postCategoryIndex];
    let hasId = await db.unique('b_post_category', 'id', post_category_id);

    if (hasId) {
      throw Error('分类id不存在');
    }
  }

  let sql = `INSERT INTO b_post (??) VALUES ( ${keys
    .map(() => '?')
    .join(',')} )`;
  let response = await db.query(sql, [keys, ...values]);
  return response.insertId;
};

exports.updatePost = async ({ data, condition, params }) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  let sql = `UPDATE b_post SET ${keys
    .map(key => key + '=?')
    .join(',')} WHERE ${condition}`;
  let response = await db.query(sql, [...values, ...params]);
  return response.affectedRows;
};
