module.exports = {
  root: require('path').normalize(__dirname + '/..'),
  app: {
    name: 'emailsamurai-server'
  },
  port: parseInt(process.env.PORT || process.argv[2] || 3000, 10),
  db: {
    name: 'testdb',
    user: 'testuser',
    pass: 'testpassword'
  }
};
