const axios = require('axios');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const reactDomServer = require('react-dom/server');
const proxy = require('http-proxy-middleware');
const serialize = require('serialize-javascript');
const path = require('path');
const ejs = require('ejs');
const serverConfig = require('../../build/webpack.config.server');
const bootstrapper = require('react-async-bootstrapper');

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  })
}

const mfs = new MemoryFs();
const Module = module.constructor;
let serverBundle, createStoreMap;
const serverCompile = webpack(serverConfig);
serverCompile.outputFileSystem = mfs;
serverCompile.watch({}, (err, stats) => {
  if (err) throw err;
  stats = stats.toJson();
  stats.errors.forEach(err => console.error(err));
  stats.warnings.forEach(warn => console.warn(warn));

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  );

  const bundle = mfs.readFileSync(bundlePath, 'utf8'); // string
  const m = new Module();
  m._compile(bundle, 'server-entry.js'); // compile the string
  serverBundle = m.exports.default;
  createStoreMap = m.exports.createStoreMap;
})

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {})
}

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))

  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const routerContext = {};
      // while ( !createStoreMap ) { //eslint-disable-line

      // }
      console.log(createStoreMap)
      const stores = createStoreMap();
      const app = serverBundle(stores, routerContext, req.url);
      bootstrapper(app).then(() => {
        /**
         * 因为前端使用了Redirect，url查看localhost:3333的源代码是没有重定向过的，所以需要在服务端重定向
         */
        const state = getStoreState(stores);

        if (routerContext.url) {
          res.status(302).setHeader('Location', routerContext.url);
          res.end();
          return;
        }
        const content = reactDomServer.renderToString(app);
        // res.send(template.replace('<!-- app -->', content));
        // content是内容，template是模板文件
        const html = ejs.render(template, {
          appString: content,
          initialState: serialize(state)
        })

        res.send(html);
      })
    })
  })
}
