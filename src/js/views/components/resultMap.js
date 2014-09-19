define([
	'jquery',
	'underscore',
	'backbone',
    'models/config',
    'models/fips',
    'text!views/components/resultMap.html'
],
function ($, _, Backbone, config, fipsMap, resultMap) {

    var view = Backbone.View.extend({
        
        template: _.template(resultMap),
        
        render: function () {
            
            //if (JSON.parse($(".staticinfo").html()).platform == 'mobile') {
            //} else {
                this.$el.html(this.template());
                
                return this;
            //}
        },
        
    });
    
    return view;
});