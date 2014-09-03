require.config({
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
});

require(['app', 'underscore'], function (App, us) {
    'use strict';

    console.log('Yo!');
    console.dir(us);
    
    App.init();
});