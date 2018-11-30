const usersRoute = require('express').Router();
const {
  getAllUsers,
  getUserById,
} = require('../controllers/users');
const {
  handle405s,
} = require('../errors');

usersRoute.route('/')
  .get(getAllUsers)
  .all(handle405s);

usersRoute.route('/:username')
  .get(getUserById)
  .all(handle405s);

module.exports = usersRoute;
