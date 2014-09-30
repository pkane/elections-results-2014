define([
	'jquery',
	'underscore',
	'backbone',
    'moment',
    'models/config',
    'text!views/components/updatesFeed.html'
],
function ($, _, Backbone, Moment, config, componentTemplate) {

    var view = Backbone.View.extend({
        
        model: new (Backbone.Model.extend({ 
            data: [],
            filterData: function (dataSet) { 
                return _.filter(dataSet, function (i) { 
                    return (i.changes.win.length > 0);
                });
            },
            formatTimestamp: function (timestamp) {
                var moment = new Moment(parseInt(timestamp)*1000);
                return moment.format('h:mm A M/D/YY');
            },
            formatRaceResult: function (item) {
                var formatted = '',
                    state,
                    race;
                
                formatted = item.name + ' wins the race in ';
                
                if (item.fips.indexOf('-') > -1) {
                    state = _.findWhere(config.states, { id: item.fips.split('-')[0] });
                } else {
                    state = _.findWhere(config.states, { id: item.fips });
                }
                
                formatted += '<span class="update-location">' + state.display + '</span>';
                
                race = _.findWhere(config.races, { id: item.race.toLowerCase() });
                
                if (race) {
                    formatted += ' for ' + race.display;
                } else {
                    console.log(item.race);
                }
                
                if (item.fips.indexOf('-') > -1) {
                    formatted += ' ' + item.fips.split('-')[1];
                }
                
                return formatted + '.';
            }
        }))(),
        
        className: 'updates-feed',
        
        template: _.template(componentTemplate),
        
        render: function () {
            
            this.$el.html(this.template(this.model));
            
            return this;
        }
        
    });
    
    return view;
});