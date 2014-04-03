'use strict';

var fs = require('fs');
var indexSource = fs.readFileSync(__dirname + "/../views/layout.html");

module.exports = function(app, passport) {

// normal routes ===============================================================

  // APP SECTION =========================
  app.get('/', isLoggedIn, function(req, res) {
    res.set('Content-Type', 'text/html');
    return res.send(indexSource);
  });

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

  app.get('/login', function(req, res) {

    res.render('login.html', { message: req.flash('loginMessage') ,
    partials:
    {
      header: 'partials/header',
      footer: 'partials/footer'
    }});
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {

    res.render('signup.html', { message: req.flash('signupMessage') ,
    partials:
    {
      header: 'partials/header',
      footer: 'partials/footer'
    }});
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

// facebook -------------------------------

  // send to facebook to do the authentication
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect : '/',
      failureRedirect : '/login'
    }));

// twitter --------------------------------

  // send to twitter to do the authentication
  app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/',
      failureRedirect : '/login'
    }));

};

// route middleware to ensure user is logged in
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}
