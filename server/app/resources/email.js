module.exports = function(models) {
  return {
    index: function(req, res) {
      res.send('email index');
    },
    new: function(req, res) {
      res.send('email new');
    },
    create: function(req, res) {
      res.send('email create');
    },
    show: function(req, res) {
      res.send('email show');
    },
    edit: function(req, res) {
      res.send('email edit');
    },
    update: function(req, res) {
      res.send('email update');
    },
    destroy: function(req, res) {
      res.send('email destroy');
    }
  }
};
