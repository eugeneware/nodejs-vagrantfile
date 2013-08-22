module.exports = function(models, model) {
  var Model = models[model];
  return {
    index: function(req, res) {
      Model.findAll()
        .success(function (items) {
          res.json(items);
        })
        .failure(function (err) {
          res.json(500, { error: err.toString() });
        });
    },
    create: function(req, res) {
      Model.create(req.body)
        .success(function (item) {
          res.json(item);
        })
        .failure(function (err) {
          res.json(500, { error: err.toString() });
        });
    },
    show: function(req, res) {
      res.json(req[model]);
    },
    update: function(req, res) {
      req[model].updateAttributes(req.body)
        .success(function () {
          res.json(req[model]);
        })
        .failure(function (err) {
          res.json(500, { error: err.toString() });
        });
    },
    destroy: function(req, res) {
      console.log('destroy?');
      req[model].destroy()
        .success(function () {
          res.json({ msg: 'Item successfully deleted' });
        })
        .failure(function (err) {
          res.json(500, { error: err.toString() });
        });
    },
    load: function (id, cb) {
      Model.find(id)
        .success(function (item) {
          cb(null, item);
        })
        .failure(function (err) {
          cb(err);
        });
    }
  };
};
