const apiRoute = require('express').Router();
const {
  getApiEndpoints,
} = require('../controllers/api_endpoints');
const topicsRoute = require('./topics_route');
const usersRoute = require('./users_route');
const articlesRoute = require('./articles_route');
const {
  handle405s,
} = require('../errors');

apiRoute
  .route('/')
  .get(getApiEndpoints)
  .all(handle405s);

apiRoute.use('/topics', topicsRoute);
apiRoute.use('/users', usersRoute);
apiRoute.use('/articles', articlesRoute);


module.exports = {
  apiRoute,
};
