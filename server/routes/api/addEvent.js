var keystone = require('keystone');
var Event = keystone.list('Event');

module.exports = function(req, res) {
  if (!req.body.name || !req.body.description) {
    return res.send({ status: 'incomplete data set' });
  }

  var newEvent = new Event.model();

  Event.updateItem(newEvent, req.body, function(error) {
    res.locals.enquirySubmitted = true;
    if (error) res.locals.saveError = true;
    res.render('addEvent');
  });
};
