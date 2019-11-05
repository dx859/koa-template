const db = require('../utils/db');

exports.hasPostCategory = async ({ key = 'id', value }) => {
  return db.unique('b_user', key, value);
};
