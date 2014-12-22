define([
    'marionette',
    'Controllers/Constants',
    'text!Templates/Header.html'
], function (Marionette, Constants, template) {

    return Marionette.ItemView.extend({
        className: 'container',
        template: _.template(template),

        events:{

        },

        serializeData: function(){
            return {
                user: this.user
            }
        },

        initialize: function (params) {
            this.user = localStorage['SAILS-PrivateUser'] ? JSON.parse(localStorage['SAILS-PrivateUser']) : null;
        },

        onRender: function () {

        }
    });
});