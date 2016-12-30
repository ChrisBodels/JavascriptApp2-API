var express = require('express');

var api = express(); 
var cors = require('cors');

require('./config/express').addMiddleware(api)
api.use(cors());
require('./routes')(api)

api.listen(5000, function() {
  console.log('Express server listening.');
});
