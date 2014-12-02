/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt');
var moment = require('moment');

module.exports = {
  register: function(req, res){
    res.view('register', {
      user: req.session.user || false
    });
  },

	login: function(req, res){
    var email = req.body.email,
      password = req.body.password;

    User.find(function foundUsers(err, users){
      if(err) return next(err);
      User.subscribe(req.socket, users);
    });

    User.findOneByEmail(email, function(err, user){
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
  },

  showList: function(req, res){
    if(req.session.user){
      User.findOneByEmail(req.session.user.email, function(err, user){
        var role = user.role,
            name = user.username;

        if(!err && (role == 'admin' || name == 'bivko')){

          User.find(function(err, users){
            if(err) return next(err);

            Chat.find(function(err, chats){
              if(err) return next(err);

              res.view('userslist',{
                user: req.session.user,
                model: users,
                chats: chats,
                moment: moment
              });
            });

          });

        }else{
          res.redirect('/');
        }
      });
    }else{
      res.redirect('/');
    }
  },

  changeRole: function(req, res){
    if(req.session.user){
      User.findOneByEmail(req.session.user.email, function(err, user){
        var role = user.role,
            name = user.username;

        if(!err && (role == 'admin' || name == 'bivko')){
          User.findOne(req.body.id, function foundUsers(err, user){
            if(err) return next(err);

            user.role = req.body.role;
            user.save(function(err, user) {
              if(err) return next(err);
              res.json(user);
            });
          });
        }else{
          res.json({
            error: true,
            status: 2 // wrong role
          });
        }
      });
    }else{
      res.json({
        error: true,
        status: 1 // no user logged
      });
    }
  }

};

