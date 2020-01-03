const db = require('../../utils/db');
const {array2children} = require("../../utils/common");

async function getMenu() {
  let response = await db.query('SELECT * FROM b_menu');
  return array2children(response)
}


module.exports = {
  getMenu
}
