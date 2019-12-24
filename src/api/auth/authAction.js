const auth = require('./authService');
const { getAttrs } = require('../../utils/common');

exports.signIn = async ctx => {
  const params = ctx.validate({
    username: { required: true, name: '用户名' },
    password: { required: true, name: '密码' }
  });

  let user = await auth.login(params);
  if (!user) {
    ctx.throw(422, '用户名密码错误');
  }
  ctx.session.user = getAttrs(user, ['id', 'username', 'email']);
  ctx.body = user;
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

  let userId = await auth.register(params);
  let user = await auth.getUser(userId);

  ctx.session.user = getAttrs(user, ['id', 'username', 'email']);
  ctx.body = user;
};
