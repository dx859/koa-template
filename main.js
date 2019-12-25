const fs = require('fs');
const path = require('path');

let controllerPath = process.argv[2];
let params = process.argv.slice(3);

if (typeof controllerPath !== 'string') {
  console.log('请输入参数！')
  return;
}

controllerPath = controllerPath.split('/');
if (controllerPath.length < 2) {
  console.log('参数格式为 poetry/hello')
  return;
}
if (controllerPath.length === 2) {
  controllerPath.push('main')
}

let method = controllerPath.pop();
let execpath = path.join(__dirname, 'src/console', controllerPath.join('/') + '.js');
if (!fs.existsSync(execpath)) {
  console.log(`没有找到文件路径:${execpath}`)
  return;
}

const controller = require(execpath);
if (typeof controller[method] !== 'function') {
  console.log(`文件没有找到 ${method} 方法`)
  return;
}

controller[method](...params)