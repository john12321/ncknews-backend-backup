const db = require('../db/connection');

exports.getArticles = (req, res, next) => {
  const {
    p = 1, limit, order, sort_by = 'created_at',
  } = req.query;

  db('article')
    .select(
      'username AS author',
      'title',
      'article.article_id',
      'article.votes',
      'article.created_at',
      'topic',
    )
    .limit(limit || 10)
    .offset((p - 1) * limit)
    .orderBy(sort_by || 'created_at', order || 'desc')
    .join('user', 'user.user_id', '=', 'article.user_id')
    .leftJoin('comment', 'comment.article_id', '=', 'article.article_id')
    .groupBy('article.article_id', 'user.username')
    .count('comment.comment_id AS comment_count')
    .then((articles) => {
      if (articles.length === 0) {
        next({
          code: 'No article',
        });
      } else if (articles.length === 1) {
        res.send({
          article: articles[0],
        });
      } else {
        res.send({
          articles,
        });
      }
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  db('article')
    .select('article.article_id', 'user.username AS author', 'article.created_at', 'article.title', 'article.topic', 'article.votes')
    .leftJoin('comment', 'comment.article_id', '=', 'article.article_id')
    .leftJoin('user', 'user.user_id', '=', 'article.user_id')
    .where('article.article_id', article_id)
    .groupBy('article.article_id', 'user.username')
    .count('comment.comments_id AS comment_count')
    .then((article) => {
      if (article.length === 0) {
        next({
          code: 'No article',
        });
      }
      if (article.length > 0) res.status(200).send(article[0]);
      else {
        next({
          status: 400,
        });
      }
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  const {
    inc_votes,
  } = req;
  if (inc_votes && typeof inc_votes !== 'number') {
    next({
      code: '22P02'
    })
  }

  if (typeof inc_votes === 'string') {
    next({
      code: 42703,
    });
  }

  return db('article')
    .select()
    .where('article.article_id', req.params.article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then((
      article
    ) => {
      if (article.length === 0) {
        next({
          code: 'No article',
        });
      } else {
        return res.status(202).send({
          article: article[0]
        });
      }
    })
    .catch(next);
};



exports.deleteArticle = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  db('article')
    .where('article.article_id', '=', article_id)
    .del()
    .then((delArticle) => {
      res.status(202).send({
        delArticle,
      });
    });
};