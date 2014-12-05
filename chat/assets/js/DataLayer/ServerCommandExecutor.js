define([
    'jquery',
    'backbone',
    'DataLayer/Constants',
    'jqueryCookie'
], function ($, Backbone, Constants) {
    'use strict';

    return {
        'execute': function (model, command, options) {
            var success = options.success,
                error = options.error,
                builder = command.buildRequest(options, model);

            options.success = function (model, resp, options) {
                success(model, command.parseResponse(resp), options);
            };

            options.error = function (model, resp, options) {
                error(model, command.parseResponse(resp), options);
            };

            options.url = Constants.serverUrl + builder.url;
            options.type = builder.type || 'POST';

            if (builder.request) {
                options.dataType = 'json';
                options.data = (options.type == 'get' || options.isFile) ? builder.request : JSON.stringify(builder.request);
                if(options.isFile){
                    options.contentType = builder.request.type;
                    options.headers = {
                        'X-File-Name': builder.request.name
                    }
                }
            }

            //console.log(['Server request. JSON=', json].join(''));
            this._executeAjax(model, options);
        },


        '_executeAjax': function (model, options) {
            var success = options.success;
            options.success = function (resp) {
                if (resp && resp.Error) {
                    options.error(model, resp, options);
                } else {
                    success(model, resp, options);
                }
            };

            var error = options.error;
            options.error = function (xhr, data, errorThrown, responseError) {

                responseError = data.hasOwnProperty('Error') ? data.Error
                    : { Code: xhr.status,
                    Description: xhr.statusText};

                options.responseError = responseError;

                console.log(['Server request FAILED. Error code ', responseError.Code, '. ', responseError.Description].join(''));
                error(model, xhr, options);
            };

           var params = {
                contentType: 'application/json; charset=utf-8',
                processData: false
            };

            // Make the request, allowing the user to override any Ajax options.
            //
            options.xhr = Backbone.ajax(_.extend(params, options));
            return options.xhr;
        }
    };
});

