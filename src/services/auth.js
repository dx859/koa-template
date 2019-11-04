const db = require('../utils/db');
const { passwordHash } = require('../utils/security');

const userColumns = ['username', 'password', 'email'];

exports.users = async () => {
  return await db.query(`SELECT * FROM b_user`);
};

exports.validatePassword = async (username, password) => {
  return await db.query(
    `SELECT * FROM b_user WHERE username=? AND password=? LIMIT 1`,
    [username, passwordHash(password)]
  )[0];
};

exports.login = async () => {};

exports.unique = async (key, value) => {
  return db.unique('b_user', key, value);
};

exports.register = async data => {
  data.password = passwordHash(data.password);
  const keys = Object.keys(data);
  const values = Object.values(data);

  return await db.query(
    `INSERT INTO b_user (??) VALUES ( ${keys.map(() => '?').join(',')} )`,
    [keys, ...values]
  );
};
