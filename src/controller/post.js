const post = require('../services/post');

exports.list = async ctx => {
  ctx.body = await post.getPostList({
    condition: 'user_id=?',
    params: [ctx.session.user.id],
    page: ctx.query.page,
    pageSize: ctx.query.pageSize
  });
};
