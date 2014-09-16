define([
    'jquery',
	'underscore',
	'backbone',
    'models/navModel',
    'text!views/components/nav.html'
],
function ($, _, Backbone, NavModel, templateFile) {

    var indexView = Backbone.View.extend({
        
        className: 'tmp',
        
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
            var race = this.model.currentRace;
            
            this.$('.election-office-projection-heading').text(race.display + ' Results');
            
            this.$('.elections-bar-nav-item').removeClass('active-item');
            
            this.$('.elections-bar-nav-item-' + race.key).addClass('active-item');
        }
        
    });
    
    return indexView;
});