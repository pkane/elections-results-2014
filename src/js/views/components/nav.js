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
            var race = this.model.get('currentRace'),
                state = this.model.get('currentState');
            
            this.$('.election-results-nav-item').removeClass('election-results-nav-selected');
            
            this.$('.election-results-nav-' + race).addClass('election-results-nav-selected');
            
            _.forEach(this.$('.state-list .election-results-nav-item'), function (item) {
                $('a', item).attr('href', '#/' + race + '-' + $(item).data('abbr'));
            });
            
            if (state !== '') {
                console.log('setting active state ' + state);
                this.$('.election-results-nav-' + state).addClass('election-results-nav-selected');
            }
        }
        
    });
    
    return indexView;
});