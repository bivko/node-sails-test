define([
    'jquery',
    'backbone',
    'DataLayer/ModelSyncExtension',
    'DataLayer/ServerCommandExecutor',
    'DataLayer/ServerInteractionSerializersHash',
    'backbone.safe',
    'jqueryCookie'

], function ($, Backbone, ModelSyncExtension, ServerCommandExecutor, ServerInteractionSerializersHash) {
    'use strict';

    var AccountManager = Backbone.Model.extend({
        idAttribute: 'Id',
        defaults: function () {
            return {
                id: null,
                username: null,
                role: null
            };
        },

        safe: {
            key: 'SAILS-PrivateUser',
            reload: false
        },

        initialize: function () {
            if (this.safe.reload && typeof(this.safe.reload) != "boolean") {
                this.safe.reload();
            }
        },

        validate: function (args, options) {

        }
    });

    ModelSyncExtension.extend(AccountManager.prototype, {
//        "update": ServerInteractionSerializersHash.AccountManager.update
    });

    return AccountManager;
});
