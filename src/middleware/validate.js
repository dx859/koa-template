const { validateAll } = require('../validate');

async function validate(ctx, next) {
  ctx.validate = function(rules, values = ctx.request.body) {
    let message = validateAll(values, rules);

    if (message) {
      ctx.throw(422, message, { code: 10000 });
    } else {
      const tmpValue = {};
      for (let key in rules) {
        tmpValue[key] =
          values[key] === undefined || values[key] === ''
            ? rules[key].defaultValue
            : values[key];
      }
      return tmpValue;
    }
  };
  return next();
}

module.exports = validate;
