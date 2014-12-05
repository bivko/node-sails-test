/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {
  attributes: {
    email: {
      type: 'string',
      unique: true,
      required: true
    },
    username: {
      type: 'string',
      unique: true,
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    loggedIn: {
      type: 'boolean',
      defaultsTo: false
    },
    role: {
      type: 'string',
      enum: ['admin', 'moderator', 'user'],
      defaultsTo: 'user'
    },
    chatsAllowed: {
      type: 'array',
      defaultsTo: []
    },
    location: {
      type: 'integer',
      defaultsTo: null
    }
  },

  beforeCreate: function(value, next){
    bcrypt.hash(value.password, 8, function(err, hash){
      if(err) return next(err);
      value.password = hash;
      next();
    });
  },

  setOffline: function(id, socket){
    this.findOneById(id, function(err, user){
      if(user) {
        //sails.sockets.blast('user_logged_out', user.id, socket);
        user.loggedIn = false;
        user.save(function(err, user) {
          if(err) return next(err);
          User.publishUpdate(user.id, {
            loggedIn: false,
            id: user.id
          });
        });
      }
    })
  }

};

