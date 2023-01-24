var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose'); // mongodb
var bodyParser = require('body-parser');
var session = require('express-session');
require('dotenv/config');


mongoose.set('strictQuery', false)

var indexRouter = require('./routes/index');
var placeRouter = require('./routes/place');
var loginRouter = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({secret:process.env.SESSION_SECRET, saveUninitialized:false, resave:false}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/place', placeRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = 5000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
  
})

// db connection
mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true})
.then( () => {
  console.log('Connected to Database!');
  
})
.catch( (err) => {
  console.log(err);
});

module.exports = app;
