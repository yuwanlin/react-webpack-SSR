const axios = require('axios');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const proxy = require('http-proxy-middleware');
const path = require('path');

const serverConfig = require('../../build/webpack.config.server');
const serverRender = require('./server-render');
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  })
}

const NativeModule = require('module');

const vm = require('vm');

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle) // (function(exports, require, module, __filename, __dirname){})
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })

  const result = script.runInThisContext();
  result.call(m.exports, m.exports, require, m);

  return m;
}

const mfs = new MemoryFs();
// const Module = module.constructor;
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
  // const m = new Module();
  // m._compile(bundle, 'server-entry.js'); // compile the string
  const m = getModuleFromString(bundle, 'server-entry.js');
  serverBundle = m.exports;
})

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))

  app.get('*', function (req, res, next) {
    if (!serverBundle) {
      return res.send('waiting for compile, refresh later');
    }
    getTemplate().then(template => {
      return serverRender(serverBundle, template, req, res);
    }).catch(next);
  })
}
