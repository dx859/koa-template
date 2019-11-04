async function errorHanding(ctx, next) {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      status: error.status,
      code: error.code,
      message: error.message
    };
    if ([422, 403].indexOf(ctx.status) === -1) {
      ctx.app.emit('error', error, ctx);
    }
  }
}

module.exports = errorHanding;
