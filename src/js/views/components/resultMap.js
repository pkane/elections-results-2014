define([
	'jquery',
	'underscore',
	'backbone',
    'mapbox',
    'models/dataManager',
    'models/fips',
    'text!views/components/resultMap.html'
],
function ($, _, Backbone, Mapbox, dataManager, fipsMap, resultMap) {

    var view = Backbone.View.extend({

        model: new (Backbone.Model.extend({}))(),
        
        template: _.template(resultMap),

        //el: '#main-map .map',

        initialize: function() {
            console.log('init');
            
            this.listenTo(dataManager, 'change:states', function () { 
                console.log('State Geo Data Changed');
            });
            
            dataManager.loadGeo('states', 'simp');
            dataManager.loadGeo('states', 'centroids');

        },
        
        render: function () {
            
            console.log('render');
            this.$el.html(this.template(this.model));
            //var map = Mapbox.map('mapbox', null, null, null).center({ lon: -98, lat: 38 }).zoom(6);
            
            return this;
        },
        
    });

    return view;
});