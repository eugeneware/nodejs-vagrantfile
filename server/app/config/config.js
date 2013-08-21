module.exports = {
  root: require('path').normalize(__dirname + '/..'),
  app: {
    name: 'emailsamurai-server'
  },
  port: 3000,
  db: {
    name: 'testdb',
    user: 'testuser',
    pass: 'testpassword'
  }
};
