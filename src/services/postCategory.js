const db = require('../utils/db');

exports.hasPostCategory = async ({ key = 'id', value }) => {
  return !(await db.unique('b_post_category', key, value));
};

exports.getList = async () => {
  return await db.query(`SELECT * FROM b_post_category`);
};

exports.create = async data => {
  let response = await db.query(
    `INSERT INTO b_post_category (name) VALUES (?)`,
    [data.name]
  );
  return response.insertId;
};

exports.update = async ({ data, id } = {}) => {
  let keys = Object.keys(data);
  let values = Object.values(data);

  let setString = keys.map(key => '`' + key + '`=?').join(',');
  let response = await db.query(
    `UPDATE b_post_category SET ${setString} WHERE id=?`,
    [...values, id]
  );
  return response.affectedRows;
};

exports.delete = async ({ condition, params = [] } = {}) => {
  if (!condition) {
    throw Error('请添加删除条件');
  }
  let sql = `DELETE FROM b_post_category WHERE ${condition}`;
  let result = await db.query(sql, params);
  return result.affectedRows;
};
