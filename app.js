const app = require('express')();
const bodyParser = require('body-parser');
const {
  apiRouter
} = require('./routers/api_router');
const {
  handle404s,
  handle500s,
} = require('./errors');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => next({
  status: 404,
  msg: 'Page not found'
}));


app.use(handle404s);
app.use(handle500s);


module.exports = app;