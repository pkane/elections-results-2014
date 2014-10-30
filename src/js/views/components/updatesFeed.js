define([
	'jquery',
	'underscore',
	'backbone',    
    'd3',
    'models/config',
    'text!views/components/updatesFeed.html'
],
function ($, _, Backbone, d3, config, componentTemplate) {

    var view = Backbone.View.extend({
        
        model: new (Backbone.Model.extend({ 
            data: [],
            filtered: [],
            timeFormat: d3.time.format('%-I:%M %p %m/%d/%y'),

            filterData: function (dataSet) { 
                return _.filter(dataSet, function (i) { 
                    return (i.changes.win.length > 0);
                });
            },
            formatTimestamp: function (timestamp) {
                return this.timeFormat(new Date(timestamp * 1000));
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
            }
        }))(),
        
        className: 'updates-feed',
        
        template: _.template(componentTemplate),
        
        render: function () {
            
            this.model.filtered = this.model.filterData(this.model.data);
            
            this.$el.html(this.template(this.model));
            
            return this;
        }
        
    });
    
    return view;
});