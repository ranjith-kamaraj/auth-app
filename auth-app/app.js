const express = require('express');
const path = require('path');
const logs = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bunyan = require('bunyan');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const logger = bunyan.createLogger({
  name: 'auth-app',
  env: process.env.NODE_ENV,
  serializers: bunyan.stdSerializers,
  src: true
});

require('./passport')(passport);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).
  then(() => {
    logger.info(`Database connected successfully!`);
    console.log('Database connected successfully!');
  });

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth')(passport);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logs('dev'));
app.use(express.json());
app.use(cookieParser()); //read cookies (needed for auth)
app.use(bodyParser()); //get info from html forms
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'thesecret',
  saveUninitialized: false,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter)

app.listen(3000, () =>{
  console.log(`Application running in port: ${3000}`);
  logger.info(`Application running in port: ${3000}`)
});


