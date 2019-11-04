const auth = require('../services/auth');

exports.signIn = async ctx => {
  ctx.body = await auth.users();
};

exports.signUp = async ctx => {
  const params = ctx.validate({
    username: { required: true, min: 2, max: 32, name: '用户名' },
    password: { required: true, min: 6, max: 16, name: '密码' },
    email: { required: true, email: true, name: '邮箱' }
  });

  if (!(await auth.unique('username', params.username))) {
    ctx.throw(422, '用户名已存在');
  }

  if (!(await auth.unique('email', params.email))) {
    ctx.throw(422, '邮箱已存在');
  }

  ctx.body = {
    response: await auth.register(params)
  };
};
