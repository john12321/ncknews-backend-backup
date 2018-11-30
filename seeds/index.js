const {
  userData,
  topicData,
  articleData,
  commentData,
} = require('../db/data');
const {
  createRef,
  formatArticle,
  formatComments,
} = require('../db/utils');

exports.seed = function (knex, Promise) {
  return Promise.all([
    knex('topics').del(),
    knex('users').del(),
    knex('articles').del(),
    knex('comments').del(),
  ])
    .then(() => knex('topics')
      .insert(topicData)
      .returning('*'))
    .then(() => knex('users')
      .insert(userData)
      .returning('*'))

    .then((usersRows) => {
      const userRef = createRef(usersRows, 'username', 'user_id');
      const formattedArticles = formatArticle(articleData, userRef);
      return Promise.all([
        knex('articles')
          .insert(formattedArticles)
          .returning('*'),
        usersRows,
      ]);
    })
    .then(([articleRows, userRows]) => {
      const userRef = createRef(userRows, 'username', 'user_id');
      const articleRef = createRef(articleRows, 'title', 'article_id');
      const formattedComments = formatComments(
        commentData,
        userRef,
        articleRef,
      );
      return knex('comments')
        .insert(formattedComments)
        .return('*');
    });
};
