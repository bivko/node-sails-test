define([], function () {
    'use strict';


    return {
        AccountManager: {
            login: {
                buildRequest: function (options, model) {
                    return {
                        type: 'POST',
                        url: 'login',
                        request: options.cdata
                    };
                },
                parseResponse: function (response) {
                    if (response.Data) {
                        return response.Data;
                    } else {
                        return response.responseJSON.Description;
                    }
                }
            },

            logout: {
                buildRequest: function (options, model) {
                    return {
                        type: 'POST',
                        url: 'logout',
                        request: {}
                    };
                },
                parseResponse: function (response) {
                    return response.Data;
                }
            }
        }

//        UserManager: {
//            getAll: {
//                buildRequest: function (options) {
//                    return {
//                        type: 'GET',
//                        url: 'GetUserList',
//                        request: options.cdata
//                    };
//                },
//
//                parseResponse: function (response, options) {
//                    return options.xhr.responseJSON.Data;
//                }
//            }
//        },



    };
});

