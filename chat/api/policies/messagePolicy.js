module.exports = function(req, res, next) {
  if(req.session.user){
    if(req.session.user.loggedIn){
      req.body.username = req.session.user.username
      next();
    }else{
      res.badRequest();
    }
  }else{
    next('Must be logged in');
  }
};
