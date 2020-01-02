const { getUser } = require('../auth/authService');

exports.info = async ctx => {
  ctx.body = await getUser(ctx.session.user.id);
};
