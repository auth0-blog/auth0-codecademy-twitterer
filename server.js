var http = require('http');
var express = require('express');
var cors = require('cors');
var app = express();
var jwt = require('express-jwt');

var keys = require('./keys');

var authenticate = jwt(keys.auth0);
var tu = require('tuiter')(keys.twitter);


app.configure(function () {
  
 // Request body parsing middleware should be above methodOverride
  app.use(express.bodyParser());
  app.use(express.urlencoded());
  app.use(express.json());
  
  app.use('/api', authenticate);
  app.use(cors());

  app.use(app.router);
});

app.post('/api/finished', function(req, res) {
  var handle = req.body.handle;
  if (handle) {
    var text = '@' + handle + ' implemented a login with Angular and Auth0 in 5 minutes. You should try it out!';
    tu.update({status: text}, function(err, data) {
      if (err) {
        res.send(400, {error: "Can't tweet", obj: err});  
      } else {
        res.send(200);
      }
    })  
  } else {
    res.send(400, {error: 'No handle was provided'});
  }
  
});


var port = process.env.PORT || 5000;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});