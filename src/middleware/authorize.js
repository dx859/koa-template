module.exports = async function(ctx, next) {
  if (ctx.session.user && ctx.session.user.id) {
    await next();
  } else {
    ctx.throw(500, '你没有权限访问此页面', { code: 110000 });
  }
};
