const db = require('../db/connection');

exports.getAllUsers = (req, res, next) => db('users')
  .select()
  .then((users) => {
    res.send({
      users,
    });
  })
  .catch(next);

exports.getUserByName = (req, res, next) => {
  const {
    username,
  } = req.params;
  return db('users')
    .select()
    .where('username', username)
    .then((user) => {
      if (user.length < 1) {
        next({ status: 404 });
      }
      else {
        res.status(200).send({ user: user[0] })
      }
    }).catch(next);
};
