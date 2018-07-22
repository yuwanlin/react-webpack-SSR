const serialize = require('serialize-javascript');
const ejs = require('ejs');
const bootstrapper = require('react-async-bootstrapper');
const reactDomServer = require('react-dom/server');
const Helmet = require('react-helmet').default;
const SheetsRegistry = require('react-jss').SheetsRegistry;
const colors = require('@material-ui/core/colors');
const createMuiTheme = require('@material-ui/core/styles').createMuiTheme;
const createGenerateClassName = require('@material-ui/core/styles').createGenerateClassName;

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {})
}

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap;
    const createApp = bundle.default;
    const routerContext = {};
    const stores = createStoreMap();
    const sheetsRegistry = new SheetsRegistry();
    const theme = createMuiTheme({
      palette: {
        primary: colors.lightBlue,
        secondary: colors.pink,
        type: 'light'
      }
    })
    const generateClassName = createGenerateClassName();
    const app = createApp(stores, routerContext, sheetsRegistry, generateClassName, theme, req.url);
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

      const helmet = Helmet.rewind(); // HelmetExport.renderStatic = HelmetExport.rewind;
      const content = reactDomServer.renderToString(app);
      // res.send(template.replace('<!-- app -->', content));
      // content是内容，template是模板文件
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString()
      })

      res.send(html);

      resolve();
    }).catch(reject);
  })
}
