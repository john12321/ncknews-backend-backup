const app = require('express')();
const bodyParser = require('body-parser');
const {
  apiRoute,
} = require('./routes/api_route');

const {
  handle404s,
  handle400s,
  handle422s,
  handle500s,
} = require('./errors');

app.use(bodyParser.json());

app.use('/api', apiRoute);

app.get('/*', (req, res, next) => {
  next({
    status: 404,
  });
});


app.use(handle404s);
app.use(handle400s);
app.use(handle422s);
app.use(handle500s);


module.exports = app;
