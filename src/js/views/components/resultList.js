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
            
            sortValues: { 
                'No': 1,
                'Yes': 0,
                'Against': 1,
                'For': 0,
                'Approve': 0, 
                'Reject': 1, 
                'In Favor': 0, 
                'Maintained': 0,
                'Repealed': 1
            },

            isMobile: config.isMobile,
            
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
                var matches = value.match(/[^\d]*(\d+)[^\d]*/),
                    result = (matches && matches.length > 1) ? parseInt(matches[1], 10) : value;
                
                if (_.isNumber(result)) {
                    result = (result < 10) ? '0' + result : '' + result;
                }
                
                return result;
            },
            formatHouseId: function (id) {
                var split = id.split('-');
                return split[1];
            },

            formatVotes: d3.format(','), //function(votes) { var format = d3.format(','); return format(votes);},
            formatPercent: function (a,b) {
                var full = (b !== undefined) ? (a / b) : a,
                    format = d3.format('.1%');
                return (full) ? format(full) : 0;
            },
            formatParty: function (party) {
                return (config.partyAbbr[party]) ? config.partyAbbr[party] : '(' + party.charAt(0) + ')';
            },
            initiativeSort: function (item) {
                return this[item.name];
            },
            tokenizeHouseId: function (id) {
                var split = id.split(' ');
                return split[1];
            },
            tokenizeClass: function (str) {
                return (str) ? str.toLowerCase().replace(/ /g, '-') : '';
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