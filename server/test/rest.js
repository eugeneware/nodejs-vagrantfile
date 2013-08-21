var expect = require('chai').expect,
    path = require('path'),
    spawn = require('child_process').spawn,
    http = require('http'),
    bl = require('bl');

var port = 3001;
describe('REST API', function() {
  var app;

  beforeEach(function(done) {
    app = spawn('node', [path.join(__dirname, '..', 'app', 'app.js'), port]);
    //app.stdout.pipe(process.stdout);
    //app.stderr.pipe(process.stderr);
    app.stdout.once('data', function () {
      done();
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
});
