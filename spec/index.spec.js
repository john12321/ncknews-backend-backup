process.env.NODE_ENV = 'test';
const {
  expect,
} = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const db = require('../db/connection');

describe('/api', () => {
  beforeEach(() => db.migrate.rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run()));
  it('GET returns 200 and a map of all API enpoints', () => request
    .get('/api')
    .expect(200)
    .then(({
      body,
    }) => {
      expect(body).to.have.all.keys('api');
    }));
  describe('/users', () => {
    it('GET returns 200 and an array of users', () => request
      .get('/api/users')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.users.length).to.equal(3);
        expect(body.users).to.be.an('array');
        expect(body.users[0]).to.have.all.keys(
          'user_id',
          'username',
          'avatar_url',
          'name',
        );
      }));
    it('all incorrect methods respond with a 405', () => {
      const url = '/api/users';
      const methods = [request.put(url), request.patch(url), request.delete(url)];
      return Promise.all(methods.map(object => object.expect(405)));
    });
    it('GET returns 200 and single user object by username', () => request
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({
        body: {
          user,
        },
      }) => {
        expect(user).to.be.an('object');
        expect(user).to.have.all.keys(
          'user_id',
          'username',
          'avatar_url',
          'name',
        );
        expect(user.name).to.equal('jonny');
      }));
    it('GET returns 404 when non-existent username is used', () => request
      .get('/api/users/jackyboy')
      .expect(404));
    it('all blocked methods respond with a 405', () => {
      const url = '/api/users/butter_bridge';
      const methods = [request.put(url), request.patch(url), request.delete(url)];
      return Promise.all(methods.map(object => object.expect(405)));
    });
  });
});
