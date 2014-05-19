var http = require('http');
var express = require('express');
var cors = require('cors');
var app = express();
var jwt = require('express-jwt');
var moment = require('moment');

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

var type = {
  angular: {
    text: 'AngularJS',
    url: 'http://www.codecademy.com/courses/web-beginner-en-2jq60/1/1'
  },
  vanilla: {
    text: 'vanilla javascript',
    url: 'http://www.codecademy.com/courses/web-beginner-en-2jq60/0/1'
  },
  quiz: {}
};

app.post('/api/finished', function(req, res) {
  var handle = req.body.handle;
  if (handle) {

    if (handle.indexOf(' ') > -1) {
      handle = handle.substr(0, handle.indexOf(' '));
    }

    var text;
    if (req.body.type === 'quiz') {
      text = "@" + handle + " won FREE Bitcoins at Auth0's booth. #gluecon";
    } else {
      var minutes = 10;
      var seconds = 0;
      
      if (req.body.start && req.body.end) {
        var start = moment(parseInt(req.body.start, 10));
        var end = moment(parseInt(req.body.end, 10));
        var diff = moment.duration(end.diff(start));

        if (diff.asMinutes() <= 10) {
          minutes = diff.minutes();
          seconds = diff.seconds();
          console.log("Diff is", minutes, seconds, diff.asMinutes());
        }
      }

      var exType = type[req.body.type || 'angular'] || type.angular;

      text = '@' + handle + ' implemented a login with ' + exType.text + ' and Auth0 in ' +
        minutes + 'm' + (seconds ? ' ' + seconds + 'sec' : '') + '. You should try it out';

      if (text.length <= 140 - (22 + 2 + 10)) {
        text += ': ' + exType.url;
      }

      text += '. #gluecon'
    }
    

    tu.update({status: text}, function(err, data) {
      if (err) {
        res.send(err.status, {error: "Can't tweet", obj: err});  
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