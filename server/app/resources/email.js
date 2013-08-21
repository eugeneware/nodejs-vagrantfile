module.exports = function(models) {
  var Email = models.email;
  return {
    index: function(req, res) {
      Email.findAll()
        .success(function (emails) {
          res.json(emails);
        })
        .failure(function (err) {
          res.json(500, { error: err.toString() });
        });
    },
    new: function(req, res) {
      res.send('email new');
    },
    create: function(req, res) {
      Email.create(req.body)
        .success(function (email) {
          res.json(email);
        })
        .failure(function (err) {
          res.json(500, { error: err.toString() });
        });
    },
    show: function(req, res) {
      res.json(req.email);
    },
    edit: function(req, res) {
      res.send('email edit');
    },
    update: function(req, res) {
      req.email.updateAttributes(req.body)
        .success(function () {
          res.json(req.email);
        })
        .failure(function (err) {
          res.json(500, { error: err.toString() });
        });
    },
    destroy: function(req, res) {
      console.log('destroy?');
      req.email.destroy()
        .success(function () {
          res.json({ msg: 'Item successfully deleted' });
        })
        .failure(function (err) {
          res.json(500, { error: err.toString() });
        });
    },
    load: function (id, cb) {
      Email.find(id)
        .success(function (email) {
          cb(null, email);
        })
        .failure(function (err) {
          cb(err);
        });
    }
  }
};
