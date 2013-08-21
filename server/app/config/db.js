module.exports = function(config) {
  var Sequelize = require('sequelize-postgres').sequelize;

  var db = new Sequelize(config.db.name, config.db.user, config.db.pass, {
    dialect: 'postgres',
    port: 5432
  });

  return db;
};
