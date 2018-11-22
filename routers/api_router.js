const apiRouter = require('express').Router();
const {
  topicsRouter
} = require('./topics_router');
//const userRouter = require('./users-router');
//const commentRouter = require('./comments-router');

apiRouter.use('/topics', topicsRouter);
// apiRouter.use('/users', usersRouter);
// apiRouter.use('/comments', commentsRouter);

module.exports = {
  apiRouter
};