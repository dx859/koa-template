const db = require('../../utils/db');

async function getPoems({ page = 1, pageSize = 10, author, title, word } = {}) {
  let filter = [],
    params = [];
  let countSql = '',
    sql = '';
  if (author) {
    filter.push(`m.author LIKE ?`);
    params.push(`%${author}%`);
  }
  if (title) {
    filter.push(`m.title LIKE ?`);
    params.push(`%${title}%`);
  }
  if (word) {
    filter.push(
      `m.id IN (SELECT p_poem_paragraph.poem_id FROM p_poem_paragraph WHERE p_poem_paragraph.paragraph LIKE ? )`
    );
    params.push(`%${word}%`);
  }

  let where = '';
  if (filter.length > 0) {
    where = `WHERE ${filter.join(' AND ')}`;
  }

  countSql = `SELECT COUNT(id) count FROM p_poem m ${where}`;

  sql = `
  SELECT m.*, GROUP_CONCAT(h.paragraph ORDER BY h.sort SEPARATOR '') content FROM p_poem m
  LEFT JOIN p_poem_paragraph h ON m.id=h.poem_id
  ${where}
  GROUP BY m.id
    `;

  let list = await db.queryPaging(sql, params, { countSql, page, pageSize });
  return list;
}

module.exports = {
  getPoems
};
