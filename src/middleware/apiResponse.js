module.exports = async function(ctx, next) {
  await next();

  ctx.body = {
    success: true,
    data: ctx.body
  };
};
