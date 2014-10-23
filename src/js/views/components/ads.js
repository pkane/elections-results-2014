define([
    'jquery',
	'underscore',
	'backbone',
	'models/config',
	'api/ads'
],
function ($, _, Backbone, config, ads) {

    return Backbone.View.extend({

    	el: '#ad-' + config.pageInfo.platform,

        initialize: function() {
            Backbone.View.prototype.initialize.apply(this, arguments);            
            ads.registerAd(this.$el.attr('id'), config.ads.unit, config.ads.sizes);
        },

        refresh: function() {
        	console.log('ad view refresh ', this.$el.attr('id'));

            if (window.googletag) {
                window.googletag.pubads().refresh();
            }
        	        	
        }
        
    });
});