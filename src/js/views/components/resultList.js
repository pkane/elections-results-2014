define([
	'jquery',
	'underscore',
	'backbone',
    'text!views/components/resultList.html'
],
function ($, _, Backbone, resultTemplate) {

    var view = Backbone.View.extend({
        
        model: new (Backbone.Model.extend({ data: [], race: '' }))(),
        
        template: _.template(resultTemplate),
        
        render: function () {
            
            this.$el.html(this.template(this.model));
            
            return this;
        }
        
    });
    
    return view;
});