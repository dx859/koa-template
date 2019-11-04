const crypto = require('crypto');

exports.passwordHash = password => {
  let md5 = crypto.createHash('md5');
  return md5.update(password).digest('hex');
};
