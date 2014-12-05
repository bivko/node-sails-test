require.config({
    'urlArgs': "bust=" + (new Date()).getTime(),
//    'baseUrl': '../assets',
    shim: {
        'underscore': { 'exports': '_' },
        'backbone': {
            'deps': ['underscore', 'jquery'],
            'exports': 'Backbone'
        },
        'marionette': {
            'deps': ['backbone'],
            'exports': 'Marionette'
        },

        'backbone.safe': ['backbone'],

        'jquery': {'exports': ['$','jquery', 'jQuery', 'JQuery']},
        'jqueryCookie': ['jquery'],
        'hashchage': ['jquery'],
        'formSerialize': ['jquery'],
        'jqueryParseParams': ['jquery'],

        'jqueryUI': ['jquery'],
        'multipleSelect': ['jquery'],
        'select2': ['jquery'],
        'jqueryFlexSlider': ['jquery'],
        'sails.io': {'exports': 'io'}
    },
    paths: {
        'backbone': '../assets/backbone/backbone-min',
        'marionette': '../assets/backbone.marionette/backbone.marionette.min',
        'underscore': '../assets/underscore-amd/underscore-min',
        'backbone.safe': '../assets/backbone.safe',

        'jquery': '../assets/jquery/jquery.min',
        'jqueryCookie': '../assets/jquery.cookie',
        'hashchage': '../assets/jquery.hashchange',
        'formSerialize': '../assets/jquery.serializejson.min',
        'jqueryParseParams': '../assets/jquery.parseparams',

        'jqueryUI': '../assets/jquery-ui.min',
        'multipleSelect': '../assets/jquery.multiple.select',
        'select2': '../assets/select2.min',
        'gmaps': '../assets/gmaps',
        'jqueryFlexSlider': '../assets/jquery.flexslider',

        'text': '../assets/text',
        'async': '../assets/async',
        'formatter': '../assets/string.format',
        'moment': '../assets/moment.min',
        'sails.io': '../assets/sails.io'
    }
});

require(['Application'], function (Application) {
    Application.start();
});