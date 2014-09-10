define([
	'jquery',
	'underscore',
	'backbone'
],
function ($, _, Backbone) {

    var view = Backbone.View.extend({
        
        template: _.template('<h4>Placeholder for result list table</h4>'),
        
        render: function () {
            
            this.$el.html(this.template());
            
            return this;
        },
        
    });
    
    return view;
});