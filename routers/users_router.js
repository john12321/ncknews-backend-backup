const usersRouter = require('express').Router();
const {
  getAllUsers,
  getUserByName,
} = require('../controllers/users_ctrl');
const {
  handle405s,
} = require('../errors');

usersRouter
  .route('/')
  .get(getAllUsers)
  .all(handle405s);

usersRouter
  .route('/:username')
  .get(getUserByName)
  .all(handle405s);


module.exports = usersRouter;
