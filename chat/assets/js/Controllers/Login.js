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
            var result = this._isLoggedIn();
            if(result){return result}

            this.view = new LoginView({
                model: this.options.accountManager
            });

            this.listenTo(this.view, {
                'login': this._onLogin
            });

            this.options.applicationView.showContent(this.view);
        },

        logout: function(){
            this.options.accountManager.clear();    
            this.options.accountManager.trigger('userUpdate');
            localStorage['SAILS-PrivateUser'] = '';
            this.options.router.navigate('login', true);
            io.socket.post('/logout');
        },

        register: function () {
            var result = this._isLoggedIn();
            if(result){return result}

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
                    that.options.accountManager.trigger('userUpdate');
                    that.options.router.navigate('chat/',true);
                }
            });
        },

        _onRegister: function(data){
            var that = this;
            io.socket.post('/user', data, function(user){
                if(!user.error){
                    console.log('user login success', user);
                    that._onLogin(data)
                }
            });
        },

        _isLoggedIn: function(){
            if(localStorage['SAILS-PrivateUser'] && localStorage['SAILS-PrivateUser'].name){
                this.options.router.navigate('chat/',true);
            }
            return localStorage['SAILS-PrivateUser'];
        }
    });
});
