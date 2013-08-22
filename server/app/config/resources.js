module.exports = function(app, models) {
  var fs = require('fs'),
      resourcesPath = __dirname + '/../resources',
      modelsPath = __dirname + '/../models';

  // main resource
  app.resource(require(resourcesPath + '/main')(models));

  // load model resources
  for (var model in models) {
    var resourceFile = resourcesPath + '/' + model + '.js';
    if (!fs.exists(resourceFile)) {
      resourceFile = resourcesPath + '/crud';
    }
    app.resource(model, require(resourceFile)(models, model));
  }

  // load all other resources
  fs.readdirSync(resourcesPath).forEach(function(file) {
    var match = file.match(/(.*)\.js$/);
    if (match) {
      var resource = match[1],
          resourceFile = resourcesPath + '/' + file;
      if (!models[resource] && ['main', 'crud'].indexOf(match[1]) < 0) {
        app.resource(resource, require(resourceFile)(models));
      }
    }
  });
};
