var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql =require('mysql');



var app = express();
var pool=mysql.createPool({
  host:'g8r9w9tmspbwmsyo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user:'ckaxbwfxnaht37s9',
  password:'dfb06foiwmy2gwy0',
  database:'fapzrey0e61b3lyj',
  ConnectionLimit:20
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();

});
app.get('/',function(req,res){
  res.send('welcome to Api exprees..');

});
app.get('/patient',function(req,res){
  pool.query('select * from tbl_patient',function(err,rows,fields){
    if(!err){
      res.send(rows[0]);
    }
    else
    {
      console.log('Error while performing Query');
    }
  })
})
app.get('/admin',function(req,res){
  pool.query("select* from usertypes",function(err,rows,fields){
    if(!err){
      res.send(rows[0]);
    }
    else
    {
      console.log('Error while performing Query');
    }
  });

});
app.use(redirectUnmatched);

function redirectUnmatched(req,res){
  console.log("No route matched - redirctUnmatched");
  res.status(404).send('404 Error :No Rows Found');

}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
