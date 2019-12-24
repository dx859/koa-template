const { zh2Hans } = require('./transform');

const traditional2Simplified = sentence => {
  return sentence
    .split('')
    .map(word => (zh2Hans[word] ? zh2Hans[word] : word))
    .join('');
};

const objT2S = obj => {
  let tmp = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        tmp[key] = traditional2Simplified(obj[key]);
      } else if (Array.isArray(obj[key])) {
        tmp[key] = obj[key].map(item => {
          return typeof item === 'string' ? traditional2Simplified(item) : item;
        });
      } else {
        tmp[key] = obj[key];
      }
    }
  }
  return tmp;
};

module.exports = {
  traditional2Simplified,
  objT2S
};
