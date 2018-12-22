require('dotenv').config();




var keystone = require('keystone'),
  // serve = require('serve-static'),
  // favicon = require('serve-favicon'),
  body = require('body-parser'),
  cookieParser = require('cookie-parser'),
  multer = require('multer');

// CORS middleware
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
};


var cookieSecret = 'secretCookie';


keystone.init({
  mongo: 'mongodb://testuser:testuser1@ds159866.mlab.com:59866/keystone',
  name: 'Website Name',
  brand: 'Website Brand',
  session: false,
  updates: 'updates',
  views: '/templates/views',
  auth: true,
  'user model': 'User',
  'auto update': true,
  'cookie secret': cookieSecret,
  'view engine': 'pug',
});

// Let keystone know where your models are defined. Here we have it at the `/models`
keystone.import('models');

// Serve your static assets
// app.use(serve('./public'));

const history = require('connect-history-api-fallback');
const App = require('./routes');
const World = require('./utility/global');


const localDB = {
  connectionLimit: 10,
  host: process.env.DB_HOST_LOCAL,
  port: process.env.DB_PORT_LOCAL,
  user: process.env.DB_USER_LOCAL,
  password: process.env.DB_PASS_LOCAL,
  database: process.env.DB_NAME_LOCAL,
};

const remoteDB = {
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const dbLocal = false;
const dbConfig = dbLocal ? localDB : remoteDB;


const appWithDB = new App(dbConfig);
const app = appWithDB.express;

app.use(allowCrossDomain);
app.use(history());

// const http = require('http').Server(app);
// World.io = require('socket.io')(http);

// const port = process.env.PORT;

app.use(cookieParser(cookieSecret));
app.use(body.urlencoded({ extended: true }));
app.use(body.json());
app.use(multer({ dest: './uploads/' }).any());

// http.listen(port, () => {
//   console.log(`Listening on ${port}`);
// });

process.on('SIGINT', () => {
  appWithDB.sql.pool.end(() => {
    console.log('All database connections closed & server shut down.');
    process.exit();
  });
});


keystone.set('routes', app);

// keystone.set('routes', require('./routes'));
// keystone.start();



keystone.start({
  onHttpServerCreated : function() {

    World.io = require('socket.io')(keystone.httpServer);
    

    // Attach session to incoming socket
    World.io.use(function(socket, next) {
      keystone.expressSession(socket.request, socket.request.res, next);
    });

    require('./game');

  }
});




