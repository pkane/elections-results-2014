define([
	'jquery',
	'underscore',
	'backbone',
    'models/stateModel',
    'text!views/pages/state.html'
],
function ($, _, Backbone, StateModel, templateFile) {

    var stateView = Backbone.View.extend({
        
        model: new StateModel(),
        
        template: _.template(templateFile),
        
        useOembedTemplate: false,
        
        render: function () {
            
            this.$el.html(this.template(this.model));
            
            return this;
        },
        
    });
    
    return stateView;
});