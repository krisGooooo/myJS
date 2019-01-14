/*
 * @Author: krisGooooo
 * @Description: 
 * 一个依靠 Babel 实现的一个 mini 打包工具 
 * 功能：
 * 1. 将 ES6 转为 ES5 
 * @Date: 2019-01-13 21:47:53
 * @LastEditors: krisGooooo
 * @LastEditTime: 2019-01-14 22:54:24
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

/**
 * @msg: 分析入口文件的依赖 识别 JS 和 CSS 文件
 * @param {obj} 
 * @return: arr(obj)
 */
function getDependencies(entry) {
  //  读取入口文件
  const entryObject = readCode(entry)
  //  存储代码中涉及到的所有文件
  const dependencies = [entryObject]
  //  便利所有文件依赖关系 如果文件有依赖其他文件 就会被push 到这个数组中
  for (const asset of dependencies) {
    //  获得文件目录
    const dirname = path.dirname(asset.filePath)
    //  遍历当前文件依赖关系
    asset.dependencies.forEach(relativePath => {
      //  获得文件的绝对路径
      const absolutePath = path.join(dirname, relativePath)
      //  Css 文件就是将代码插入到新生成的 style 标签里
      if(/\.css/.test(absolutePath)) {
        const content = fs.readFileSync(absolutePath, 'utf-8')
        const code = `
          const style = document.createElement('style')
          style.innerText = ${JSON.stringify(content).replace(/\\r\\n/g, '')}
          document.head.appendChild(style)
        `
        dependencies.push({
          filePath: absolutePath,
          relativePath,
          dependencies: [],
          code
        })
      } else {
        //  JS代码需要继续查找是否有依赖关系
        const child = readCode(absolutePath)
        child.relativePath = relativePath
        dependencies.push(child)
      }
    })
  }
  return dependencies
}

/**
 * @msg: 打包函数
 * @param {arr(obj), string} 
 * @return: 
 */
function bundle(dependencies, entry) {
  let modules = ''
  //  构建函数参数 生成的结构
  //  { './entry.js': function(module, exports, require) { 代码 } }
  dependencies.forEach(dep => {
    const filePath = dep.relativePath || entry
    modules += `'${filePath}': (
      function (module, exports, require) {
        ${dep.code}
      }
    )`
  })
  //  构建 require 函数 目的时为了获取模块暴露的内容
  const result = `
    (function(modules) {
      function require(id) {
        const module = { exports : {}}
        modules[id](module, module.exports, require)
        return module.exports
      }
      require('${entry}')
    })(${modules})
  `
  //  当生成的内容写入到文件中
  fs.writeFileSync('./bundle.js', result)
}