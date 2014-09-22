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

        refresh: function() {
        	console.log('ad view refresh ', this.$el.attr('id'));

        	ads.registerAd(this.$el.attr('id'), config.ads.unit, config.ads.sizes);        	
        }
        
    });
});