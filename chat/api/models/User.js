/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    username: 'string',
    password: 'string',
    loggedIn: 'boolean'
  },

  beforeCreate: function(value, next){
    bcrypt.hash(value.password, 8, function(err, hash){
      if(err) return next(err);
      value.password = hash;
      next();
    });
  }

};

