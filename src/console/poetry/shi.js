const fs = require('fs');
const path = require('path');
const config = require('config');
const { objT2S } = require('./utils');
const { traditional2Simplified } = require('./utils');
const db = require('../../utils/db');

db.configure(config.get('dbConfig'));

const shiDir = path.join(config.get('poetryDir'), '/json');
const strainDir = path.join(config.get('poetryDir'), '/strains/json');
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

async function insertPoem(poems, length = 1000) {
  const errors = [];
  let number = 0;
  for (let i = 0; i < length; i++) {
    let poem = poems[i];
    if (!poem) {
      break;
    }
    const { author, paragraphs, strains, title, year_range } = poem;
    try {
      const result = await db.query(
        `insert into p_poem (author, title, year_range) values (?, ?, ?)`,
        [author, title, year_range]
      );
      const id = result.insertId;
      for (let i = 0; i < paragraphs.length; i++) {
        await db.query(
          `insert into p_poem_paragraph (poem_id, paragraph, strain, sort) values (?,?,?,?)`,
          [id, paragraphs[i], strains[i], i]
        );
      }
      poem.insertId = id;

    } catch (e) {

      errors.push(poem);
    }
    number++;
  }
  db.end();
  return [errors, number];
}

function writePoem() {
  let tang = getPoem('tang')
  let song = getPoem('song');
  let all = tang.concat(song);
  all.map(item => {
    item.insertId = null
    return item;
  })
  fs.writeFileSync(path.join(__dirname, './.tmp_all.json'), JSON.stringify(all), 'utf8');
}

function getPoems() {
  let poems = fs.readFileSync(path.join(__dirname, './.tmp_all.json'), 'utf8');
  poems = JSON.parse(poems)
  return poems.filter(item => !item.insertId)
}

async function main(number = 1000) {

  let poems = getPoems();
  const [errors, insertNum] = await insertPoem(poems, number);
  fs.writeFileSync(path.join(__dirname, './.tmp_all.json'), JSON.stringify(poems), 'utf8');
  fs.writeFileSync(path.join(__dirname, './.tmp_error.json'), JSON.stringify(errors), 'utf8');
  fs.writeFileSync(path.join(__dirname, './.tmp_log.json'), JSON.stringify(insertNum), 'utf8');
}

exports.main = main;
exports.writePoem = writePoem
exports.test = (a, b) => {
  console.log(a, b)
}


