const express = require('express');
const reactSSR = require('react-dom/server');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');

const isDev = process.env.NODE_ENV === 'development';

const app = express();
app.use(favicon(path.join(__dirname, '../favicon.ico')));
if (!isDev) {
  const serverEntry = require('../dist/server-entry').default;
  app.use('/public', express.static(path.join(__dirname, '../dist')));

  var template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

  app.get('*', function (req, res) {
    const appString = reactSSR.renderToString(serverEntry)
    res.send(template.replace('<!-- app -->', appString));
  })
} else {
  const devStatic = require('./util/dev-static');
  devStatic(app);
}

app.listen(3333, function () {
  console.log('app is listening on port 3333');
})
