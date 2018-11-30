# NC-Knews - The Northcoders news API

## Background

An Express API was built for accessing NC-Knews (Northcoders News) data from a PostgreSQL database via knex using a variety of API endpoints listed below.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine

1. Fork and clone the BE2-NC-Knews repo from my GitHub page.

```
https://github.com/john12321/BE2-NC-Knews

```

2. Install dependencies

To install all the dependencies listed in the package-json file just run the following (from inside the project folder using the CLI):

```
npm i

npm i knex

```

## Configuring you knexfile.js

You will need to create and configure your own knexfile.js by doing the following:

```
knex init
```

Open your knexfile.js file and configure your settings for test and development environments. Below are my settings for development as an example.

```

const {
  DB_URL,
} = process.env;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: '<your pg username>',
      password: '<your pg password>',
      database: 'ncknews',
    },
    migrations: {
      directory: `${__dirname}/db/migrations`,
    },
    seed: {
      directory: `${__dirname}/seeds`,
    },
  }
}
```

## Running the tests

Mocha, chai and supertest are set up to run the tests in the spec folder. to run the tests, type the following command in your terminal:

```
npm t  (a shortcut for 'npm run test')
```

The tests thoroughly (I hope!) test all of the server endpoints (see API Endpoints).

## API Endpoints

```
    api:
      '/api/'
        GET: 'fetch a list of all API endpoints'
      topics: {
        '/api/topics/'
          GET: 'fetch all topics',
          POST: 'post new topic'
        '/api/topics/:topic/articles'
          GET: 'fetch all articles by topics',
          POST: 'post new article by topic'
      articles:
        '/api/articles/':
          GET: 'fetch all articles'
        '/api/articles/:article_id':
          GET: 'fetch single article by article ID',
          PATCH: 'update single aritcle by article ID',
          DELETE: 'remove single article by article ID'
        comments:
          '/api/articles/:article_id/comments/':
            GET: 'fetch all comments by article ID',
            POST: 'post new comment to article ID'
          '/api/article/:article_id/comments/:comment_id':
            PATCH: 'update single comment by comment ID',
            DELETE: 'remove single comment by comment ID'
      users:
        '/api/users/':
          GET: 'fetch all users'
        '/api/users/:user_id':
          GET: 'fetch single user by user ID'
```

`NOTE: 'GET/api' gives a list of all the above endpoints`

## Built With

- [Express](https://expressjs.com/) - Node.js web framework
- [PostgreSQL](https://www.postgresql.org/) - Relational Database
- [Knex](https://rometools.github.io/rome/) - SQL query builder for JavaScript

## Tested with

- [Mocha](https://mochajs.org/) - JavaScript test framework
- [Chai](https://www.chaijs.com/) - TDD assertion library
- [Supertest](https://rometools.github.io/rome/) - Library for testing node.js HTTP servers

## Hosted on

- [Heroku](https://www.heroku.com/)

[https://ncknews.herokuapp.com/](https://ncknews.herokuapp.com/)

## Author

**John O'Meara**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Thanks to the nchelpers!
