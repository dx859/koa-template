module.exports = async function(ctx, next) {
  ctx.status = ctx.status !== 404 ? ctx.status : 404;
  ctx.error = ctx.error ? ctx.error : {};

  await ctx.render('404', {
    code: ctx.status,
    title: ctx.error.title,
    message: ctx.error.message
  });
};
