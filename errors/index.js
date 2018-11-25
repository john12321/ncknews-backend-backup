exports.handle400s = (err, req, res, next) => {
  // console.log(err)
  const code400s = {
    42703: 'Malformed body for this request',
    23502: 'Input violates not-null constraint',
    '22P02': 'Malformed parameter for this request',

  };
  if (code400s[err.code]) {
    res.status(400).send({
      msg: code400s[err.code],
    });
  } else {
    next(err);
  }
};

exports.handle404s = (err, req, res, next) => {
  if (err.msg === 'Page not found') {
    res.status(404).send({
      msg: err.msg,
    });
  } else if (err.code === 33503 || err.status === 404) {
    res.status(404).send({
      msg: 'Page not found',
    });
  } else if (err.code === 'No user') {
    res.status(404).send({
      msg: 'That username does not exist',
    });
  } else if (err.code === 'No article') {
    res.status(404).send({
      msg: 'That article does not exist',
    });
  } else next(err);
};

exports.handle405s = (req, res, next) => {
  // console.log(req.method)
  res.status(405).send({
    msg: 'Method not allowed on this path',
  });
};

exports.handle422s = (err, req, res, next) => {
  const code422s = {
    23505: 'Duplicate entry not allowed',
  };
  if (code422s[err.code] || err.status === 422) {
    res.status(422).send({
      msg: code422s[err.code],
    });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  res.status(500).send({
    msg: 'Internal server error',
  });
};
