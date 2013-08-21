module.exports = function(app, models) {
  var fs = require('fs')
    , resourcesPath = __dirname + '/../resources'
    , modelsPath = __dirname + '/../models'

  // main resource
  app.resource(require(resourcesPath + '/main')(models));

  // load all other resources
  fs.readdirSync(modelsPath).forEach(function(file) {
    var match = file.match(/(.*)\.js$/);
    if (match) {
      var model = match[1];
      var resourceFile = resourcesPath + '/' + model + '.js';
      if (fs.exists(resourceFile)) {
        app.resource(model, require(resourceFile)(models, model));
      } else {
        app.resource(model, require(resourcesPath + '/crud')(models, model));
      }
    }
  });
};
