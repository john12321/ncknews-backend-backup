const db = require('../db/connection');

exports.getTopics = (req, res, next) => {
  db('topic')
    .select()
    .then(topics => {
      console.log(topics)
      res.status(200).send({
        topics
      });
    })
    .catch(next);
}

exports.postTopic = (req, res, next) => {
  const {
    slug,
    description
  } = req.body;
  db('topics')
    .insert({
      slug,
      description,
    })
    .returning('*')
    .then(([topic]) => {
      res.status(201).send({
        topic
      });
    })
    .catch(next);
};