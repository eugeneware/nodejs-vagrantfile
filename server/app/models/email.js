module.exports = function(db, DataTypes) {
  return db.define('Email', {
    subject: DataTypes.STRING,
    message: DataTypes.TEXT
  });
};
