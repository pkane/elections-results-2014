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
                return moment.format('h:mm:ss A M/D/YY');
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
                
                if (state) {
                    formatted += '<span class="update-location">' + state.display + '</span>';
                } else {
                    console.log('Failed to find state for fips: ' + item.fips);
                }
                
                race = _.findWhere(config.races, { id: item.race.toLowerCase() });
                
                if (race) {
                    formatted += ' for ' + race.display;
                } else {
                    //console.log('Failed to find race: ' + item.race);
                }
                
                if (item.fips.indexOf('-') > -1) {
                    formatted += ' ' + item.fips.split('-')[1];
                }
                
                return formatted + '.';
            },
            getPartyForItem: function (item) {
                return (Math.random() > 0.5) ? 'rep' : (Math.random() > 0.1) ? 'dem' : 'other';
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