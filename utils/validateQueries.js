const validateQueries = (rawQueries, ...validQueries) => validQueries.reduce((filtered, query) => {
  if (rawQueries[query]) filtered[query] = rawQueries[query];
  return filtered;
}, {});

module.exports = validateQueries;
