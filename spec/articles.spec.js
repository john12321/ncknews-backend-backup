process.env.NODE_ENV = 'test';
const {
  expect,
} = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const db = require('../db/connection');


describe('/api/articles', () => {
  beforeEach(() => db.migrate.rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run()));
  it('GET responds with a 200 and an array of 5 articles (default limit)', () => request
    .get('/api/articles')
    .expect(200)
    .then(({
      body: {
        articles,
      },
    }) => {
      expect(articles.length).to.equal(5);
      expect(articles).to.be.an('array');
      expect(articles[0]).to.have.all.keys(
        'author',
        'title',
        'article_id',
        'votes',
        'body',
        'comment_count',
        'created_at',
        'topic',
      );
    }));
  it('all incorrect methods respond with a 405', () => {
    const invalid = ['delete', 'put', 'patch'];
    return Promise.all(invalid.map(method => request[method]('/api/articles').expect(405)));
  });
  it('GET returns 200 and an array where responses are limited as defined', () => request
    .get('/api/articles?limit=2')
    .expect(200)
    .then(({
      body: {
        articles,
      },
    }) => {
      expect(articles.length).to.equal(2);
    }));
  it('GET returns 200 and an array sorted by date and limited to a given limit', () => request
    .get('/api/articles?sortBy=created_at&limit=3')
    .expect(200)
    .then(({
      body: {
        articles,
      },
    }) => {
      expect(articles.length).to.equal(3);
      expect(articles[0].title).to.equal('Living in the shadow of a great man');
    }));
  it('GET returns 200 and an array sorted as required and to a given limit', () => request
    .get('/api/articles?sort_ascending=true&limit=2')
    .expect(200)
    .then(({
      body: {
        articles,
      },
    }) => {
      expect(articles.length).to.equal(2);
      expect(articles[0].title).to.equal('Moustache');
      expect(articles[articles.length - 1].title).to.equal('Am I a cat?');
    }));
  it('GET returns 200 for a given start page', () => request
    .get('/api/articles?p=3')
    .expect(200)
    .then(({
      body: {
        articles,
      },
    }) => {
      // console.log(articles)
      expect(articles.length).to.equal(5);
    }));
  it('GET returns 200 and an article object by id', () => request
    .get('/api/articles/1')
    .expect(200)
    .then(({
      body: {
        article,
      },
    }) => {
      // console.log(article)
      expect(Object.keys(article).length).to.equal(8);
      expect(article).to.be.an('object');
      expect(article).to.have.all.keys(
        'author',
        'title',
        'article_id',
        'votes',
        'body',
        'comment_count',
        'created_at',
        'topic',
      );
    }));
  it('GET returns 400 for an incorrect type of user id', () => request
    .get('/api/articles/test')
    .expect(400));
  it('GET returns 404 and for a non-existent user id', () => request
    .get('/api/topics/666')
    .expect(404));
  it('All blocked methods respond with a 405', () => {
    const url = '/api/articles/1';
    const methods = [request.put(url)];
    return Promise.all(methods.map(object => object.expect(405)));
  });
  it('PATCH returns 200 and updates votes for given user id', () => {
    const updatedArticle = {
      inc_votes: 2,
    };
    return request
      .patch('/api/articles/1')
      .send(updatedArticle)
      .expect(200)
      .then(({
        body: {
          article,
        },
      }) => {
        // console.log(article)
        expect(article).to.be.an('object');
        expect(article.votes).to.equal(102);
      });
  });
  it('PATCH returns 400 and an error message', () => request
    .patch('/api/articles/testing')
    .expect(400));
  it('PATCH returns 404 and an error message', () => request
    .patch('/api/articles/999')
    .expect(404));
  it('DELETE /:article_id responds with 204 and returns an empty object', () => request.delete('/api/articles/1').expect(204).then(({
    body,
  }) => {
    expect(Object.keys(body).length).to.equal(0);
  })
    .then(() => request
      .get('/api/articles/1')
      .expect(404)));

  it('DELETE with invalid article id returns 400 and error message', () => request
    .delete('/api/articles/nodelete')
    .expect(400));
  it('DELETE with valid but non-existent article id returns 404 and error message', () => request
    .delete('/api/articles/11111')
    .expect(404)
    .then(({
      body: {
        message,
      },
    }) => {
      // console.log(message)
      expect(message).to.equal('Page not found');
    }));
  it('GET returns 200 and an array of comments by article id', () => request
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({
      body: {
        comments,
      },
    }) => {
      // console.log(body)
      expect(comments.length).to.equal(5);
      expect(comments).to.be.an('array');
      expect(comments[0]).to.have.all.keys(
        'author',
        'votes',
        'comment_id',
        'created_at',
        'body',
      );
    }));
  it('GET returns 400 and an error message', () => request
    .get('/api/articles/qwerty/comments')
    .expect(400));
  it('GET returns 404 and an error message', () => request
    .get('/api/topics/1111111/comments')
    .expect(404));
  it('All blocked methods respond with a 405', () => {
    const url = '/api/articles/1/comments';
    const methods = [request.put(url), request.patch(url), request.delete(url)];
    return Promise.all(methods.map(object => object.expect(405)));
  });
  it('GET returns 200 and a limited number of responses set by developer', () => request
    .get('/api/articles/1/comments?limit=2')
    .expect(200)
    .then(({
      body: {
        comments,
      },
    }) => {
      expect(comments.length).to.be.most(2);
    }));
  it('GET returns 400 and error message for non numeric user id', () => {
    const limit = 5;
    return request
      .get(`/api/articles/test/comments?limit=${limit}`)
      .expect(400);
  });
  it('GET returns 404 and an error message', () => {
    const limit = 5;
    return request
      .get(`/api/articles/999/comments?limit=${limit}`)
      .expect(404);
  });
  it('GET returns 200 and an array of objects sorted by date', () => {
    const resStr = 'The beautiful thing about treasure is that it exists.';
    const resCom = 'Massive intercranial brain haemorrhage';
    return request
      .get('/api/articles/1/comments?sortBy=created_at&limit=11')
      .expect(200)
      .then(({
        body: {
          comments,
        },
      }) => {
        expect(comments.length).to.equal(11);
        expect(comments[0].body).to.have.string(resStr);
        expect(comments[comments.length - 1].body).to.equal(resCom);
      });
  });
  it('GET returns 200 and an array of objects sorted by votes', () => request
    .get('/api/articles/1/comments?sort_by=votes&limit=2')
    .expect(200)
    .then(({
      body: {
        comments,
      },
    }) => {
      // console.log(body)
      expect(comments.length).to.equal(2);
      expect(comments[0].body).to.have.string('Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.');
      expect(comments[comments.length - 1].body).to.equal('This morning, I showered for nine minutes.');
    }));
  it('GET returns 200 and an array of objects sorted in asc order', () => {
    const firstCommentSubStr = 'I hate streaming noses';
    const lastCommentDesc = 'This morning, I showered for nine minutes.';
    return request
      .get('/api/articles/1/comments?sort_ascending=true')
      .expect(200)
      .then(({
        body: {
          comments,
        },
      }) => {
        expect(comments.length).to.equal(5);
        expect(comments[0].body).to.equal(lastCommentDesc);
        expect(comments[comments.length - 1].body).to.equal(firstCommentSubStr);
      });
  });
  it('GET returns 200 and a specified start page', () => request
    .get('/api/articles/1/comments?limit=2&?p=3')
    .expect(200)
    .then(({
      body: {
        comments,
      },
    }) => {
      expect(comments.length).to.equal(2);
    }));
  it('POST returns 201 and new comment by article id', () => {
    const newComment = {
      body: 'hello there',
      user_id: 1,
    };
    return request
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then(({
        body: {
          comment,
        },
      }) => {
        // console.log(body)
        expect(comment).to.be.an('object');
        expect(comment).to.have.all.keys('comment_id', 'user_id', 'article_id', 'created_at', 'votes', 'body');
        expect(comment.article_id).to.equal(1);
      });
  });
  it('POST returns 400 and an error message', () => {
    const newComment = {
      body: 'qwerttyyyyyy',
      id: 1,
    };
    return request
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400);
  });
  it('PATCH returns 200 and updates votes', () => {
    const updatedComment = {
      inc_votes: 200,
    };
    return request
      .patch('/api/articles/1/comments/2')
      .send(updatedComment)
      .expect(200)
      .then(({
        body: {
          comment,
        },
      }) => {
        expect(comment).to.be.an('object');
        expect(comment.votes).to.equal(214);
      });
  });
  it('PATCH returns 400 and an error message for wrong type of article id', () => request
    .patch('/api/articles/nothere/comments/2')
    .expect(400));
  it('PATCH returns 400 and an error message for wrong type of comment id', () => request
    .patch('/api/articles/1/comments/nothere')
    .expect(400));
  it('PATCH returns 404 and an error message for non-existent article id', () => request
    .patch('/api/articles/666/comments/2')
    .expect(404));
  it('PATCH returns 404 and an error message for non-existent comment id', () => request
    .patch('/api/articles/1/comments/666')
    .expect(404));
  it('DELETE returns 204 and deletes comment, returning empty object', () => request
    .delete('/api/articles/1/comments/2')
    .expect(204));
  it('DELETE returns 404 and an error message for non-existent article id', () => request
    .delete('/api/articles/666/comments/2')
    .expect(404));
  it('DELETE returns 404 and an error message for non-existent comment id', () => request
    .delete('/api/articles/1/comments/999')
    .expect(404));
  it('DELETE returns 400 and an error message for wrong type of article id', () => request
    .delete('/api/articles/qwerty/comments/2')
    .expect(400));
  it('DELETE returns 400 and an error message for wrong type of comment id ', () => request
    .delete('/api/articles/1/comments/qwerrtty')
    .expect(400));

  it('All blocked methods respond with a 405', () => {
    const url = '/api/articles/1/comments/2';
    const methods = [request.get(url), request.put(url)];
    return Promise.all(methods.map(object => object.expect(405)));
  });
});
