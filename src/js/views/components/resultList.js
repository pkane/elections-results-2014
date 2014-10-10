define([
	'jquery',
	'underscore',
	'backbone',
    'd3',
    'models/config',
    'models/fips',
    'text!views/components/resultList.html'
],
function ($, _, Backbone, d3, config, fipsMap, resultTemplate) {

    var view = Backbone.View.extend({
        
        model: new (Backbone.Model.extend({ 
            data: [], 
            detail: [],
            race: '',
            state: {},
            getStateById: function (id) {
                return _.findWhere(config.states, { id: id });
            },
            getStateByName: function (name) {
                return _.find(config.states, function (state) { 
                    return (name && state.display.toLowerCase() === name.toLowerCase())
                });
            },
            getCountyByFips: function (fips) {
                var county = _.findWhere(fipsMap, { s: fips.substr(0, 2), c: fips.substr(2, 3) })
                return (county) ? county.d : '';
            },
            findSortValue: function (value) {
                var matches = value.match(/[^\d]*(\d+)[^\d]*/);
                return (matches && matches.length > 1) ? parseInt(matches[1]) : value;
            },
            formatHouseId: function (id) {
                var split = id.split('-');
                return split[1];
            },
            formatVotes: d3.format(','),
            formatPercent: function (a,b) {
                var full = a / b;
                return (full) ? Math.round(full*1000)/10 : 0;
            }, 
            tokenizeHouseId: function (id) {
                var split = id.split(' ');
                return split[1];
            }
        }))(),
        
        template: _.template(resultTemplate),
        
        reset: function () { 
            this.model.data = [];
            this.model.detail = [];
            this.model.race = {};
            this.model.state = {};
        },
        
        render: function () {
            
            if (this.model.race.id === 'h') {
                this.model.data = _.groupBy(this.model.data, function (obj) { return (obj && obj.id) ? obj.id.substr(0, 2) : '00'; });
            }
            
            this.$el.html(this.template(this.model));
            
            return this;
        }
        
    });
    
    return view;
});