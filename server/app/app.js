var express = require('express')
  , resource = require('express-resource')
  , config = require('./config/config')
  , db = require('./config/db')(config)
  , models = require('./config/models')(db);

var app = express();
require('./config/express')(app, config);
require('./config/resources')(app, models);

db.sync().success(function () {
  app.listen(config.port);
  console.log('Listening on port ' + config.port);
});
