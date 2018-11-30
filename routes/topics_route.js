const topicsRoute = require('express').Router();
const {
  getAllTopics,
  postNewTopic,
  getArticlesByTopic,
  postArticleByTopic,
} = require('../controllers/topics');

const {
  handle405s,
} = require('../errors');

topicsRoute.route('/')
  .get(getAllTopics)
  .post(postNewTopic)
  .all(handle405s);

topicsRoute.route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(postArticleByTopic)
  .all(handle405s);

module.exports = topicsRoute;
