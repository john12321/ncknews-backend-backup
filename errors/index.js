exports.handle404 = (err, req, res, next) => {
  if (err.msg === 'no data for this endpoint...') res.status(404).send({
    msg: err.msg
  });
  if (err.status === 404) res.status(404).send({
    msg: 'Page not found'
  });
  else next(err);
}


exports.handle500 = (err, req, res, next) => {
  res.status(500).send({
    msg: 'Internal server error'
  });
};