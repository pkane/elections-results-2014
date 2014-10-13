define([
	'jquery',
	'underscore',
	'backbone'
],
function ($, _, Backbone) {

    var routeHandler = function () {
            // /elections-results-2014/#/{house|senate|governors|initiatives}-{al-wy}/{embed}
            // /elections-results-2014/#/race/{house|senate|governors|initiatives}-{al-wy|al-wy + fip}/{embed}
        
            var index = location.hash.match(/^#(house|senate|governors|initiatives)?-?([a-zA-Z]{2})?\/?(oembed)?\/?/),
                race = location.hash.match(/^#\/race\/(house|senate|governors|initiatives)-([a-zA-Z]{2})-([a-zA-Z0-9]*)\/?(oembed)?\/?/);
            if (race) {
                AppRouter.trigger('route:race', race[1], race[2], race[3], race[4]);
            } else if (index){
                AppRouter.trigger('route:index', index[1], index[2], index[3]);
            } else if (location.hash === '') {
                AppRouter.trigger('route:index', 'senate');
            }
        },
        AppRouter = {

            initialize: function() {

                $(window).on('hashchange', routeHandler);

                routeHandler();

                console.log('Router initialized');
            },

            redirect: function () {
                Backbone.history.navigate('#/');
            }
        };
    
    return _.extend(AppRouter, Backbone.Events);
});