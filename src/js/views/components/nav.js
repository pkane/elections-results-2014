define([
    'jquery',
	'underscore',
	'backbone',
    'models/navModel',
    'text!views/components/nav.html'
],
function ($, _, Backbone, NavModel, templateFile) {

    var indexView = Backbone.View.extend({
        
        className: 'election-navigation',
        
        model: new NavModel(),
        
        template: _.template(templateFile),
        
        initialize: function () {
            
            $('#election-bar-content').html(this.el);
            
        },  
        
        render: function () {
            
            this.$el.html(this.template(this.model));

            this.refresh();
            
            return this;
        },
        
        refresh: function () {
            var race = this.model.currentRace,
                state = this.model.currentState;
            
            this.$('.election-office-projection-heading').text(race.display + ' Results');
            
            this.$('.elections-bar-nav-item').removeClass('selected');
            
            this.$('.elections-bar-nav-item-' + race.key).addClass('selected');
            
            this.$('.page-icon .icon').removeClass().addClass('icon ' + this.model.getStateIcon());
            
        }
        
    });
    
    return indexView;
});