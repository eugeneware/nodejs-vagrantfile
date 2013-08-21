module.exports = function(app, models) {
  var fs = require('fs')
    , resourcesPath = __dirname + '/../resources'

  // main resource
  app.resource(require(resourcesPath + '/main')(models));

  // load all other resources
  fs.readdirSync(resourcesPath).forEach(function(file) {
    var match = file.match(/(.*)\.js$/);
    if (match && match[1] !== 'main') {
      app.resource(match[1], require(resourcesPath + '/' + match[1])(models));
    }
  });
};
