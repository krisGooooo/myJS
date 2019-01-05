/*
 * @Author: krisGooooo
 * @Description: 手写new 和instanceof
 * @Date: 2019-01-05 10:44:40
 * @LastEditors: krisGooooo
 * @LastEditTime: 2019-01-05 11:43:23
 */

//  new函数
function create(){
  //  新生成一个对象
  let obj = {}
  //  获取对象
  let Con = [].shift.call(arguments)
  //  设置空对象的原型
  obj._proto_ = Con.prototype
  //  绑定this并执行构造函数
  let result = Con.apply(obj, arguments)
  //  确保返回值为对象
  return result instanceof Object ? result : obj
}

//  instanceOf函数
function myInstanceof(left, right) {
  //  获取类型的原型
  let prototype = right.prototype
  //  获得对象的原型
  left = left._proto_
  //  循环判断对象的原型链，直到对象原型为null
  while (true) {
    if(left === null || left === undefined){
      return false
    }
    if(prototype === left){
      return true
    }
    left = left._proto_
  }
}