define([
	'jquery',
	'underscore',
	'backbone',
    'views/components/resultList',
    'views/components/resultMap',
    'views/components/balanceChart',
    'models/dataManager',
    'models/indexModel',
    'text!views/pages/index.html',
    'mapbox'
],
function ($, _, Backbone, ResultList, ResultMap, BalanceChart, dataManager, IndexModel, templateFile, Mapbox) {

    var resultList,
        resultMap,
        balanceChart,
        indexView = Backbone.View.extend({
        
        el: '#election-content',
            
        model: new IndexModel(),
        
        template: _.template(templateFile),
        
        useOembedTemplate: false,

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

                initiatives: {}
            },
        
        initialize: function () {
            balanceChart = new BalanceChart();
            resultMap = new ResultMap();
            resultList = new ResultList();
            
            this.listenTo(dataManager, 'change:senate', this.refreshResults);
            this.listenTo(dataManager, 'change:house', this.refreshResults);
            this.listenTo(dataManager, 'change:governors', this.refreshResults);
            this.listenTo(dataManager, 'change:initiatives', this.refreshResults);
            
            this.listenTo(dataManager, 'change:summary', this.refreshSummary);

            $('#election-content').html(this.el);
        },
        
        render: function () {

            this.refresh();
            
            this.$el.html(this.template(this.model));
            
            this.$('#balanceOfPower').html(balanceChart.el);
            this.$("#map").html(resultMap.el);
            this.$('#list').html(resultList.el);
            L.mapbox.accessToken = 'pk.eyJ1IjoidHJlYmxla2lja2VyIiwiYSI6IjRKTXZtUUEifQ.VBdcmyofyon7L2RFAuGsXQ';
            var map = L.mapbox.map('map', 'usatoday.map-hdtne5p8', {
                scrollWheelZoom: false,
                zoomControl: false
            }).setView([38.00, -98.00], 4);
            //this.stateBorders();
            
            return this;
        },
            
        refresh: function () {
            this.refreshResults();
            
            if (this.model.race.id === 'i') {
                this.$('#balanceOfPower').hide();
            } else {
                this.$('#balanceOfPower').show();
                this.refreshSummary();
            }
        },
        
        refreshResults: function () {
            console.log('index refresh');
            
            resultList.model.race = resultMap.model.race = this.model.race;
            resultList.model.state = resultMap.model.state = this.model.state;
            resultList.model.data = resultMap.model.data = dataManager[this.model.race.key].data;
            resultList.model.detail = resultMap.model.detail = (this.model.state) ? dataManager[this.model.race.key].detail[this.model.state.id] : [];
            resultList.render();
            resultMap.render();
        },
        
        refreshSummary: function () {
            console.log('BoP refresh');
            
            balanceChart.model.data = dataManager.summary.data;
            balanceChart.model.race = this.model.race;
            balanceChart.model.updateTime = dataManager.summary.updateTime;

            balanceChart.render();
        },

        stateBorders: function (){
                console.log('stateBorders');
                var features = this.data.geo.states.zoom;

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
    
    return indexView;
});