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
            io.socket.request('/chat',{'forceNew': true });
            io.socket.on('chat', function(chat){
                //appendChatName(chat.data.name, chat.data.id);
                console.log('111', chat);
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
                    console.log('111', chat);
//                    var $addWrapper = $('.js-add-chat-wrapper');
//                    if($addWrapper.length){
//                        _.each(chat, function(item){
//                            $addWrapper.before('<li><a href="/chats/'+ item.id +'">'+ item.name +'</a></li>');
//                        });
//                    }else{
//                        var $wrapper = $('.navbar-nav');
//                        _.each(chat, function(item){
//                            $wrapper.append('<li><a href="/chats/'+ item.id +'">'+ item.name +'</a></li>');
//                        });
//                    }
                }
            });
        }

    });
});