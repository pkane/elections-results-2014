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
            formatFips: function (fips) {
                console.log('TODO: parse fips into state / district');
                return 'TODO' + fips;
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