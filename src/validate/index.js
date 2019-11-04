const validateString = require('./validateString');

exports.validateAll = function(
  values = {},
  rules = {},
  { firstBreak = true } = {}
) {
  let messages = {},
    flag = false;
  for (let key in rules) {
    let rule = rules[key];
    let value = values[key];
    rule.name = rule.name ? rule.name : key;
    let message = validateString(value, rule);

    if (message) {
      flag = true;
      if (firstBreak) {
        return message;
      } else {
        messages[key] = message;
      }
    }
  }
  return flag ? messages : flag;
};
