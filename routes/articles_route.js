const articlesRoute = require('express').Router();
const {
  getAllArticles,
  getArticleById,
  updateVotesById,
  deleteArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  updateCommentVotes,
  deleteCommentById,
} = require('../controllers/articles');
const {
  handle405s,
} = require('../errors');

articlesRoute.param('article_id', (req, res, next) => {
  if (/\d/.test(req.params.article_id)) next();
  else {
    next({
      status: 400,
    });
  }
});

articlesRoute.route('/')
  .get(getAllArticles)
  .all(handle405s);

articlesRoute.route('/:article_id')
  .get(getArticleById)
  .patch(updateVotesById)
  .delete(deleteArticleById)
  .all(handle405s);

articlesRoute.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(handle405s);

articlesRoute.route('/:article_id/comments/:comment_id')
  .patch(updateCommentVotes)
  .delete(deleteCommentById)
  .all(handle405s);

module.exports = articlesRoute;
