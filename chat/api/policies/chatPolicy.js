module.exports = function(req, res, next) {
  if(req.session.user){
    var role = req.session.user.role,
        name = req.session.user.username;

    if(role == 'admin' || role == 'moderator' || name == 'bivko'){
      next();
    }else{
      req.socket.emit('chat-not-allowed');
    }
  }else{
    res.badRequest();
  }
};