/*
 * @Author: krisGooooo
 * @Description: 基于 synaptic 的神经网络 学习xor
 * 我们的网络将使用 sigmoid 神经元，不管给定任何输入，都会输出 0 或者 1。
 * 每次预测之后，根据预测的错误，调整权重和偏差值，以便网络在下一次会更准确地猜测。这种学习过程称为 backpropagation（反向传播）。
 * @Date: 2018-12-16 20:07:47
 * @LastEditors: krisGooooo
 * @LastEditTime: 2018-12-17 14:56:46
 */

 // dxwang@shou.edu.cn

var synaptic = require('synaptic'); 
var Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
  Architect = synaptic.Architect;
  
//创建图层
var inputLayer = new Layer(2);
var hiddenLayer = new Layer(3);
var outputLayer = new Layer(1);

//将这些层连接在一起并实例化一个新的网络，做一个2 - 3 - 1 的网络
inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

var myNetwork = new Network({
 input: inputLayer,
 hidden: [hiddenLayer],
 output: outputLayer
});

// 训练网络 学习XOR

// 反向传播时候 告诉网络每次应该调整多少权重
var learningRate = .3;

// 运行20000次 传递可能的四个输入，
for (var i = 0; i < 20000; i++) {
  // 0,0 => 0 正向传播，激活网络
  myNetwork.activate([0,0]);
  // 每次向前传播之后，我们需要进行反向传播，网络会更新权重和偏差 0 表示输入0，0时候正确的输出。
  // 之后网络将自己的预测与正确的标签进行比较，然后就知道什么是对的了
  // 这个比较将作为校正权重和偏差值的基础，以便下次猜测会更准确一些。
  myNetwork.propagate(learningRate, [0]);

  // 0,1 => 1
  myNetwork.activate([0,1]);
  myNetwork.propagate(learningRate, [1]);

  // 1,0 => 1
  myNetwork.activate([1,0]);
  myNetwork.propagate(learningRate, [1]);

  // 1,1 => 0
  myNetwork.activate([1,1]);
  myNetwork.propagate(learningRate, [0]);
}


console.log(myNetwork.activate([0,0])); 
console.log(myNetwork.activate([0,1]));
console.log(myNetwork.activate([1,0]));
console.log(myNetwork.activate([1,1]));