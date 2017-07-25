## 这是一个简单的工具集合
### 集合里面包括 dom操作，ajax请求，日期函数，事件处理，动画相关函数


```markdown

git clone https://github.com/Jankid/utils
yarn install
yarn run dev
直接访问 http://localhost:8060 

```
### 目录结构
```
├── README.md
├── dist // rollup 打包好的可访问文件
│   └── utils.js
├── example // 工具测试的例子文件
│   ├── index.html
│   ├── ajax.html
│   ├── date.html
│   ├── dom.html
│   ├── event.html
│   ├── index.html //首页
│   ├── rem.html
│   └── regex.html
├── src
│   ├── ajax.js
│   ├── animate.js
│   ├── bom.js
│   ├── date.js
│   ├── dom.js
│   ├── event.js
│   ├── regex.js
│   ├── rem.js
│   └── index.js
├── .babelrc
├── .gitignore
├── app.js  //简单静态服务器
├── package.json
├── rollup.config.js
└── yarn.lock
```

