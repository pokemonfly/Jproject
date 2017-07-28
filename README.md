# 技术栈
- ES6 及以上
- React
- Redux
- Sass
- ANTD
- redux-form 表单自动绑定
- ....


# 目录结构
```
.
├─api           Mock 模拟用的数据
├─dist        打包后的资源      
├─conf      开发用服务器 & 配置
├─src           
│  ├─assets                 项目中用到的资料文档
│  ├─containers         容器组件
│  │  └─shared              共通组件
│  │  └─xxx                xxx业务模块
│  │      ├─components       业务表现组件
│  │      │  └─xxxa.js                
│  │      │  └─xxxa.sass    
│  │      └─index.js                 
│  │      └─style.sass                 
│  │      └─actions.js
│  │      └─reducer.js
│  ├─layouts              单页面的框架
│  ├─redux                 redux 相关配置  store reducer
│  │  └─middleware   redux扩展的中间件
│  ├─routes                 路由
│  │  └─reducers.js    reducer注册
│  ├─static                 不参与编译的静态脚本 用于临时需要注入的逻辑
│  └─styles                 共通样式
│  └─utils                 函数
│  └─app.js                入口
│  └─index.js              入口页面
└─tests                     测试相关（预留）
```
#中间件使用

- thunkMiddleware： dispatch 就是通过他提供的。
- createLogger：Action的日志打印，开发时不用你在通过大量的 console 来调试了。
- promiseMiddleware：Promise转换中间件，把三种状态分成3中Action，非常好用。
- afterApiMiddleware：自定义中间件，作为过滤器，处理一些通用逻辑。



#todos
*按需加载
*mock
