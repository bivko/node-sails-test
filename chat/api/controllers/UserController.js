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
      password = req.body.password,
      sessionUser;

    User.findOneByUsername(username, function(err, user){
      if(user){
        bcrypt.compare(password, user.password, function(err, match){
          if(match){
            User.subscribe(req, user);
            req.session.user = user;
            sessionUser = user;

            user.loggedIn = true;
            user.save(function(err) {
              if(err) {
                console.log(err)
              }else{
                sails.sockets.blast('user_logged_in', user, req.socket);
              }

            });

            res.view('homepage', {
              user: user
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
        user.save(function(err) {
          if(err) {
            console.log(err)
          }else{
            sails.sockets.blast('user_logged_out', user.id, req.socket);
          }

        });
      }
    });

    req.session.user = null;
    res.view('homepage', {
      user: false
    });
  }
};

