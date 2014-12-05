define([
    'underscore',
    'Controllers/ControllerBase',

    'Views/Login/View'

],function(_, ControllerBase, LoginView){

    return ControllerBase.extend({
        titleHeader:'Sign in',

        initialize:function(){
            ControllerBase.prototype.initialize.apply(this, arguments);
        },

        login: function(){
            this.accountManager = this.options.accountManager;

            this.view = new LoginView({
                model:this.accountManager
            });

            this.listenTo(this.view, {
                'login':this._onLogin
            });

            // Show view
            this.options.applicationView.showContent(this.view);
        },

        logout: function(){
            var that = this;
            io.socket.post('/logout', function(){
                that.options.accountManager.clear();
                that.options.router.navigate('login', true);
            });
        },

        _onLogin:function(data){
            var that = this;
            io.socket.post('/login', data, function(user){
                if(user.error){
                    console.log('user login failed', user);
                }else{
                    localStorage['SAILS-PrivateUser'] = JSON.stringify(user);
                    that.options.accountManager.set(user);
                    that.options.router.navigate('',true);

                }
            });
        }
    });
});