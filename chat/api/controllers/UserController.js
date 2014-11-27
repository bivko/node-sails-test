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

    User.findOneByUsername(username, function(err, user){
      if(user){
        bcrypt.compare(password, user.password, function(err, match){
          if(match){
            req.session.user = user;
            res.view('homepage', {
              user: user
            });
          }
        });
      }
    });
  },

  logout: function(req, res){
    req.session.user = null;
    res.view('homepage', {
      user: req.session.user || false
    });
  }
};

