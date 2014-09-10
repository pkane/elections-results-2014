define([
	'jquery',
	'underscore',
	'backbone',
    'models/navModel',
    'text!views/components/nav.html'
],
function ($, _, Backbone, NavModel, templateFile) {

    var indexView = Backbone.View.extend({
        
        className: 'election-results-nav',
        
        model: new NavModel(),
        
        template: _.template(templateFile),
        
        render: function () {
            
            this.$el.html(this.template(this.model));

            this.update();
            
            return this;
        },
        
        update: function () {
            
            this.$('.election-results-nav-item').removeClass('election-results-nav-selected');
            
            this.$('.election-results-nav-' + this.model.get('currentRace')).addClass('election-results-nav-selected');
            
            if (this.model.get('currentState') !== '') {
                console.log('setting active state ' + this.model.get('currentState'));
                this.$('.election-results-nav-' + this.model.get('currentState')).addClass('election-results-nav-selected');
            }
        }
        
    });
    
    return indexView;
});