var expect = require('chai').expect,
    path = require('path'),
    spawn = require('child_process').spawn,
    http = require('http'),
    config = require('../app/config/config'),
    db = require('../app/config/db')(config),
    models = require('../app/config/models')(db),
    bl = require('bl'),
    q = require('q'),
    request = require('request'),
    range = require('range').range;

describe('REST API', function() {
  var app;
  var port = 3001;

  function testData(n) {
    n = n || 100;
    return range(0, n).map(function (i) {
      return {
        subject: 'Subject ' + i,
        message: 'Email message ' + i
      };
    });
  }

  beforeEach(function(done) {
    var Email = models.email;
    q(db.sync())
    .then(function () {
      return db.query('TRUNCATE TABLE "Emails"');
    })
    .then(function () {
      return Email.bulkCreate(testData());
    })
    .then(function () {
      app = spawn('node', [path.join(__dirname, '..', 'app', 'app.js'), port]);
      //app.stdout.pipe(process.stdout);
      //app.stderr.pipe(process.stderr);
      app.stdout.once('data', function () {
        done();
      });
    })
    .fail(function (err) {
      console.log(err);
      done(err);
    });
  });

  afterEach(function (done) {
    app.kill();
    app.on('close', function (code) {
      done();
    });
  });

  it('should be able to connect to the REST server', function(done) {
    http.get('http://localhost:' + port, function (res) {
      res.pipe(bl(function (err, data) {
        expect(data.toString()).to.equal('main index');
        done();
      }));
    })
    .on('error', done);
  });

  it('should be able to retrieve an email', function(done) {
    var Email = models.email;
    q(Email.find({ where: { subject: 'Subject 42' } }))
    .then(function (email) {
      request('http://localhost:' + port + '/email/' + email.id,
        function (err, res, body) {
          if (err) return done(err);
          var obj = JSON.parse(body);
          expect(obj.subject).to.equal('Subject 42');
          expect(obj.message).to.equal('Email message 42');
          expect(obj.id).to.equal(email.id);
          done();
        });
    });
  });

  it('should be able to create a new email', function(done) {
    request.post({
        url: 'http://localhost:' + port + '/email/',
        body: {
          subject: 'New subject',
          message: 'New message'
        },
        json: true
      },
      function (err, res, body) {
        if (err) return done(err);
        expect(res.statusCode).to.equal(200);
        expect(body.subject).to.equal('New subject');
        expect(body.message).to.equal('New message');
        expect(body.id).to.be.gt(0);
        done();
      });
  });
});
