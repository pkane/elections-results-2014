define([
	'jquery',
	'underscore',
	'backbone',
    'mapbox',
    'models/config',
    'models/fips',
    'text!views/components/resultMap.html'
],
function ($, _, Backbone, Mapbox, config, fipsMap, resultMap) {

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
        
        template: _.template(resultMap),

        //el: '#main-map .map',

        // Place-holder structure for data
        data: {
            geo: {
                states: {
                    simp: [],
                    zoom: [],
                    centroids: []
                },
                counties: {
                    zoom: {}, // lazy load. properties for state fips
                    simp: []
                },
                cds: {
                    zoom: {}, // lazy load. properties for state fips
                    simp: []
                },
                places: []
            },

            results: {
                house: {}, // level => state fips => results
                senate: {},
                governor: {}
            },

            totals: {
                house: {},
                senate: {},
                governor: {}
            },

        },

        //initialize: function() {
        //        console.log('init');
        //        this.render();
        //},
        
        render: function () {
            
            console.log('render');
            this.$el.html(this.template(this.model));
            //var map = Mapbox.map('mapbox', null, null, null).center({ lon: -98, lat: 38 }).zoom(6);
            //console.log(config);
            return this;

        },
        
    });

    return view;
});