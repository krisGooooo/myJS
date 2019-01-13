/*
 * @Author: krisGooooo
 * @Description: 
 * 一个依靠 Babel 实现的一个 mini 打包工具 
 * 功能：
 * 1. 将 ES6 转为 ES5 
 * @Date: 2019-01-13 21:47:53
 * @LastEditors: krisGooooo
 * @LastEditTime: 2019-01-13 22:09:24
 */
const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core')

/**
 * @msg: 使用 Babel 转换代码 返回一个obj：文件路径 依赖关系数组 转为ES5的代码
 * @param {string} 
 * @return: obj(filePath, dependencies, code)
 */
function readCode(filePath) {
  //  读取文件内容
  const content = fs.readFileSync(filePath, 'utf-8')
  //  生成AST
  const ast = babylon.parse(content, {
    sourceType: 'module'
  })
  //  寻找当前文件的依赖关系
  const dependencies = []
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      //  加入依赖
      dependencies.push(node.source.value)
    }
  })
  //  通过 AST 抽象语法树
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })
  
  return {
    filePath,
    dependencies,
    code
  }
}