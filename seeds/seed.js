const {
  userData,
  topicData,
  articleData,
  commentData
} = require('../db/data/test-data/');

const {
  createRef,
  formatAData,
  formatComData
} = require('../db/utils');

const globArr = [];

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('topic').del().insert(topicData)
    .then(() => {
      return knex('user').insert(userData).returning('*');
    })
    .then((userData) => {
      const userRef = createRef(userData, 'username', 'user_id');
      //push userRef to global array
      globArr.push(userRef)
      // console.log(userRef)
      const formattedArticleData = formatAData(articleData, userRef);
      return knex('article').insert(formattedArticleData).returning('*');

    })
    .then((articleData) => {
      const articleRef = createRef(articleData, 'title', 'article_id');
      const formattedCommentData = formatComData(commentData, articleRef, globArr[0]);
      return knex('comment').insert(formattedCommentData).returning('*');
    })
};