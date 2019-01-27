exports.handle405s = (req, res, next) => res.status(405).send({
  message: 'Method not allowed on this path',
});

exports.handle400s = (err, req, res, next) => {
  const code400s = {
    42702: 'Bad request: column reference is ambiguous',
    42703: 'Bad request: column undefined',
    23502: 'Bad request: NOT NULL violation',
    '22P02': 'Bad request: invalid text representation',
  };
  if (code400s[err.code] || err.status === 400) {
    res.status(400).send({
      message: code400s[err.code],
    });
  } else
    next(err);
};
exports.handle404s = (err, req, res, next) => {
  // console.log(err)
  if (err.status === 404) {
    res.status(404).send({
      message: 'Page not found',
    });
  } else
    next(err);
};


exports.handle422s = (err, req, res, next) => {
  const code422s = {
    23505: 'Unique key constraint: key already exists',
  };
  if (code422s[err.code] || err.status === 422) {
    res.status(422).send({
      message: code422s[err.code],
    });
  } else {
    next(err);
  }
};

exports.handle500s = (err, req, res, next) => {
  res.status(err.status || 500).send({
    message: 'internal server error',
  });
};
