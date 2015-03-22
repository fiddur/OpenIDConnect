/**
 * Module dependencies.
 */

var bodyParser = require('body-parser');
var express = require('express');
var http = require('http');
var logger = require('morgan');
var passport = require('passport');
var openid = require('passport-openidconnect');

var app = module.exports = express();

/*
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
//*/

passport.use(new openid.Strategy({
  authorizationURL: 'http://localhost:3001/user/authorize',
  tokenURL: 'http://localhost:3001/user/token',
  clientID: '73e7ea98700270fd98f1ed168838e2ec',
  clientSecret: 'ab80faca8ed14b4d20d7c8e6fabee5de',
  callbackURL: 'http://localhost:3000/users',
  userInfoURL: 'http://localhost:3000/users/3'
},
function(accessToken, refreshToken, profile, done) {
  console.log('accessToken');
  console.log(accessToken);
  console.log('refreshToken');
  console.log(refreshToken);
  console.log('profile');
  console.log(profile);
  console.log('done');
  console.log(done.toString());
  var loggedinUser = {
    oauthID: profile.id,
    name: profile.displayName,
    created: Date.now()
  };
  done(null, loggedinUser, {boss: 'fleek'});
  /*
  User.findOne({oauthID: profile.id}, function(err, user) {
    if(err) { console.log(err); }
    if (!err && user != null) {
      done(null, user);
    } else {
      var user = new User({
        oauthID: profile.id,
        name: profile.displayName,
        created: Date.now()
      });
      user.save(function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("saving user ...");
          done(null, user);
        };
      });
    };
  });
  //*/
}
/*
function(err, result) {
  console.log(err);
  console.log(result);
  console.log('Hello world');
  return false;
}
//*/
));

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(express.session({secret: 'keyboard cat'}));
app.use(passport.initialize());

/*
app.configure(function() {
  app.use(express.static(__dirname + '/../../public'));
  app.use(express.cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(express.session({secret: 'keyboard cat'}));
  app.use(passport.initialize());
  app.use(passport.session());
});
//*/

// Ad-hoc example resource method

app.resource = function(path, obj) {
  this.get(path,
    passport.authenticate('openidconnect', { session: false }),  // THIS WORKS!!
    obj.index);
  this.get(path + '/:a..:b.:format?', function(req, res){
    var a = parseInt(req.params.a, 10);
    var b = parseInt(req.params.b, 10);
    var format = req.params.format;
    obj.range(req, res, a, b, format);
  });
  this.get(path + '/:id', obj.show);
  this.delete(path + '/:id',
    function(req, res){
      var id = parseInt(req.params.id, 10);
      obj.destroy(req, res, id);
    });
};

// Fake records

var users = [
  {
    email: 'tj@example.org',
    name: 'tj'
  }, {
    email: 'ciaran@example.org',
    name: 'ciaran'
  }, {
    email: 'aaron@example.org',
    name: 'aaron'
  }, {
    email: 'guillermo@example.org',
    name: 'guillermo'
  }, {
    email: 'simon@example.org',
    name: 'simon'
  }, {
    email: 'tobi@example.org',
    name: 'tobi'
  }
];

// Fake controller.

var User = {
  index: function(req, res){
    res.send(users);
  },
  show: function(req, res){
    var user = users[req.params.id] || { error: 'Cannot find user' };
    user.sub = req.params.id;
    res.send(user);
  },
  destroy: function(req, res, id){
    var destroyed = id in users;
    delete users[id];
    res.send(destroyed ? 'destroyed' : 'Cannot find user');
  },
  range: function(req, res, a, b, format){
    var range = users.slice(a, b + 1);
    switch (format) {
      case 'json':
        res.send(range);
        break;
      case 'html':
      default:
        var html = '<ul>' + range.map(function(user){
          return '<li>' + user.name + '</li>';
        }).join('\n') + '</ul>';
        res.send(html);
        break;
    }
  }
};

// curl http://localhost:3000/users     -- responds with all users
// curl http://localhost:3000/users/1   -- responds with user 1
// curl http://localhost:3000/users/4   -- responds with error
// curl http://localhost:3000/users/1..3 -- responds with several users
// curl -X DELETE http://localhost:3000/users/1  -- deletes the user

app.resource('/users',
    User);

app.get('/',
  passport.authenticate('openidconnect', { session: false }),  // THIS WORKS!!
  function(req, res){
    res.send([
        '<h1>Examples:</h1> <ul>'
      , '<li>GET /users</li>'
      , '<li>GET /users/1</li>'
      , '<li>GET /users/3</li>'
      , '<li>GET /users/1..3</li>'
      , '<li>GET /users/1..3.json</li>'
      , '<li>DELETE /users/4</li>'
      , '</ul>'
    ].join('\n'));
  });

/* istanbul ignore next */
/*
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
//*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
