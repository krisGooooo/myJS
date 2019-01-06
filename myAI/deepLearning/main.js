/*
 * @Author: krisGooooo
 * @Description: 基于 tensorflow.js 的一个深度学习demo， 用于计算一个简单的线性回归，一种类似“待定系数”求y=kx+b中的k和b的过程
 * @Date: 2018-12-16 19:17:30
 * @LastEditors: krisGooooo
 * @LastEditTime: 2018-12-16 19:28:23
 */

/**
 * 理解
 * 深度学习是一个趋于精确的过程，不像人类一样一次获得标准结果，需要巨大的训练操作，才能趋于精确
 */
const tf = require("@tensorflow/tfjs");
const model = tf.sequential();

//定义网络结构，层数，单元数，输入
model.add(tf.layers.dense({units: 1, inputShape: [1]}));

//定义优化器
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

//目标：y=2x+1;
const xs = tf.tensor2d([1,2,3,5], [4,1]);
const ys = tf.tensor2d([3,5,7,11], [4,1]);

//使用async是因为训练中有异步操作，需要用到await
(async ()=>{
    //训练1000次
    for(let i=0;i<1000;i++){
        await model.fit(xs,ys);//等待训练的异步操作
        console.log(`第${i}次`);
    }
    model.predict(tf.tensor2d([100], [1, 1])).print();
})();