const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const serverRender = require('./util/server-render');

const isDev = process.env.NODE_ENV === 'development';

const app = express();
app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended: false })); // 表单请求 req.body
app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'cnode app' // 加密cookie
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')));

app.use('/api/user', require('./util/handle-login'));
app.use('/api', require('./util/proxy'));

if (!isDev) {
  const serverEntry = require('../dist/server-entry');
  app.use('/public', express.static(path.join(__dirname, '../dist')));

  var template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8');

  app.get('*', function (req, res, next) {
    // const appString = reactSSR.renderToString(serverEntry)
    // res.send(template.replace('<!-- app -->', appString));
    serverRender(serverEntry, template, req, res).catch(next);
  })
} else {
  const devStatic = require('./util/dev-static');
  devStatic(app);
}

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send(err);
})

app.listen(3333, function () {
  console.log('app is listening on port 3333');
})
