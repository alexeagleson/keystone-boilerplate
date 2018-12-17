require('dotenv').config();

const history = require('connect-history-api-fallback');
const App = require('./routes');
const World = require('./utility/global');

// CORS middleware
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
};

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

const dbLocal = true;
const dbConfig = dbLocal ? localDB : remoteDB;

const appWithDB = new App(dbConfig);
const app = appWithDB.express;

app.use(allowCrossDomain);
app.use(history());

const http = require('http').Server(app);
World.io = require('socket.io')(http);

const port = process.env.PORT;

http.listen(port, () => {
  console.log(`Listening on ${port}`);
});

process.on('SIGINT', () => {
  appWithDB.sql.pool.end(() => {
    console.log('All database connections closed & server shut down.');
    process.exit();
  });
});

require('./game');









