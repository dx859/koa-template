exports.getAttrs = (obj, attributes) => {
  let tmp = {};
  attributes.forEach(key => {
    tmp[key] = obj[key];
  });
  return tmp;
};
