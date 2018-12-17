const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const uniqid = require('uniqid');
const mysql = require('mysql');

const distPath = path.join(__dirname, '..', 'dist');
const secret = process.env.JWT_SECRET;
const saltRounds = 10;

class SQLHandler {
  constructor(databaseConfig) {
    this.config = databaseConfig;
    this.pool = null;
  }

  connect() {
    this.pool = mysql.createPool(this.config);
  }
}

class User {
  constructor(username) {
    this.id = uniqid();
    this.username = username;
  }

  generateAuthToken(jwtSecret) {
    this.token = jwt.sign(this.username, jwtSecret);
  }
}

const validateUsername = (textValue, formName, min = null, max = null) => {
  if (!(typeof textValue === 'string')) return `${formName} must be text.`;
  if (textValue.length === 0) return `${formName} cannot be empty.`;
  if (min !== null && max !== null && (textValue.length < min || textValue.length > max))
    return `${formName} must be between ${min} and ${max} characters long.`;
  const matchValidBasicUsername = textValue.match(/^[a-zA-Z0-9_ .-]*$/);
  if (!matchValidBasicUsername) return `${formName} can only contain basic letters and numbers.`;
  return true;
};

class App {
  constructor(config) {
    this.express = express();
    this.sql = null;
    this.configureRendering();
    this.connectToDatabase(config);
    this.mountRoutes();
  }

  configureRendering() {
    this.express.use(express.static(distPath));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
  }

  mountRoutes() {
    const router = express.Router();

    router.get('/newtable', (req, res) => {
      this.sql.pool.query(
        `CREATE TABLE IF NOT EXISTS users (
            id varchar(18) NOT NULL,
            admin TINYINT(1) NOT NULL,
            username varchar(100) NOT NULL,
            password char(60) NOT NULL,
            PRIMARY KEY (id)
          )`,
        (formError) => {
          if (typeof formError === 'string') {
            return res.header('x-auth', 'error').send({ error: formError });
          }
        }
      );
    });

    router.get('/verifyuser', (req, res) => {
      this.sql.pool.query(
        `SELECT username, admin, password FROM users WHERE username = ?`,
        [req.query.username],
        (error, userResult) => {
          if (userResult.length > 0 && req.query.admin !== 'false') {
            res.status(200).header('x-auth', 'success').send({});
          } else {
            res.status(401).header('x-auth', 'error').send({
              error: 'User verification failed.',
            });
          }
        }
      );
    });

    router.post('/login', (req, res) => {
      let formError = validateUsername(req.body.username, 'Username', 1, 20);
      if (typeof formError === 'string') {
        return res.header('x-auth', 'error').send({ error: formError });
      }

      this.sql.pool.query(
        `SELECT username, admin, password FROM users WHERE username = ?`,
        [req.body.username],
        (error, passwordResult) => {
          if (passwordResult && passwordResult.length > 0) {
            bcrypt.compare(req.body.password, passwordResult[0].password).then(compareResult => {
              if (compareResult) {
                const currentUser = new User(passwordResult[0].username);
                currentUser.generateAuthToken(secret);
                res.header('x-auth', currentUser.token).send({
                  username: passwordResult[0].username,
                  admin: passwordResult[0].admin,
                  token: currentUser.token,
                });
              } else {
                res.header('x-auth', 'error').send({
                  error: 'Password did not match.',
                });
              }
            });
          } else {
            res.header('x-auth', 'error').send({ error: 'Username not found.' });
          }
        }
      );
    });

    router.post('/register', (req, res) => {
      let formError = validateUsername(req.body.username, 'Username', 1, 20);
      if (typeof formError === 'string') return res.header('x-auth', 'error').send({ error: formError });

      this.sql.pool.query(
        `SELECT username FROM users WHERE username = ?`,
        [req.body.username],
        (error, checkUsername) => {
          if (checkUsername && checkUsername.length > 0) {
            res.header('x-auth', 'error').send({
              error: 'Username already registered.',
            });
          } else {
            const adminBit = req.body.admin ? 1 : 0;
            bcrypt.hash(req.body.password, saltRounds).then(hash => {
              this.sql.pool.query(
                `INSERT INTO users (id, admin, username, password) VALUES (?, ?, ?, ?)`,
                [uniqid(), adminBit, req.body.username, hash],
                () => {
                  const currentUser = new User(req.body.username);
                  currentUser.generateAuthToken(secret);
                  res.header('x-auth', currentUser.token).send({
                    username: req.body.username,
                    admin: adminBit,
                    token: currentUser.token,
                  });
                }
              );
            });
          }
        }
      );
    });

    router.get('/*', (req, res) => {
      res.status(200).sendFile(distPath + '/index.html');
    });

    this.express.use('/', router);
  }

  connectToDatabase(config) {
    this.sql = new SQLHandler(config);
    this.sql.connect();
  }
}

module.exports = App;
