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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Expose-Headers', 'Authorization, header-a');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();

});
app.get('/',function(req,res){
  res.send('welcome to Api exprees..');

});
app.get('/patient', bodyParser.json(),function(req,res){
  pool.getConnection(function(err,connection){
    var query='select * from tbl_patient';
    connection.query(query,function(err,rows){
      connection.release();
      if(err){
        console.log(err);
        res.status(500).send('500 Error : ' + err);
      }
      else
      {
        res.status(200).json(rows);
      }
    })
  })

})

app.get('/patientID',function(req,res){
  if (req.query.PID) {
    console.log('id - '+req.query.PID);
    pool.getConnection(function (err, connection) {
      var query = "select * from tbl_patient where PID='" +req.query.PID + "'";
      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          console.log(err);
          res.status(500).send('500 Error :' + err);
        }
        else {
          res.status(200).json(rows);
        }
      })
    })
  }
  else
  {
    console.log("error in PID");
  }
})
app.get('/patientID/:PID',function(req,res){
  if (req.params.PID) {
    console.log('id - '+req.params.PID);
    pool.getConnection(function (err, connection) {
      var query = "select * from tbl_patient where PID='" +req.params.PID + "'";
      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          console.log(err);
          res.status(500).send('500 Error :' + err);
        }
        else {
          res.status(200).json(rows);
        }
      })
    })
  }


  else
  {
    console.log("error in PID");
  }
})
app.post('/insertPatient',function(req,res){
  try{

    //console.log(req.body);
    /*for(var i in req){
     console.log(i);
     }*/
    pool.getConnection(function(err,connection){

      var query="insert into tbl_patient(Name,LastName,Dateofbirth,Gender,Age,Address,MobileNo,Email,Passwords,PCodel,CreateDate,Problem ) values "+
          "('" + req.body['Name'] + "','" +req.body['LastName'] + "','"+ req.body['Dateofbirth'] + "','" +req.body['Gender'] + "','" + req.body["Age"] + "','" + req.body["Address"] +
          "','"+req.body['MobileNo']+"','"+req.body['Email']+"','"+req.body['Passwords']+"','"+req.body['PCodel']+"','"+req.body['CreateDate']+"','"+req.body['Problem']+"')";
      console.log(query);
      connection.query(query,function(err,rows){

        if(err){
          console.log(err);
          res.status(500).send('500 Error :' + err);
        }
        else
        {
          res.status(200).json(rows);
        }
      })
    })
  }
  catch(exception){
    res.status(500).send('500 Error :' + exception);
  }


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
