const { isPhone, isEmail } = require('./utils');

module.exports = function(value, rule) {
  const {
    required,
    requiredMessage,
    min,
    minMessage,
    max,
    maxMessage,
    email,
    emailMessage,
    phone,
    phoneMessage,
    length,
    lengthMessage,
    func,
    name
  } = rule;

  if (!value) {
    let message = requiredMessage || `${name}为必填项`;
    return required ? message : '';
  }

  if (length && value.length === length) {
    return lengthMessage || `${name}的长度必须为${lengthMessage}`;
  }

  if (max && value.length > max) {
    return maxMessage || `${name}最大长度不能大于${max}`;
  }

  if (min && value.length < min) {
    return minMessage || `${name}最小长度不能小于${min}`;
  }

  if (email && !isEmail(value)) {
    return emailMessage || `${name}格式不正确`;
  }

  if (phone && !isPhone(value)) {
    return phoneMessage || `${name}格式不正确`;
  }

  if (func) {
    return func(value);
  }

  return '';
};
