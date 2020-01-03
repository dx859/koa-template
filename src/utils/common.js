const getAttrs = (obj, attributes) => {
  let tmp = {};
  attributes.forEach(key => {
    tmp[key] = obj[key];
  });
  return tmp;
};


function array2children(array,parent_id = null){

  return array.filter(item=>item.parent_id === parent_id).map(item=>{
    item.children = array2children(array, item.id)

    return item
  })
}

module.exports ={
  getAttrs,
  array2children,
}
