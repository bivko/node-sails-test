define([
    'underscore',
    'Controllers/Login',
    'Controllers/Chat'

], function (_, Login, Chat) {
    'use strict';

    return {
        create: function (application, router) {
            var params = {
                router: router,
                applicationView: application.applicationView,
                accountManager: application.accountManager,
                app: application
            };

            var controllers = {
                loginController: new Login(params),
                chatController: new Chat(params)
            };

            _.forEach(controllers, function (controller, name) {
                controller.name = name;
            });

            return controllers;
        }
    };
});
