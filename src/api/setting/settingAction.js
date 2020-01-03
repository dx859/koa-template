const {getMenu} = require("./settingService");


exports.menu = async (ctx)=>{
  ctx.body = await getMenu()
}
