process.env.NODE_ENV = 'test';
const {
  expect,
} = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const db = require('../db/connection');

describe('/api/topics', () => {
  beforeEach(() => db.migrate.rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run()));
  after(() => db.destroy());

  it('GET returns 200 and an array of topics', () => request
    .get('/api/topics')
    .expect(200)
    .then(({
      body,
    }) => {
      expect(body).to.have.all.keys('topics');
      expect(body.topics.length).to.equal(2);
      expect(body.topics[0]).to.be.an('object');
      expect(body.topics[0]).to.have.all.keys(
        'slug',
        'description',
      );
    }));
  it('GET returns 404 and an error message for wrong type of topic endpoint', () => request
    .get('/api/topics/qwerrtttyyy')
    .expect(404));
  it('All blocked methods return error status 405', () => {
    const url = '/api/topics';
    const methods = [request.put(url), request.patch(url), request.delete(url)];
    return Promise.all(methods.map(object => object.expect(405)));
  });
  it('POST returns 201 and new topic object', () => {
    const newTopic = {
      slug: 'Billy Bob',
      description: 'Chair dweller',
    };
    return request
      .post('/api/topics')
      .send(newTopic)
      .expect(201)
      .then(({
        body,
      }) => {
        expect(body.topic).to.be.an('object');
        expect(body.topic).to.have.all.keys('slug', 'description');
      });
  });
  it('POST returns 201 and new topic object', () => {
    const newTopic = {
      slug: 'slug',
      description: 'A bit like snail but nothing like puppy dogs tail.',
    };
    return request
      .post('/api/topics')
      .send(newTopic)
      .expect(201);
  });
  it('POST returns 400', () => {
    const newTopic = {
      misspeltingly: 'slug',
      description: 'A bit like snail but nothing like puppy dogs tail.',
    };
    return request
      .post('/api/topics')
      .send(newTopic)
      .expect(400);
  });
  it('GET returns 200 and an object of all topic articles', () => request
    .get('/api/topics/mitch/articles')
    .expect(200)
    .then(({
      body: {
        articles,
      },
    }) => {
      expect(articles).to.be.an('array');
      expect(articles[0]).to.have.all.keys(
        'author',
        'title',
        'article_id',
        'votes',
        'comment_count',
        'created_at',
        'topic',
      );
    }));
  it('GET returns 404 when erroneous topic is used', () => request
    .get('/api/topics/git/articles')
    .expect(404));
  it('All blocked methods return 405', () => {
    const url = '/api/topics/cats/articles';
    const methods = [request.put(url), request.patch(url), request.delete(url)];
    return Promise.all(methods.map(object => object.expect(405)));
  });
  it('GET returns 200 and an object and correctly limited response', () => request
    .get('/api/topics/mitch/articles?limit=2')
    .expect(200)
    .then(({
      body: {
        articles,
      },
    }) => {
      expect(articles.length).to.be.most(2);
    }));
  it('GET returns 200 and an array of articles correctly sorted by date created and limited', () => request
    .get('/api/topics/mitch/articles?sortBy=created_at&limit=5')
    .expect(200)
    .then(({
      body: {
        articles,
      },
    }) => {
      // console.log(articles)
      expect(articles.length).to.equal(5);
      expect(articles[0].created_at).to.equal('1978-11-25T00:00:00.000Z');
      expect(articles[articles.length - 1].created_at).to.equal('1994-11-21T00:00:00.000Z');
    }));
  it('GET returns 200 and an array of objects correctly sorted in asc order and limited', () => request
    .get('/api/topics/mitch/articles?sort_ascending=true&limit=5')
    .expect(200)
    .then(({
      body: {
        articles,
      },
    }) => {
      expect(articles.length).to.equal(5);
      expect(articles[0].title).to.equal('Am I a cat?');
      expect(articles[articles.length - 1].title).to.equal('Z');
    }));
  it('GET returns 200 status and articles at a specified start page', () => request
    .get('/api/topics/mitch/articles?p=3')
    .expect(200)
    .then(({
      body: {
        articles,
      },
    }) => {
      expect(articles.length).to.equal(8);
    }));
  it('GET returns 404 and empty object for a page that doesn\'t exist', () => request
    .get('/api/topics/mitch/articles?p=999')
    .expect(404)
    .then(({
      body: {
        message,
      },
    }) => {
      expect(message).to.equal('Page not found');
    }));
  it('POST returns 201 and new article', () => {
    const newArticle = {
      title: 'this is made up',
      body: 'this is my body',
      user_id: 1,
    };
    return request
      .post('/api/topics/cats/articles')
      .send(newArticle)
      .expect(201)
      .then(({
        body,
      }) => {
        expect(body.article).to.be.an('object');
        expect(body.article).to.have.all.keys('article_id', 'title', 'created_at', 'votes', 'body', 'user_id', 'topic');
      });
  });
  it('POST returns 400 and an error message for malformed article object', () => {
    const newArticle = {
      missspellty: 'hello',
      body: 'cheeto',
      user_id: 1,
    };
    return request
      .post('/api/topics/cats/articles')
      .send(newArticle)
      .expect(400);
  });
});
