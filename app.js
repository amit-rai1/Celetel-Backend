
const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
var path = require('path');

var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./route/index');
var usersRouter = require('./route/users');
var authRouter = require('./route/auth');

import  bodyParser  from 'body-parser';
import cors from 'cors';

const { ConfidentialClientApplication } = require('@azure/msal-node');


import { mongoconnection } from './db';

import clientRoute from './route/clientRoute'
import socialRoute from './route/socialRoute'
const linkdinRoute =  require('./route/linkedinRoute')
import sessionMiddleware from './middleware/sessionMiddleware';
import linkedinStrategy from './controller/linkedinStrategy';
const cookieSession = require("cookie-session");

const app = express()

// console.log(Date.now(),"app");

mongoconnection();

app.use(cors({origin:'http://localhost:8600',
methods:"GET,POST,PUT,DELETE",
credentials:true
}));
app.use(bodyParser.urlencoded({
    extended:true
}));


app.use(bodyParser.json())

// app.use("/api/client",client)
app.get("/",(req,res)=>{
    res.send("server listining on 8600")
})

// app.get("/",(req,res)=>{
//     res.send("server listining on 3000")
// })

app.use(session({
    secret: 'somethingsecretgoeshere',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
 }));


 passport.use(linkedinStrategy);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
app.use(express.static(path.join(__dirname, 'public')));

// Passport initialization and session setup
app.use(passport.initialize());
app.use(passport.session());

// Use the defined routes
app.use('/auth', socialRoute);



app.use('/api/client', clientRoute);

app.use('/auth', linkdinRoute);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



  

export default app;