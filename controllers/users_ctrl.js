const db = require('../db/connection');

exports.getAllUsers = (req, res, next) => {
  db('user')
    .select()
    .then(users => res.send({
      users,
    }))
    .catch(next);
};

exports.getUserByName = (req, res, next) => {
  const {
    username,
  } = req.params;
  return db('user')
    .select()
    .where('username', '=', username)
    .then((user) => {
      if (user.length === 0) {
        next({
          code: 'No user',
        });
      } else {
        res.send({
          user: user[0],
        });
      }
    })
    .catch(next);
};
