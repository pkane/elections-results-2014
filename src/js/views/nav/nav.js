define([
	'jquery',
	'underscore',
	'backbone',
    'models/navModel',
    'text!views/nav/nav.html'
],
function ($, _, Backbone, NavModel, templateFile) {

    var indexView = Backbone.View.extend({
        
        className: 'election-results-nav',
        
        model: new NavModel(),
        
        template: _.template(templateFile),
        
        render: function () {
            
            this.$el.html(this.template(this.model));
            
            return this;
        },
        
        update: function () {
            console.log('TODO: set selected state in nav');
        }
        
    });
    
    return indexView;
});