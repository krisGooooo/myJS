//  三种状态：等待 成功 失败
const PENDING = "pending"
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
  //  可能会异步执行 获取正确this
  const that = this
  //  Promise初始状态: pending
  that.state = PENDING
  //  保存resolve 或 reject 中传入的值
  that.value = null
  //  执行完 Promise 时状态可能还是pending 这时应该把then中回调保存起来用于
  //  改变状态时使用
  that.resolvedCallbacks = []
  that.rejectedCallbacks = []

  //  resolve函数
  function resolve(value) {
    //  只有pending状态可以改变状态
    if (that.state === PENDING) {
      //  切换状态
      that.state = RESOLVED
      //  传入的值赋给value
      that.value = value
      //  遍历回调数组并执行
      that.resolvedCallbacks.map(cb => cb(that.value))
    }
  }

  //  reject函数
  function reject(value) {
    if (that.state === PENDING) {
      that.state = REJECTED
      that.value = value
      that.rejectedCallbacks.map(cb => cb(that.value))
    }
  }

  //  执行Promise中传入的函数
  try {
    //  执行传入的参数并且将之前两个函数当作参数传进去
    fn(resolve, reject)
  } catch (e) {
    //  执行函数可能会遇到错误 需要捕获错误 并且执行 reject函数
    reject(e)
  }

}
//  实现 then 函数
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const that = this
  //  判断辆参数是否是函数类型（可选）,若不是函数类型，则创建一个函数赋值，实现透传
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
  onRejected = typeof onRejected === 'function' ? onRejected : r => {
    throw r
  }
  //  判断状态 若是pending 状态 则往回调函数中push函数
  if (that.state === PENDING) {
    that.resolvedCallbacks.push(onFulfilled)
    that.rejectedCallbacks.push(onRejected)
  }
  //  判断状态 若不是pending 则去执行响应的函数
  if (that.state === RESOLVED) {
    onFulfilled(that.value)
  }
  if (that.state === REJECTED) {
    onRejected(that.value)
  }
}

//  例子
new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 0)
}).then(value => {
  console.log(value)
})
