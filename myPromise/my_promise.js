/*
 * @Author: krisGooooo
 * @Description: 简单的按照 Promise/A+ 规范修改
 * @Date: 2019-01-02 21:34:29
 * @LastEditors: krisGooooo
 * @LastEditTime: 2019-01-03 21:58:42
 */

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
    //  resolve函数 首先需要判断传入的值是否为 Promise 类型
    if (value instanceof MyPromise) {
      return value.then(resolve, reject)
    }
    //  js event loop 保证函数执行顺序
    setTimeout(() => {
      //  只有pending状态可以改变状态
      if (that.state === PENDING) {
        //  切换状态
        that.state = RESOLVED
        //  传入的值赋给value
        that.value = value
        //  遍历回调数组并执行
        that.resolvedCallbacks.map(cb => cb(that.value))
      }
    }, 0)
  }

  //  reject函数
  function reject(value) {
    setTimeout(() => {
      if (that.state === PENDING) {
        that.state = REJECTED
        that.value = value
        that.rejectedCallbacks.map(cb => cb(that.value))
      }      
    }, 0)
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
  let promise2
  //  判断状态 若是pending 状态 则往回调函数中push函数
  if (that.state === PENDING) {
    //  每个then函数都需要返回一个新的Promise对象，该对象用于保存新的返回对象
    return (promise2 = new MyPromise((resolve, reject) => {
      that.resolvedCallbacks.push(() => {
        try {
          //  规范规定 执行onFulfilled 或 onRejected 函数会返回一个x
          const x = onFulfilled(that.value)
          //  执行promise 解决过程 为了不同的promise都可以兼容使用
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)          
        }
      })
      
      that.rejectedCallbacks.push(() => {
        try {
          const x = onRejected(that.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)
        }
      })
    }))
  }
  //  判断状态 若不是pending 则去执行响应的函数
  if (that.state === RESOLVED) {
    return (promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onFulfilled(that.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (reason) {
          reject(reason)
        }
      })
    }))
  }
  if (that.state === REJECTED) {
    return (promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onRejected(that.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (reason) {
          reject(reason)
        }
      })
    }))
  }
}

function resolutionProcedure(promise2, x, resolve, reject) {
  //  规定x 不能于 promise2 相等，否则会发生循环引用的问题
  if (promise2 === x){
    return reject(new TypeError('Error'))
  }
  //  判断x的类型 若x为Promise
  //  1. 若 x 处于等待态 Promise 需保持为等待态直至 x 被执行或拒绝
  //  2. 若 x 处于其他状态 则用相同的值处理 Promise
  if (x instanceof MyPromise) {
    x.then(function(value) {
      resolutionProcedure(promise2, value, resolve, reject)
    }, reject)
  }
  //  判断是否已经调用过函数
  let called = false
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolutionProcedure(promise2, y, resolve, reject)
          },
          e => {
            if (called) return
            called = true
            reject(e)
          }
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
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
