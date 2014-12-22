define([
    'underscore',
    'Controllers/ControllerBase',
    'Views/Chat/ChatView'

],function(_, ControllerBase, ChatView){

    return ControllerBase.extend({
        titleHeader:'Sign in',

        initialize:function(){
            ControllerBase.prototype.initialize.apply(this, arguments);
        },

        renderChat: function(id){
            io.socket.request('/messages',{'forceNew': true });
            io.socket.request('/user',{'forceNew': true });


            this.subscribeToChats();
            this.getChatsList();

            this.view = new ChatView();
            this.options.applicationView.showContent(this.view);
        },

        subscribeToChats: function(){
            var that = this;
            io.socket.request('/chat',{'forceNew': true });
            io.socket.on('chat', function(chat){
                that._appendChatName(chat.data.name, chat.data.id);
            });
        },

        getChatsList: function(){
            var that = this;
            io.socket.get('/chat', function(chat){
                if(chat.error){
                    that.options.accountManager.clear();
                    that.options.router.navigate('login',true);
                }
                if(chat.length){
                    var $addWrapper = $('.js-add-chat-wrapper');
                    if($addWrapper.length){
                        _.each(chat, function(item){
                            $addWrapper.before('<li><a href="/chats/'+ item.id +'">'+ item.name +'</a></li>');
                        });
                    }else{
                        var $wrapper = $('.navbar-nav');
                        _.each(chat, function(item){
                            $wrapper.append('<li><a href="/chats/'+ item.id +'">'+ item.name +'</a></li>');
                        });
                    }
                }
            });
        },

        _appendChatName: function(name, url){
            var $addWrapper = $('.js-add-chat-wrapper');
            if($addWrapper.length){
                $addWrapper.before('<li><a href="/chats/"+url>'+ _.escape(name) +'</a></li>');
            }else{
                var $wrapper = $('.navbar-nav');
                $wrapper.append('<li><a href="/chats/"+url>'+ _.escape(name) +'</a></li>');
            }
        }

    });
});