const app = require('express')();
const bodyParser = require('body-parser');
const {
  apiRouter
} = require('./routers/api_router');
const {
  handle404,
  handle500,
} = require('./errors');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => next({
  status: 404,
  msg: 'Page not found'
}));


app.use(handle404);
app.use(handle500);


module.exports = app;