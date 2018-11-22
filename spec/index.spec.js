process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const app = require('../app');
const {
  expect
} = require('chai');

const
  connection = require('../db/connection');

const request = supertest(app);

describe('/', () => {
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());
  describe('/api', () => {

    describe('404', () => {
      it('returns a 404 and an appropriate error message', () => request.get('/api/ilovelinting').expect(404).then(({
        body
      }) => {
        expect(body.msg).to.equal('Page not found');
      }));
    });

    describe('/topics', () => {
      const url = '/api/topics';
      it('GET returns staus 200 and an array of topics', () => request.get(url).expect(200).then(({
        body: {
          topics
        }
      }) => {
        expect(topics.length).to.equal(2);
        expect(topics[0]).to.have.all.keys(['slug', 'description']);

        it('POST request to topics returns a status 201 and the object sent', () => request.post(url).send({
          slug: 'slugs',
          description: 'an aquired taste'
        }).expect(201).then(({
          body: {
            topic
          }
        }) => {
          expect(topic).to.be.an('object');
          expect(topic).to.have.all.keys(['slug', 'description']);
          expect(topic.description).to.equal('an aquired taste');
        }));
      }));
    });
  });
});