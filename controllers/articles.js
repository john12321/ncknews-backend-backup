const db = require('../db/connection');

exports.getAllArticles = (req, res, next) => {
  const {
    limit,
    sort_by,
    sort_ascending = false,
    p = 1,
  } = req.query;
  return db('articles')
    .select('articles.article_id', 'title', 'articles.votes', 'articles.created_at', 'topic', 'users.username as author')
    .join('users', 'articles.user_id', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .groupBy('users.username')
    .count('comments as comment_count')
    .limit(limit || 10)
    .orderBy(sort_by || 'created_at', sort_ascending ? 'asc' : 'desc')
    .offset((p - 1) * limit)
    .then((articles) => {
      if (articles.length === 0) {
        return next({
          status: 404,
          message: 'Page not found',
        });
      }
      return res.status(200).send({
        articles,
      });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  return db('articles')
    .select('articles.article_id', 'title', 'body', 'articles.votes', 'articles.created_at', 'topic', 'users.username as author')
    .where('articles.article_id', article_id)
    .join('users', 'articles.user_id', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments as comment_count')
    .groupBy('articles.article_id')
    .groupBy('users.username')
    .then((article) => {
      if (article.length === 0) {
        return next({
          status: 404,
          message: 'Page not found',
        });
      }
      return res.status(200).send({
        article: article[0],
      });
    })
    .catch(next);
};

exports.updateVotesById = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  const {
    inc_votes = 0,
  } = req.body;
  return db('articles')
    .where('articles.article_id', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then((article) => {
      if (article.length === 0) {
        return next({
          status: 404,
          message: 'No article',
        });
      }
      return res.send({
        article: article[0],
      });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  return db('articles')
    .where('articles.article_id', article_id)
    .del()
    .returning('*')
    .then((deleted) => {
      if (deleted.length === 0) {
        return next({
          status: 404,
        });
      }
      return res.status(204).send({
        user: {},
      });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  const {
    limit,
    sort_by,
    sort_ascending,
    p = 1,
  } = req.query;
  return db('comments')
    .select('comments.comment_id', 'comments.votes', 'comments.created_at', 'comments.body', 'users.username as author')
    .rightJoin('articles', 'comments.article_id', 'articles.article_id')
    .join('users', 'articles.user_id', 'users.user_id')
    .groupBy('articles.article_id')
    .groupBy('users.username')
    .groupBy('comments.comment_id')
    .where('articles.article_id', article_id)
    .limit(limit || 10)
    .orderBy(sort_by || 'created_at', sort_ascending ? 'asc' : 'desc') 
    .offset((p - 1) * limit)
    .then((comments) => {
      if (comments.length === 0) {
        return next({
          status: 404,
        });
      }
      return res.status(200).send({
        comments,
      });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  const {
    body,
    user_id,
  } = req.body;

  if (!body || !user_id) {
    return next({
      status: 400,
    });
  }
  return db('comments')
    .insert({
      article_id,
      user_id,
      body,
    })
    .returning('*')
    .then(comment => res.status(201).send({
      comment: comment[0],
    }))
    .catch(next);
};

exports.updateCommentVotes = (req, res, next) => {
  const {
    article_id,
    comment_id,
  } = req.params;
  const {
    inc_votes,
  } = req.body;
  return db('comments')
    .where('article_id', article_id)
    .where('comment_id', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then((comment) => {
      if (comment.length === 0) {
        return next({
          status: 404,
        });
      }
      return res.send({
        comment: comment[0],
      });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const {
    article_id,
    comment_id,
  } = req.params;
  return db('comments')
    .where('article_id', article_id)
    .where('comment_id', comment_id)
    .del()
    .returning('*')
    .then((deletedComment) => {
      if (deletedComment.length === 0) {
        return next({
          status: 404,
        });
      }
      return res.status(204).send({
        comment: {},
      });
    })
    .catch(next);
};
