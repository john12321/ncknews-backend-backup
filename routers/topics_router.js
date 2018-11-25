const topicsRouter = require('express').Router();
const {
  getTopics,
  postTopic,
  getArticles,
  postArticle,
} = require('../controllers/topics_ctrl');


const {
  handle405s,
} = require('../errors');

topicsRouter.param('topic', (req, res, next, topic) => {
  if (typeof topic === 'string') {
    next({
      status: 400,
      msg: 'Bad Request',
    });
  }
});


topicsRouter
  .route('/')
  .get(getTopics)
  .post(postTopic)
  .all(handle405s);

topicsRouter
  .route('/:topic/articles')
  .get(getArticles)
  .post(postArticle)
  .all(handle405s);

module.exports = topicsRouter;
