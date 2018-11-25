const db = require('../db/connection');

// filter bogus query.params
const validateQueries = require('../utils/validateQueries');

exports.getTopics = (req, res, next) => {
  db('topic')
    .select()
    .then((topics) => {
      res.status(200).send({
        topics,
      });
    }).catch(next);
};

exports.postTopic = (req, res, next) => {
  db('topic')
    .insert(req.body)
    .returning('*')
    .then((topic) => {
      res.status(201).send(
        topic[0],
      );
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const {
    topic,
  } = req.params;

  const validQueries = validateQueries(req.query, 'sort_by', 'sort_ascending', 'p', 'limit');

  const {
    p = 1,
    sort_by = 'created_at',
    sort_ascending = false,
    limit = 10,
  } = validQueries;


  return db('article')
    .select(
      'username AS author',
      'title',
      'article.votes',
      'article.article_id',
      'topic',
      'article.created_at',
    )
    .join('user', 'user.user_id', '=', 'article.user_id')
    .leftJoin('comment', 'comment.article_id', '=', 'article.article_id')
    .where('article.topic', '=', topic)
    .groupBy('article.article_id', 'user.username')
    .orderBy(sort_by, (sort_ascending ? 'asc' : 'desc'))
    .count('comment.comment_id as comment_count')
    .limit(limit)
    .offset(limit * (p - 1))
    .then((articles) => {
      // console.log(articles)
      if (articles.length === 0) {
        next({
          status: 404,
          msg: 'No articles found',
        });
      }
      res.status(200).send({
        articles,
      });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  req.body.topic = req.params.body;
  db('article')
    .insert(req.body)
    .returning('*')
    .then((article) => {
      res.status(201).send(
        article[0],
      );
    })
    .catch(next);
};
