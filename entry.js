require('babel/register')({
  optional: ['asyncToGenerator'],
});

require('./lib/index.js');
