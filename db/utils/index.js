exports.createRef = (rows, columnName, idName) => rows.reduce((refObj, row) => {
  const rowValue = row[columnName];
  const primaryKey = row[idName];
  refObj[rowValue] = primaryKey;
  // console.log(refObj)
  return refObj;
}, {});

exports.formatAData = (aData, uRef) => aData.map((aDatum) => {
  const {
    title,
    topic,
    created_by,
    body,
    created_at,
  } = aDatum;
  const formattedDate = new Date(created_at);
  return {
    title,
    topic,
    user_id: uRef[created_by],
    body,
    created_at: formattedDate,
  };
});


exports.formatComData = (comData, userRef, artRef) => comData.map((comDatum) => {
  const {
    body,
    belongs_to,
    created_by,
    votes,
    created_at,
  } = comDatum;
  const formattedDate = new Date(created_at);
  return {
    user_id: userRef[created_by],
    article_id: artRef[belongs_to],
    body,
    votes,
    created_at: formattedDate,
  };
});
