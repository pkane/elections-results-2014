define([
	'jquery',
	'underscore',
	'backbone',
    'models/config',
    'models/fips',
    'text!views/components/updates.html'
],
function ($, _, Backbone, config, fipsMap, updateTemplate) {

    var view = Backbone.View.extend({
        
        model: new (Backbone.Model.extend({ 
            data: [], 
            detail: [],
            race: '',
            state: {},
            getAbbrByName: function (name) {
                var state = _.find(config.states, function (state) { 
                    return (name && state.display.toLowerCase() === name.toLowerCase())
                });
                return (state) ? state.abbr : '';
            },
            getCountyByFips: function (fips) {
                var county = _.findWhere(fipsMap, { s: fips.substr(0, 2), c: fips.substr(2, 3) })
                return (county) ? county.d : '';
            },
            formatId: function (id) {
                var split = id.split('-'),
                    state = _.findWhere(config.states, { id: split[0] });
                
                return state.display + ': ' + split[1];
            }
        }))(),
        
        template: _.template(resultTemplate),
        
        render: function () {
            
            // _.groupBy(xhr.responseJSON, function (obj) { return obj.id.substr(0, 2); });
            
            this.$el.html(this.template(this.model));
            
            return this;
        }
        
    });
    
    return view;
});