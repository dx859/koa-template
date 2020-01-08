const post = require('./postService');

exports.list = async ctx => {
  ctx.body = await post.getPostList({
    condition: 'user_id=?',
    params: [ctx.session.user.id],
    page: ctx.query.page,
    pageSize: ctx.query.pageSize
  });
};

exports.detail = async ctx => {
  let { id } = ctx.validate(
    { id: { required: true, type: 'number' } },
    ctx.params
  );

  let response = await post.getPost({
    condition: 'id=? AND user_id=?',
    params: [id, ctx.session.user.id]
  });

  if (!response) {
    ctx.throw(404, '没有找到文章');
  }
  ctx.body = response;
};

exports.delete = async ctx => {
  let { id } = ctx.validate(
    { id: { required: true, type: 'number' } },
    ctx.params
  );

  let response = await post.deletePost({
    condition: 'id=? AND user_id=?',
    params: [id, ctx.session.user.id]
  });

  if (!response) {
    ctx.throw(404, '没有找到文章');
  }
  ctx.body = {
    message: '删除成功！'
  };
};

exports.create = async ctx => {
  let data = ctx.validate({
    content: { required: true },
    title: { required: true, max: 32 },
    post_category_id: {}
  });

  ctx.body = {
    id: await post.createPost({ ...data, user_id: ctx.session.user.id })
  };
};

exports.update = async ctx => {
  let data = ctx.validate({
    content: { required: true },
    title: { required: true, max: 32 },
    post_category_id: {}
  });
  let response = await post.updatePost({
    data: data,
    condition: `id=? AND user_id=?`,
    params: [ctx.params.id, ctx.session.user.id]
  });
  if (!response) {
    ctx.throw(404, '没找到更新的文章');
  }
  ctx.body = {
    message: '更新成功！'
  };
};

exports.treeList = async ctx => {
  ctx.body = await post.getTreeList({
    condition: 'user_id=?',
    attrs: ['id', 'parent_id', 'title'],
    params: [ctx.session.user.id]
  });
};
