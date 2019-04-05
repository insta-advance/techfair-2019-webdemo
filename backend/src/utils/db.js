if (process.env.DEPLOYMENT === 'serverless') {
  module.exports = require('./dynamodb');
} else {
  module.exports = require('./mockDb');
}
