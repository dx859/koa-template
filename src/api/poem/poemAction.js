const {getPoems} = require("./poemService");
exports.poemList =async  (ctx)=>{
  ctx.body = await getPoems()
}
