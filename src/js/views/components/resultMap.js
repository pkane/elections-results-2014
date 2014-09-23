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
        
        mapboxInitialized: false,

        model: new (Backbone.Model.extend({}))(),
        
        template: _.template(resultMap),

        //el: '#main-map .map',

        initialize: function() {
            console.log('init');
            
            this.listenTo(dataManager, 'change:states', function () { 
                this.stateBorders();
            });
            
            dataManager.loadGeo('states', 'simp');
            dataManager.loadGeo('states', 'centroids');

        },
        
        render: function () {
            
            console.log('render');
            this.$el.html(this.template(this.model));
            //var map = Mapbox.map('mapbox', null, null, null).center({ lon: -98, lat: 38 }).zoom(6);
            
            if (!this.mapboxInitialized) {
                L.mapbox.accessToken = 'pk.eyJ1IjoidHJlYmxla2lja2VyIiwiYSI6IjRKTXZtUUEifQ.VBdcmyofyon7L2RFAuGsXQ';
                var map = L.mapbox.map('map', 'usatoday.map-hdtne5p8', {
                    scrollWheelZoom: false,
                    zoomControl: false
                }).setView([38.00, -98.00], 4);
                
                this.mapboxInitialized = true;
            }
            
            return this;
        },
        
        stateBorders: function (){
            console.log('stateBorders');
            var features = dataManager.geo.states.zoom;

            /*if (IE) {
                var set = view.svg.append('set');
                set.selectAll('path')
                    .this.data(features).enter().append('path')
                        .attr('class', 'states')
                        .attr('fill', colorize)
                        .attr('stroke-width', function(d) {
                            if (d.id === state) return 2;
                            return 1;
                        })
                        .attr("d", path)
                        .attr('fill-opacity', function(d) {
                            if (d.id === state) return 0;
                            if (!state) return 0;
                            return 0.25;
                        })
                        .attr('stroke', '#ffffff')
                        .on('click', click);
                return undefined;
            }*/

            // If no state layer exists
            if (!view.svg.shapes.selectAll('path.states')[0].length) {

                // Add it
                view.svg.shapes.selectAll('path.states')
                    .this.data(features).enter().append('path')
                        .attr('class', 'states')
                        .attr('fill', colorize)
                        .attr('pointer-events', 'painted')
                        .attr('stroke-width', function(d) {
                            if (d.id === state) return 2;
                            return 1;
                        })
                        .attr("d", path)
                        .attr('fill-opacity', function(d) {
                            if (race !== 'house' && d.id !== state) return 1;
                            return 0;
                        });
            } else {
                view.svg.shapes.selectAll('path.states').each(function(d) {
                        this.parentNode.appendChild(this);
                });
            }

            // Colorize state layer
            view.svg.shapes.selectAll('path.states')
                .attr('stroke', '#ffffff')
                .on('touchstart', touch)
                .on('click', click)
                .transition().ease(ease).duration(timer)
                .attr('stroke-width', function(d) {
                    if (d.id === state) return 2;
                    return 1;
                })
                .attr("d", path)
                .attr('fill', colorize)
                .attr('fill-opacity', 0.25);
        }
    });

    return view;
});