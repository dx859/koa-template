const { getPoems } = require('./poemService');
exports.poemList = async ctx => {
  const { author, title, page, pageSize } = ctx.request.body;
  ctx.body = await getPoems(ctx.request.body);
};
