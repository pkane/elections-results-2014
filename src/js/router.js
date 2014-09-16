define([
	'jquery',
	'underscore',
	'backbone'
],
function ($, _, Backbone) {

    var AppRouter = Backbone.Router.extend({

        routes: {
            '': 'index' // /elections-results-2014/
        },

        initialize: function() {
            
            // /elections-results-2014/#/{house|senate|governors|initiatives}-{al-wy}/{embed}
            this.route(/^(house|senate|governors|initiatives)?-?([a-zA-Z]{2})?\/?(oembed)?\/?/, 'index');

            // /elections-results-2014/#/race/{house|senate|governors|initiatives}-{al-wy|al-wy + fip}/{embed}
            this.route(/^race\/(house|senate|governors|initiatives)-([a-zA-Z]{2})([0-9]*)\/?(oembed)?\/?/, 'race');
            
            console.log('Router initialized');
        },
        
        redirect: function () {
            Backbone.history.navigate('#/');
        }
        
    });
    
    return new AppRouter();

});