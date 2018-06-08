1.publicPath
```
output: {
    filename: '[name]-[hash].js',
    path: path.join(__dirname, '../dist'),
    publicPath:'/public/'
},
```
client配置publicPath旨在添加为所有资源添加一个资源目录。
client使用html-webpack-plugin生成页面，页面自动引用webpack打包后生成的js文件，路径包括publib父级目录。

2.babel
使用babel处理文件。根目录添加.babelrc文件。babel-core包括核心api。babel-preset-env处理es6/7/8文件、babel-preset-react处理jsx。babel-loader整合任务。

3.server
webpack.config.server.js需要就行额外配置。
```
target: 'node'
libraryTarget: 'commonjs2'
```

4.webpack生成的文件在dist目录。

5.通过在命令中添加cross-env NODE_ENV=development设置开发环境。
```
const serverEntry = require('../dist/server-entry').default;
app.use('/public', express.static(path.join(__dirname, '../dist')));

var template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

app.get('*', function(req, res) {
    const appString = reactSSR.renderToString(serverEntry)
    res.send(template.replace('<!-- app -->', appString));
})
```
由于webpack打包生成的文件都在dist目录下，html-webpack-plugin中的js文件会引用public目录。所以通过express对url中的public目录进行映射到dist目录。

服务端渲染需要先获取dist下的index.html文件，然后将其中的<!-- app -->替换成appString. webpack.config.server.js打包后的产物。服务端渲染生成的html和页面中js操作后生成的相同。
这是对于生成了dist目录的情况。

6.HMR (npm run dev:client localhost:8888)
- .babelrc文件中添加"plugins": ["react-hot-loader/babel"]
- webpack.config.client.js的entry添加'react-hot-loader/patch',
- webpack.config.client.js的plugins添加webpack.HotModuleReplacementPlugin()
- devServer中的hot设置为true
- 入口jsx组件添加处理。
```
if(module.hot) {
    module.hot.accept('./App.jsx', () => {
        const NextAPP = require('./App.jsx').default;
        render(NextAPP);
    })
}
```

7.如果用到了webpack-dev-server，那么生成的文件都在内存中这时候要做ssr较为麻烦。主要处理文件在util/dev-statis.js中。
```
const axios = require('axios');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const reactSSR = require('react-dom/server');
const proxy = require('http-proxy-middleware');
const path = require('path');
const serverConfig = require('../../build/webpack.config.server');

const getTemplate = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:8888/public/index.html') //获取生成的html
            .then(res => {
                resolve(res.data);
            })
            .catch(reject);
    })
}

const mfs = new MemoryFs(); //memory-fs和fs接口相同，只不过用于读取内存文件
const Module = module.constructor; //黑科技
let serverBundle;
const serverCompile = webpack(serverConfig); //服务端配置文件->生成处理后的文件
serverCompile.outputFileSystem = mfs;
serverCompile.watch({}, (err, stats) => { // 监听entry
    if(err) throw err;
    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(warn => console.warn(warn));

    const bundlePath = path.join( // 打包后生成的js路径
        serverConfig.output.path,
        serverConfig.output.filename
    );

    const bundle = mfs.readFileSync(bundlePath, 'utf8'); // bundle是string
    const m = new Module();
    m._compile(bundle, 'server-entry.js'); // compile the string生成占用内存server-entry.js的文件
    serverBundle = m.exports.default; // 导出的就是生成的js的bundle
})

module.exports = function(app) {
    
    app.use('/public', proxy({
        target: 'http://localhost:8888' //启动服务器后，访问的文件时3333端口的，代理到8888端口，因为文件时通过webpack生成的，webpack服务器端口是8888
    }))
    
    app.get('*', function(req, res) {
        getTemplate().then(template => {
            const appString = reactSSR.renderToString(serverBundle);
            res.send(template.replace('<!-- app -->', appString));
        })
    })
}
```
这时候仍可以使用hmr(npm run dev:client npm run dev:server localhost:3333)。
