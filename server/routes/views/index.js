const path = require('path');
const distPath = path.join(__dirname, '../../..', 'dist');

module.exports = function(req, res) {
  // res.status(200).sendFile(distPath + '/index.html');
  res.render('index');
};
