define([
	'jquery',
	'underscore',
	'backbone'
],
function ($, _, Backbone) {

    var view = Backbone.View.extend({
        
        template: _.template('<h2>Placeholder for race page</h2>'),
        
        render: function () {
            
            this.$el.html(this.template());
            
            return this;
        },
        
    });
    
    return view;
});