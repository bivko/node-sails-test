define([
    'underscore',
    'marionette',
    'text!Templates/Chat/Index.html',
    'text!Templates/Chat/Message.html',
    'Components/MessagePopup/View'
],function(_, Marionette, template, templateMessage, ViewMessagePopup) {

    return Marionette.ItemView.extend({
        className: 'page-signin',
        template: _.template(template),
        templateMessage: _.template(templateMessage),

        events:{
            'submit #messages-form': 'onSubmit'
        },

        initialize:function(params){
            this.messageCollection = params.messageCollection;
            this.usersInChatCollection = params.usersInChatCollection;

            this.listenTo(this.messageCollection, {
                'messagesAdded': this._drawMessages
            }, this);

            this.listenTo(this.usersInChatCollection, {
                'update:UserList': this._drawUsers
            }, this);

        },

        onSubmit: function(e){
            e.preventDefault();
            var $msgField = this.$el.find('#message'),
                msg = $msgField.val();

            if(msg){
                $msgField.val('');
                this.trigger('submit:MessageForm', msg);
            }
            return false;
        },

        _drawMessages: function(msg){
            var that = this;

            if(msg){
                this._displayMessage(msg);
            }else{
                _.each(this.messageCollection.toJSON(), function(msg){
                    that._displayMessage(msg);
                });
            }
            this._scrollContainer();
        },

        _displayMessage: function(msg){
            this.$el.find('.messages-list').append(this.templateMessage(msg));
        },

        _scrollContainer: function(){
            this.$el.find('.message-wrapper').scrollTop(this.$el.find('.messages-list').height());
        },

        _drawUsers: function(){
            var $wrapper = this.$el.find('.users-list'),
                usersList = _.sortBy(this.usersInChatCollection.toJSON(), 'username');

            $wrapper.html('');
            _.each(usersList, function(item){
                $wrapper.append('<li class="js-user-'+item.id+'">'+ _.escape(item.username) +'</li>');
            });
        }

    });
});