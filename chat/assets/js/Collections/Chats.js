define([
    'backbone',
    'Collections/Base',
    'Models/Chat'

], function (Backbone, BaseCollection, Model) {
    'use strict';

    var Collection = BaseCollection.extend({
        model: Model,

        _subscribeToMessgaes: function (data) {
            var that = this;
            io.socket.request('/messages',{'forceNew': true });
            io.socket.on('messages', function(msg){
                if(msg.data && msg.data.body){
                    that.add(msg.data);
                    that.trigger('messagesAdded', msg.data);
                }
            });

            this._getMessages();
        },

        _getMessages: function(){
            var that = this;
            io.socket.get('/messages?limit=20&sort=createdAt desc', function(msg){
                msg.reverse();
                that.set(msg);
                that.trigger('messagesAdded');
            });
        },

        _addMessage: function(message){
            var that = this;
            io.socket.post('/messages', {body: message}, function(msg){
                that.add(msg);
                that.trigger('messagesAdded', msg);
            });
        },

        _subscribeToUsers: function(){
            var that = this;
            io.socket.request('/user',{'forceNew': true });
            io.socket.on('user', function(user){
                if(user.data.loggedIn){
                    that.add(user.data);
                }else{
                    that.remove(user.data.id)
                }
                that.trigger('update:UserList');
            });

            this._getUsers();
        },

        _getUsers: function(){
            var that = this;
            io.socket.get('/user', function(users){
                var logged = _.filter(users, function(item){
                    return item.loggedIn;
                });
                that.set(logged);
                that.trigger('update:UserList');
            });
        }
    });

    return Collection;
}); 