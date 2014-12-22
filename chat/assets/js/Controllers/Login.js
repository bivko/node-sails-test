define([
    'underscore',
    'Controllers/ControllerBase',

    'Views/Login/View',
    'Views/Register/View'
],function(_, ControllerBase, LoginView, RegisterView){

    return ControllerBase.extend({
        titleHeader:'Sign in',

        initialize: function(){
            ControllerBase.prototype.initialize.apply(this, arguments);
        },

        login: function(){
            this.view = new LoginView({
                model: this.options.accountManager
            });

            this.listenTo(this.view, {
                'login': this._onLogin
            });

            this.options.applicationView.showContent(this.view);
        },

        logout: function(){
            var that = this;
            io.socket.post('/logout', function(){
                that.options.accountManager.clear();
                that.options.router.navigate('login', true);
            });
        },

        register: function () {
            this.view = new RegisterView({
                model: this.options.accountManager
            });

            this.listenTo(this.view, {
                'register': this._onRegister
            });

            this.options.applicationView.showContent(this.view);
        },

        _onLogin: function(data){
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
        },

        _onRegister: function(data){
            var that = this;
            io.socket.post('/user', data, function(user){
                if(user.error){
                    console.log('user login failed', user);
                }else{
                    console.log('user login success', user);
                }
            });
        }
    });
});
