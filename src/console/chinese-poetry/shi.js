const fs = require('fs');
const path = require('path');
const { objT2S } = require('./utils');
const { traditional2Simplified } = require('./utils');
const db = require('../../utils/db');
db.configure({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'poetry',
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0
});
const shiDir = 'D:/workspace/koa/chinese-poetry-master/json';
const strainDir = 'D:/workspace/koa/chinese-poetry-master/strains/json';
function getAuthors(type = 'tang') {
  let tang = fs.readFileSync(
    path.join(shiDir, `authors.${type}.json`),
    'utf-8'
  );

  tang = JSON.parse(tang).map(item => {
    item.year_range = type.substr(0, 1);
    return item;
  });

  return tang.map(item => ({
    desc: traditional2Simplified(item.desc),
    name: traditional2Simplified(item.name),
    uuid: item.id,
    year_range: item.year_range
  }));
}

function sortUtil(prevfile, file) {
  let prevnumber = prevfile.substring(10, prevfile.indexOf('.json'));
  let number = file.substring(10, file.indexOf('.json'));
  return prevnumber * 1 - number * 1;
}

function getPoem(type = 'tang') {
  let poems = [];
  let files = fs.readdirSync(shiDir);
  let strains = fs.readdirSync(strainDir);
  files = files
    .filter(file => file.indexOf(`poet.${type}`) > -1)
    .sort(sortUtil);
  strains = strains
    .filter(file => file.indexOf(`poet.${type}`) > -1)
    .sort(sortUtil);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const strain = strains[i];
    let content = fs.readFileSync(path.join(shiDir, file), 'utf-8');
    let strainContent = fs.readFileSync(path.join(strainDir, strain), 'utf-8');
    content = JSON.parse(content);
    strainContent = JSON.parse(strainContent);
    content = content.map((item, i) => {
      const tmp = objT2S(item);
      tmp.year_range = type.substr(0, 1);
      if (strainContent[i].id !== item.id) {
        throw Error(item.id);
      }
      tmp.strains = strainContent[i].strains;
      return tmp;
    });
    poems = poems.concat(content);
  }

  return poems;
}

async function insertPoem(poems) {
  const errors = [];
  for (let i = 0; i < poems.length; i++) {
    let poem = poems[i];
    const { author, paragraphs, strains, title, year_range } = poem;
    try {
      const result = await db.query(
        `insert into poem (author, title, year_range) values (?, ?, ?)`,
        [author, title, year_range]
      );
      const id = result.insertId;
      for (let i = 0; i < paragraphs.length; i++) {
        await db.query(
          `insert into poem_paragraph (poem_id, paragraph, strain, sort) values (?,?,?,?)`,
          [id, paragraphs[i], strains[i], i]
        );
      }
      console.log(i);
    } catch (e) {
      console.log(e);
      errors.push(poem);
    }
  }
  db.end();
  return errors;
}

async function main() {
  let errors = await insertPoem(getPoem('song'));
  if (errors.length > 0) {
    fs.writeFileSync('./error.json', JSON.stringify(errors), 'utf8');
  }
}

module.exports = main;
if (!module.parent) main();
