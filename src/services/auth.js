const db = require('../utils/db');
const { passwordHash } = require('../utils/security');

exports.users = async () => {
  return await db.query(`SELECT * FROM b_user`);
};

exports.validatePassword = async (username, password) => {
  return await db.query(
    `SELECT * FROM b_user WHERE username=? AND password=? LIMIT 1`,
    [username, passwordHash(password)]
  )[0];
};

exports.unique = async (key, value) => {
  return db.unique('b_user', key, value);
};

exports.login = async data => {
  data.password = passwordHash(data.password);
  let response = await db.query(
    `SELECT * FROM b_user WHERE username=? AND password=? LIMIT 1`,
    [data.username, data.password]
  );
  return response[0];
};

exports.register = async data => {
  data.password = passwordHash(data.password);
  const keys = Object.keys(data);
  const values = Object.values(data);

  let response = await db.query(
    `INSERT INTO b_user (??) VALUES ( ${keys.map(() => '?').join(',')} )`,
    [keys, ...values]
  );
  return response.insertId;
};
