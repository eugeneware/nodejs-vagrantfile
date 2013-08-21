module.exports = function(db) {
  var fs = require('fs')
    , modelsPath = __dirname + '/../models'
    , models = {};

  // models
  fs.readdirSync(modelsPath).forEach(function(file) {
    var match = file.match(/(.*)\.js$/);
    if (match) {
      models[match[1]] = db.import(modelsPath + '/' + file);
    }
  });

  return models;
};
