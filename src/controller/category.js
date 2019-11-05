const postCategory = require('../services/postCategory');

exports.index = async ctx => {
  ctx.body = await postCategory.getList();
};

exports.create = async ctx => {
  let data = ctx.validate({
    name: { required: true, max: 30 }
  });
  let hasName = await postCategory.hasPostCategory({
    key: 'name',
    value: data.name
  });

  if (hasName) {
    ctx.throw(500, '该分类已存在');
  }
  ctx.body = {
    id: await postCategory.create(data)
  };
};

exports.update = async ctx => {
  let data = ctx.validate({
    name: { required: true, max: 30 }
  });
  let id = ctx.params.id;
  let response = await postCategory.update({ data, id });
  if (!response) {
    ctx.throw(500, '没找到该分类');
  }
  ctx.body = {
    message: '更新成功！'
  };
};

exports.delete = async ctx => {
  let id = ctx.params.id;
  let response = await postCategory.delete({ condition: 'id=?', params: [id] });
  if (!response) {
    ctx.throw(500, '没找到该分类');
  }
  ctx.body = {
    message: '删除成功！'
  };
};
