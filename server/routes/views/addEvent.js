var keystone = require('keystone');
var Event = keystone.list('Event');
// var PostComment = keystone.list('PostComment');

module.exports = function(req, res) {
  var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'event';
	locals.filters = {
		post: req.params.post,
  };
  
	// Load events
	view.on('init', function (next) {

    // var q = Event.model.find().where('name').sort('-publishDate').limit(4);

    var q = Event.model.find();
    

		q.exec(function (err, results) {
      console.log(results);
			locals.posts = results;
			next(err);
		});

	});

  // Render the view
  view.render('addEvent');
};

// module.exports = function(req, res) {
//   res.render('addEvent');
// };
