'use strict';

/* Import node modules */
var express = require('express'),
    mongoose = require('mongoose'),
    cons = require('consolidate'),
    passport = require('passport'),
    flash = require('connect-flash'),
    config = require('./config'),
    app = express();

/* Configuration */
app.configure(function () {
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.cookieParser());
  app.set('views', __dirname + '/app/views');
  app.use('/public', express.static(__dirname + '/public'));

  //handlebars engine
  app.engine('html', cons.ractive);
  app.set('view engine', 'html');

  //authentication uses
  app.use(express.session({secret: config.CHAT_APP_SECRET}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(app.router);
});

/* Connect to db */
app.configure('production', function(){
  mongoose.connect('localhost', 'missout');
});
app.configure('development', function(){
  mongoose.connect('localhost', 'missout-test');
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});
app.configure('test', function(){
  mongoose.connect('localhost', 'missout-test');
});

/* Passport Strategies */
require('./app/passport/passport')(passport);

/* Get Routes */
require('./app/routes/authenticate')(app, passport);

/* Feed update API route */
require('./app/controllers/feed.js')(app);

/* Get Routes */
require('./app/controllers/feed')(app, passport) ;

var routeFactory = require('./app/routes/routeGenerator').routeFactory;
routeFactory('/api/v1/users', '../models/user', app);
routeFactory('/api/v1/posts', '../models/post', app);
routeFactory('/api/v1/feed', '../controllers/feed', app);

/* Hey! Listen! */
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Listening on ' + port);
});
