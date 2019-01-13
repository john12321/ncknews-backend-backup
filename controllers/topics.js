const db = require('../db/connection');

// const validateQueries = require('./utils/validateQueries');

exports.getAllTopics = (req, res, next) => db('topics')
  .select()
  .then((topics) => {
    res.send({
      topics,
    });
  })
  .catch(next);

exports.getArticlesByTopic = (req, res, next) => {
  const {
    topic,
  } = req.params;

  // const validQueries = validateQueries(req.query, 'limit', 'sort_by', 'sort_ascending', 'p');

  const {
    limit,
    sort_by,
    sort_ascending = 'false',
    p = 1,
  } = req.query;

  return db('articles')
    .select(
      'articles.article_id',
      'title',
      'articles.votes',
      'articles.created_at',
      'topic',
      'users.username as author',
    )
    .join('topics', 'articles.topic', 'topics.slug')
    .join('users', 'articles.user_id', 'users.user_id')
    .where('articles.topic', topic)
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments as comment_count')
    .groupBy('articles.article_id')
    .groupBy('users.username')
    .limit(limit || 10)
    .orderBy(sort_by || 'created_at', sort_ascending ? 'asc' : 'desc')
    .offset(p || 0)
    .then((articles) => {
      if (articles.length === 0) {
        return next({
          status: 404,
          message: 'No article on that topic',
        });
      }
      return res.status(200).send({
        articles,
      });
    })
    .catch(next);
};

exports.postNewTopic = (req, res, next) => {
  const { slug, description } = req.body;
  if (slug && description) {
    db('topics')
      .returning('*')
      .insert({ slug: slug.toLowerCase(), description })
      .into('topics')
      .then(([topic]) => {
        res.status(201).json({ topic });
      })
      .catch(next);
  } else {
    next({ status: 400 });
  }
};

exports.postArticleByTopic = (req, res, next) => {
  const {
    topic,
  } = req.params;
  db('articles')
    .insert({
      title: req.body.title,
      body: req.body.body,
      user_id: req.body.user_id,
      topic,
    })
    .returning('*')
    .then(article => res.status(201).send({
      article: article[0],
    }))
    .catch(next);
};
