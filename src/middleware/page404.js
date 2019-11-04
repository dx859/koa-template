module.exports = async function(ctx, next) {
  ctx.status = ctx.status !== 404 ? ctx.status : 404;
  ctx.error = ctx.error ? ctx.error : {};

  ctx.body = {
    code: 404,
    message: ctx.error.message,
    error: ctx.error
  };
};
