/* eslint "no-console" : 0 */
const app = require('./app');

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}...`);
});
