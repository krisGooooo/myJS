/*
 * @Author: krisGooooo
 * @Description: 我的手写call apply bind函数
 * @Date: 2019-01-05 09:29:03
 * @LastEditors: krisGooooo
 * @LastEditTime: 2019-01-05 10:01:34
 */

Function.prototype.myCall = function(context){
  //  判断mycall 调用者 是函数
  if(typeof this !== 'function'){
    throw new TypeError('Type Error')
  }
  //  context为可选参数 如果不传默认上下文为window
  context = context || window
  //  给context 增加一个fn属性 设置为调用函数 设定context为函数作用域
  context.fn = this
  //  call 可以传入多个参数 需要将参数剥离
  const args = [...this.arguments].slice(1)
  //  调用函数
  const result = context.fn(...args)
  //  删除释放函数
  delete context.fn
  return result
}

Function.prototype.myApply = function(context){
  if(typeof this !== 'function'){
    throw new TypeError('Type Error')
  }
  context = context || window
  context.fn = this
  let result
  //  apply 不会有多个参数 
  if(this.arguments[1]){
    result = context.fn(...this.arguments)
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}

Function.prototype.myBind = function(context){
  if(typeof this !== 'function'){
    throw new TypeError('Error')
  }
  const _this = this
  const args = [...this.arguments].slice(1)
  //  bind返回一个函数
  return function F(){
    //  因为返回一个函数 因此可以new F() 需要判断
    if (this instanceof F){
      //  new的情况 不回被任何方式改变this，所以需要忽略传入的this
      return new _this(...args, ...arguments)
    }
    //  直接调用
    return _this.apply(context, args.concat(...arguments))
  }
}