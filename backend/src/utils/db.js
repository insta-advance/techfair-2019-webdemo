if (process.env.DEPLOYMENT === 'serverless') {
  module.exports = require('./dynamodb'); // eslint-disable-line
} else {
  module.exports = require('./mockDb'); // eslint-disable-line
}
