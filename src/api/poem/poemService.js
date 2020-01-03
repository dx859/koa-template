const db = require('../../utils/db');

async function getPoems({page= 1, pageSize= 10}={}) {
  const sql =`
   SELECT m.*, GROUP_CONCAT(h.paragraph ORDER BY h.sort SEPARATOR '') content FROM p_poem m
LEFT JOIN p_poem_paragraph h ON m.id=h.poem_id
GROUP BY m.id
  `
  const countSql = `SELECT count(id) count FROM p_poem`
  let list = await db.queryPaging(sql,[], {countSql, page, pageSize});
  return list
}

module.exports ={
  getPoems
}
