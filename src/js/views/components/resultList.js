define([
	'jquery',
	'underscore',
	'backbone',
    'models/config',
    'models/fips',
    'text!views/components/resultList.html'
],
function ($, _, Backbone, config, fipsMap, resultTemplate) {

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
            formatHouseId: function (id) {
                var split = id.split('-');
                return split[1];
            }
        }))(),
        
        template: _.template(resultTemplate),
        
        render: function () {
            
            if (this.model.race.id === 'h') {
                // TODO: Sort districts by num
                this.model.data = _.groupBy(this.model.data, function (obj) { return obj.id.substr(0, 2); });
            }
            
            this.$el.html(this.template(this.model));
            
            return this;
        }
        
    });
    
    return view;
});