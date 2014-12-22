define([
    'underscore',
    'marionette',
    'text!Templates/Register/Index.html',
    'Components/MessagePopup/View'
],function(_, Marionette, template, ViewMessagePopup) {

    return Marionette.ItemView.extend({
        className: 'page-register',
        template: _.template(template),

        events:{
            'submit form':'_onSubmit'
        },

        initialize:function(options){
            this.listenTo(this, {
                'error':this._onError,
                'success':this._onSuccess
            }, this);
        },

        _onSubmit:function(e){
            e.preventDefault();

            var $form = e ? $(e.currentTarget) : this.$el.find('form'),
                sdata = $form.serializeJSON(),
                data;

            
            console.log(sdata);

            if(!sdata.email){
                alert("Enter user Email");
                return false;
            }else if(!sdata.username){
                alert("Enter user login");
                return false;
            }else if(!sdata.password || sdata.password !== sdata.confirm){
                alert("Pasword don't match")
                return false;
            }

            data = {
                username: sdata.username,
                email: sdata.email,
                password: sdata.password
            };

            this.trigger('register', data);

            return false;
        },

        _onError:function(e, data, resp){
            var view = new ViewMessagePopup({
                title: 'Sign In',
                header: 'Sign In failed',
                status: 'error',
                list: [data],
                buttons: [{
                    'class': 'btn btn-success js-close',
                    title: 'Ok'
                }]
            });
            $('body').append(view.render().$el).find('.js-send-message').prop('disabled',false);
        },


        _onSuccess:function(){
            console.log('success');
        }
    });
});