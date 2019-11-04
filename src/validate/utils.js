exports.isEmail = function(value) {
  return /^[-_a-zA-Z0-9]+([._\\-]*[-_a-zA-Z0-9])*@([-_a-zA-Z0-9]+.){1,63}[-_a-zA-Z0-9]+$/.test(
    value
  );
};

exports.isPhone = function(value) {
  return /^\d{3,4}-{0,1}\d{7,8}$/.test(value);
};
