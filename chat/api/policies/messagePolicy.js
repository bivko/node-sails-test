module.exports = function(req, res, next) {
  if(req.session.user && req.session.user.loggedIn){
    req.body.username = req.session.user.username;
    next();
  }else{
    req.socket.emit('session-expired');
  }

};
