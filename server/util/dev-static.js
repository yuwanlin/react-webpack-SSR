const axios = require('axios');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const reactSSR = require('react-dom/server');
const proxy = require('http-proxy-middleware');
const path = require('path');
const serverConfig = require('../../build/webpack.config.server');

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  })
}

const mfs = new MemoryFs();
const Module = module.constructor;
let serverBundle;
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
})

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))

  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const appString = reactSSR.renderToString(serverBundle);
      res.send(template.replace('<!-- app -->', appString));
    })
  })
}
