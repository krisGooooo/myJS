/*
 * @Author: krisGooooo
 * @Description: Jsonp：利用script没有跨域限制的漏洞，通过script标签指向一个需要访问的地址并提供一个回调函数来接受
 * 数据当需要通讯时
 * @Date: 2019-01-07 22:39:12
 * @LastEditors: krisGooooo
 * @LastEditTime: 2019-01-07 22:46:18
 */
function jsonp(url, jsonpCallback, success) {
  let script = document.createElement('script')
  script.src = url
  script.async = true
  script.type = 'text/javascript'
  window[jsonpCallback] = function(data){
    success && success(data)
  }
  document.body.appendChild(script)
}

jsonp('http://xxx', 'callback', function(value){
  console.log(value)
})