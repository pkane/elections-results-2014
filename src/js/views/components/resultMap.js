define([
	'jquery',
	'underscore',
	'backbone',
    'mapbox',
    'models/config',
    'models/fips',
    'text!views/components/resultMap.html'
],
function ($, _, Backbone, Mapbox, config, fipsMap, resultMap) {

    var view = Backbone.View.extend({
        
        template: _.template(resultMap),
        
        render: function () {
            
            this.$el.html(this.template());

            return this;

        },
        
    });

    return view;
});