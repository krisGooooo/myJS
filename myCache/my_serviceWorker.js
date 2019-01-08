/*
 * @Author: krisGooooo
 * @Description: service Worker 是浏览器背后的独立线程，必须用https
 * 步骤
 * 1. 首先需要先注册service worker
 * 2. 监听到install事件以后就可以缓存
 * 3. 下次访问时候通过拦截请求方式查询是否存在缓存
 * @LastEditors: krisGooooo
 * @LastEditTime: 2019-01-08 21:30:38
 * @LastEditTime: 2019-01-08 21:31:41
 */

//  index.js
if(navigator.serviceWorker){
  navigator.serviceWorker
    .register('demo.js')
    .then(function(registration){
      console.log('service worker 注册成功')
    })
    .catch(function(err){
      console.log('service worker 注册失败')
    })
}

//  demo.js
//  监听install 事件，回调缓存所需文件
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('my-cache').then(function(cache){
      return cache.addAll(['./index.html', './index.js'])
    })
  )
})
//  拦截所有请求事件
//  如果缓存中已经有请求的数据就直接用缓存 否则请求数据
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(function(response){
      if(response){
        return response
      }
      console.log('fetch source')
    })
  )
})