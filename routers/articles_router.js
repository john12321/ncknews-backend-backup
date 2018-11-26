const articlesRouter = require('express').Router();

const {
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articles_ctrl');
const {
  handle405s,
} = require('../errors');

articlesRouter.param('article_id', (req, res, next, article_id) => {
  if (!/^\d+$/.test(article_id)) {
    next({
      code: '22P02',
    });
  } else
    next();
});

articlesRouter
  .route('/')
  .get(getArticles)
  .all(handle405s);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(updateArticle)
  .delete(deleteArticle)
  .all(handle405s);

// articlesRouter
//   .route('/:article_id/comments')
//   .get(getComments)

module.exports = articlesRouter;