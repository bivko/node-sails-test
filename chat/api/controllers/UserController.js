/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt');

module.exports = {
  home: function(req, res){
    var user = false;
    if(req.session.user){
      Messages.subscribe(req.socket);

      user = req.session.user;
    }
    res.view('homepage', {
      user: user
    });
  },

  register: function(req, res){
    res.view('register', {
      user: req.session.user || false
    });
  },

	login: function(req, res){
    var username = req.body.username,
      password = req.body.password;

    User.find(function foundUsers(err, users){
      if(err) return next(err);
      //User.subscribe(req.socket);
      User.subscribe(req.socket, users);
    });

    User.findOneByUsername(username, function(err, user){
      if(user){
        bcrypt.compare(password, user.password, function(err, match){
          if(match){
            req.session.user = user;

            user.loggedIn = true;
            user.save(function(err, user) {
              if(err) return next(err);

              User.publishUpdate(user.id, {
                loggedIn: true,
                id: user.id,
                username: user.username
              });

              res.json({
                id: user.id
              });
            });
          }
        });
      }
    });
  },

  logout: function(req, res){
    User.findOneByUsername(req.session.user.username, function(err, user){
      if(user){
        user.loggedIn = false;
        user.save(function(err, user) {
          if(err) return next(err);

          User.publishUpdate(user.id, {
            loggedIn: false,
            id: user.id
          });
        });
      }
    });

    req.session.user = null;
    res.view('homepage', {
      user: false
    });
  }
};

