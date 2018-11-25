/* eslint "max-len" : 0 */
process.env.NODE_ENV = 'test';
const {
  expect,
} = require('chai');
const supertest = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('/', () => {
  // GET returns a 404 for any non-existent route
  describe('/api', () => {
    beforeEach(() => connection.migrate
      .rollback()
      .then(() => connection.migrate.latest())
      .then(() => connection.seed.run()));
    after(() => connection.destroy());

    describe('/topics', () => {
      const url = '/api/topics';

      // GET responds with status 200 and an array of topics objects
      it('GET responds with status 200 and an array of topics objects', () => request
        .get(url)
        .expect(200)
        .then(({
          body: {
            topics,
          },
        }) => {
          expect(topics.length).to.equal(2);
          expect(topics[0]).to.have.all.keys(['slug', 'description']);
        }));

      // POST responds with a 201 and the added topic
      it('POST responds with a 201 and the added topic', () => request
        .post(url)
        .send({
          slug: 'slugs',
          description: 'an aquired taste',
        })
        .expect(201)
        .then(({
          body,
        }) => {
          expect(body).to.be.an('object');
          expect(body).to.have.all.keys(['slug', 'description']);
          expect(body.description).to.equal('an aquired taste');
        }));


      // POST responds with a 422 bad request if sent a duplicate slug
      it('POST responds with a 422 bad request if sent a duplicate slug', () => request
        .post(url)
        .send({
          slug: 'mitch',
          description: 'The man, the Mitch, the legend',
        })
        .expect(422)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('Duplicate entry not allowed');
        }));

      // POST responds with a 400 if req.body is malformed (not null)
      it('POST responds with a 400 if req.body is malformed (not null)', () => request
        .post(url)
        .send({
          slug: 1,
          slug2: 'test2',
          description: 1,
        })
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.eql('Malformed body for this request');
        }));

      // invalid methods respond with 405
      it('invalid METHOD returns 405 and error message', () => {
        const invalidMethods = ['delete', 'put', 'patch'];
        return Promise.all(
          invalidMethods.map(method => request[method](url)
            .expect(405)
            .then(({
              body,
            }) => {
              expect(body.msg).to.equal('Method not allowed on this path');
            })),
        );
      });
    });

    describe('/topics/:topic/articles', () => {
      const urlA = '/api/topics/mitch/articles';
      // GET responds with a 200 and an array of 10 articles (default limit)
      it('GET request returns a 200 and all articles on that given topic', () => request
        .get(urlA)
        .expect(200)
        .then(({
          body,
        }) => {
          // console.log(
          //   body.articles
          // );
          expect(body.articles).to.be.an('array');
          expect(body.articles.length).to.equal(10);
          expect(body.articles[0]).to.have.all.keys([
            'title',
            'article_id',
            'topic',
            'author',
            'created_at',
            'votes',
            'comment_count',
          ]);
        }));


      // GET responds with a 404 with an invalid topic
      it('GET responds with a 404 with an invalid topic', () => {
        request
          .get('/api/topics/budgienews/articles')
          .expect(404)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('Page not found');
          });
      });

      // GET sorts articles in desc order by date (default order)
      it('"sort_by" is a query which determines the sort_criteria defaults to date', () => request
        .get(urlA)
        .expect(200)
        .then(({
          body: {
            articles,
          },
        }) => {
          expect(articles[0].title).to.equal('Living in the shadow of a great man');
        }));

      // GET takes a limit query which alters the number of articles returned
      it('GET takes a limit query which alters the number of articles returned', () => request
        .get('/api/topics/mitch/articles?limit=2')
        .expect(200)
        .then(({
          body: {
            articles,
          },
        }) => {
          expect(articles.length).to.equal(2);
        }));

      // GET takes an p query which returns the next page of articles
      it('GET takes an p query which returns the next page of articles', () => request
        .get('/api/topics/mitch/articles?p=2')
        .expect(200)
        .then(({
          body: {
            articles,
          },
        }) => {
          expect(articles.length).to.equal(1);
        }));

      // GET takes sort_by query which alters the column by which data is sorted (desc order by default)
      it('GET QUERY SORT_BY: should apply sort_by to the specifed query', () => request.get('/api/topics/mitch/articles?sort_by=article_id')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles[0].article_id).to.eql(12);
        }));

      // GET returns default response if given invalid sort_by

      // GET takes a sort_ascending query which changes the sort to ascending
      it('GET QUERY SORT_ASCENDING: should sort by page number', () => request.get('/api/topics/mitch/articles?sort_ascending=true')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles[1].article_id).to.eql(10);
        }));

      // GET returns all articles with a comment_count property

      // GET returns all articles with correct keys

      // GET returns a 400 bad request for malformed non-int limit/p queries
      // it('GET returns a 400 bad request for malformed non-int limit/p queries', () => request.get('/api/topics/mitch/articles?limit=madeup')
      //   .expect(400)
      //   .then(({
      //     body,
      //   }) => {
      //     expect(body.msg).to.equal('Malformed parameter for this request');
      //   }));

      // POST responds with a 201 and a newly added article for that topic
      it('POST responds with a 201 and a newly added article for that topic', () => {
        const article = {
          title: 'when will this pain end!',
          topic: 'cats',
          created_by: 'mitch',
          body: 'I have lost sight of the big picture!',
          created_at: 232434325325232,
        };
        request
          .post(urlA)
          .send(article)
          .expect(201)
          .then(({
            body,
          }) => {
            expect(body).to.be.an('object');
            expect(body).to.have.all.keys(['article_id',
              'title',
              'user_id',
              'votes',
              'created_at',
              'topic',
              'body',
            ]);
            expect(body.title).to.equal('I thought you were a cat');
          });
      });

      // POST responds with a 400 if body is malformed (not null)
      it('POST responds with a 400 if body is malformed (not null)', () => request.post(urlA)
        .send({
          this: 'should fail',
        })
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('Malformed body for this request');
        }));

      // POST responds with a 404 when trying to add an article to a non-existent topic

      // invalid methods respond with 405
      it('all incorrect methods respond with a 405', () => {
        const invalid = ['delete', 'put', 'patch'];
        return Promise.all(invalid.map(method => request[method](urlA).expect(405)));
      });
    });

    describe('/articles', () => {
      const urlB = '/api/articles';
      // GET responds with a 200 and an array of 10 articles (default limit)
      it('GET responds with a 200 and an array of 10 articles (default limit)', () => request
        .get(urlB)
        .expect(200)
        .then(({
          body: {
            articles,
          },
        }) => {
          expect(articles).to.be.an('Array');
          expect(articles.length).to.equal(10);
          expect(articles[2]).to.have.all.keys(['author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic']);
        }));
      // GET sorts articles in desc order by date (default order)
      it('GET sorts articles in desc order by date (default order)', () => request
        .get(urlB)
        .expect(200)
        .then(({
          body: {
            articles,
          },
        }) => {
          expect(articles[1].created_at).to.equal('2018-11-15T12:21:54.169Z');
        }));
      // GET takes a limit query which alters the number of articles returned
      // GET takes an p query which alters the starting index of the articles returned
      // GET takes sort_by query which alters the column by which data is sorted (desc order by default)
      // GET responds with default response if given invalid sort_by
      // GET takes a sort_ascending query which changes the sort to ascending
      // GET responds with all articles with a comment_count property
      // GET responds with all articles with correct keys
      // GET responds with a 400 bad request for malformed non-int limit/p queries
      // invalid methods respond with 405
    });

    describe('/articles/:article_id', () => {
      // GET responds with a 200 and a single article
      // GET responds with a 404 when given a non-existent article_id
      // GET responds with a 400 when given an invalid article_id
      // PATCH responds with a 200 and an updated article when given a body including a valid "inc_votes" (VOTE UP)
      // PATCH responds with a 200 and an updated article when given a body including a valid "inc_votes" (VOTE DOWN)
      // PATCH responds with a 400 if given an invalid inc_votes
      // PATCH with no body responds with an unmodified article
      // DELETE responds with a 204 and removes the article when given a valid article_id
      // DELETE responds with a 404 when given a non-existent article_id
      // DELETE responds with 400 on invalid article_id
      // DELETE responds with a 204 when deleting an article without comments (no comments required to performdelete)
      // invalid methods respond with 405

    });

    describe('/articles/:article_id/comments', () => {
      // GET responds with status 200 and all the first 10 comments for the article (default limit)
      // GET takes a limit query which alters the number of comments returned
      // GET takes a p query which alters the page of the comments returned
      // GET sorts in descending order (default order) of date (default criterion)
      // GET can be sorted by author (desc order default)
      // GET can be sorted by votes (desc order default)
      // GET can return the data in ascending order
      // GET responds with 404 for a non-existent article_id
      // GET responds with 400 for an invalid article_id
      // POST responds with a 201 and the posted comment when given a valid article_id


      // POST responds with a 404 when given a non-existent article id
      // POST responds with a 400 when given an invalid article id
      // POST responds with a 400 when given an invalid body referencing a non-existent column
      // POST responds with a 400 when given a non-existent user_id
      // invalid methods respond with 405
    });

    describe('/articles/:article_id/comments/:comment_id', () => {
      // PATCH responds with a 200 and an updated comment when given a body including a valid "inc_votes" (VOTE DOWN)
      // PATCH responds with a 400 if given an invalid inc_votes
      // PATCH with no body responds with an unmodified comment
      // PATCH responds with 404 if non-existent article id is used
      // PATCH responds with 404 if non-existent comment id is used
      // PATCH responds with a 404 if given a comment which does not exist on this /:article_id
      // PATCH responds with 400 if invalid article id is used
      // PATCH responds with 400 if invalid comment id is used
      // DELETE responds with a 204 and removes the comment
      // DELETE responds with 404 if given a non-existent article_id
      // DELETE responds with 404 if given a non-existent comment_id
      // DELETE responds with 404 if given a comment which does not exist on this /:article_id
      // invalid methods respond with 405
    });

    describe('/users', () => {
      // GET responds with a 200 and an array of user objects
      // invalid methods respond with 405
    });

    describe('/users/:user_id', () => {
      // GET responds with a 200 and a user object when given a valid user_id
      // GET responds with a 404 when a non-existent user_id
      // GET responds with a 400 when given a malformed user_id
      // invalid methods respond with 405
    });
  });
});
