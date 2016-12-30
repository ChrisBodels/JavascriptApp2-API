var express = require('express');

var api = express(); 

require('./config/express').addMiddleware(api)
require('./routes')(api)

app.listen(4000, function() {
  console.log('Express server listening.');
});
