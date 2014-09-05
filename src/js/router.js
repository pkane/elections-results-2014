define([
	'jquery',
	'underscore',
	'backbone'
],
function ($, _, Backbone) {

    var AppRouter = Backbone.Router.extend({

        routes: {
            '': 'index'
        },

        initialize: function() {
            
            // /elections-results-2014/
            // /elections-results-2014/#/{house|senate|governors}/{embed}
            this.route(/^(house|senate|governors)?\/?(oembed)?\/?/, 'index');

            // /elections-results-2014/#/{al-wy}/{embed}
            this.route(/^([a-zA-Z]{2})\/?(oembed)?\/?$/, 'state');

            // /elections-results-2014/#/race/{house|senate|governors}-{al-wy|al-wy + fip}/{embed}
            this.route(/^race\/(house|senate|governors)-([a-zA-Z]{2})([0-9]*)\/?(oembed)?\/?/, 'race');
            
            console.log('Router initialized');
        },
        
        redirect: function () {
            Backbone.history.navigate('#/');
        }
        
    });
    
    return new AppRouter();

});