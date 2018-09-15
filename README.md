# 这是一个nodejs实现的crawler
## nodejs模块用处：
### http模块
用于获取指定url的html文件

### cheerio模块
实现在nodejs中像jQuery一样操作DOM

### fs模块
用于下载爬取到的数据并解析成JSON格式，以及下载各电影封面图片到指定路径

### promise模块
将多层异步callback变为链式callback，在所有promise对象都异步完成时触发then

## 使用说明：
需要先安装依赖:
```
npm install cheerio bluebird
```

再在Git Bash或其他命令行工具使用node运行：
```
node doubanHot250.js
```
