define([
    'underscore',
    'marionette',
    'text!Templates/Chat/Index.html',
    'Components/MessagePopup/View'
],function(_, Marionette, template, ViewMessagePopup) {

    return Marionette.ItemView.extend({
        className: 'page-signin',
        template: _.template(template),

        events:{

        },

        initialize:function(options){

        }
    });
});