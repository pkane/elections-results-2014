define([
    'jquery',
    'underscore',
    'backbone',
    'mapbox',
    'models/dataManager',
    'models/fips',
    'text!views/components/resultMap.html',
    'd3'
],
function ($, _, Backbone, Mapbox, dataManager, fipsMap, resultMap, D3) {
    var  IE = $('html').hasClass('lt-ie9'),
        view = Backbone.View.extend({

        model: new (Backbone.Model.extend({}))(),
        
        template: _.template(resultMap),

        //el: '#main-map .map',

        initialize: function() {
            console.log('init');
            
            this.listenTo(dataManager, 'change:states', function () { 
                console.log('State Geo Data Changed');
                this.drawMap();
            });
            
            dataManager.loadGeo('states', 'simp');
            dataManager.loadGeo('states', 'centroids');
            dataManager.loadGeo('states', 'zoom');
            dataManager.loadGeo('cds', 'simp');

        },
        
        render: function () {
            
            console.log('render map');

            this.$el.html(this.template(this.model));
            //var map = Mapbox.map('mapbox', null, null, null).center({ lon: -98, lat: 38 }).zoom(6);

            this.pMap = this.pMap || L.map('mapbox', null, null, null)
            //this.mbMap = this.mbMap || L.map('mapbox', null, null, null)

            /* L.mapbox.accessToken = 'pk.eyJ1IjoidHJlYmxla2lja2VyIiwiYSI6IjRKTXZtUUEifQ.VBdcmyofyon7L2RFAuGsXQ';
            var map = L.mapbox.map('mapbox', 'usatoday.map-hdtne5p8', {
                scrollWheelZoom: false,
                zoomControl: false
            }).setView([38.00, -98.00], 4); */

            //map settings

            var //app = application.models.app,
            mapMode = 'states' //app.get('mapMode'),
            view = this,
            race = 'house', //this.options.race || app.get('race'), //hardcode for now
            state = '00' //app.get('state') || '00',
            level = 'states' //(race === 'house') ? 'cds' :
                    //(state !== '00' || mapMode === 'counties' || mapMode === 'popular') ? 'counties' : 'states',
            res = (state !== '00') ? 'zoom' : 'simp',
            data = view.data,
            width = view.$el.width(),
            height = view.$el.height(),
            timer = 0 //(IE || iOS) ? 0 : 400,
            ease = D3.ease('linear-in-out'),
            template = view.template,
            //tooltip = view.tooltip,
            //dataQueue = queue(),
            features = [];
            this.drawMap();

            console.log('return render');

            return this;
        },

        drawMap: function() {
            //return;
            /*
                ## Posssible scenarios
                + 1. initial drawing
                    - draw everything
                + 2. resized page
                    - transition data
                3. switched map view (+ race, state, mapMode)
                    - if new shapes, redraw
                    - transition data
                + 4. updated data
                    - transition data

            */

            /*/var results = (res === 'simp') ? dataManager[this.model.race.key].data[level] :
                                            dataManager[race].data[level][state], */
                var path = view.path = reproject(),
                projection = view.albers,
                shapes;

            // clear thumbnails and tooltip
            // view.clearThumbs();
            // $('#tooltip').toggleClass('in', false); comment out tooltip for now

            // Handle tiles
            mapboxMap();

            if (view.svg && IE) {
                $('main-map .map').empty();
                view.svg = undefined;
            }

            view.svg = view.svg || d3.select('#mapbox').append('svg')
                .attr("width",  (!IE) ? '850px' : $('#main-map .map').width()) // '100%' : $('#main-map .map').width())
                .attr("height", (!IE) ? '600px' : $('#main-map .map').height());//'100%' : $('#main-map .map').height())
            if (!IE) view.svg.shapes = view.svg.shapes || view.svg.append('g').attr('class', 'shapes');
            if (!IE) view.svg.labels = view.svg.labels || view.svg.append('g').attr('class', 'labels');

            //this.$el.append(view.svg);
            console.log('append svg');

            //D3.select("#main-map").append(view.svg);

            //this.$el.append($(view.svg).html());
            //this.$el.append(XMLSerializer.serializeToString(view.svg));
            remove('.places');


            // Set up SVGs
            switch (level) {

                case 'states':

                    // Remove all non-state shapes
                    remove('.counties, .cds, .centroids');

                    // If no state layer exists
                    if(IE || !view.svg.shapes.selectAll('path.states')[0].length) {

                        features = dataManager.geo[level].zoom //data.geo[level].zoom;

                        // Add it
                        shapes = (!IE) ? view.svg.shapes.selectAll('path.states') : view.svg.selectAll('path');
                        shapes
                            .data(features.features).enter().append('path')
                                .attr('class', 'states')
                                .attr('fill', '#cccccc')
                                .attr('stroke-width', 1)
                                .attr("d", path);

                    }

                    console.log('basic shapes complete');

                    //if (mapMode !== 'electoral') { //comment out conditional. should never be electoral

                        // Colorize state layer
                        shapes = (!IE) ? view.svg.shapes.selectAll('path.states') : view.svg.selectAll('path');
                        shapes
                            .attr('stroke', '#ffffff')
                            .on('touchstart', touch)
                            .on('click', click)
                            .attr('fill', '#cccccc')
                            .transition().ease(ease).duration(timer)
                            .attr('fill-opacity', 1)
                            .attr('stroke-width', 1)
                            .attr("d", path);
                            //.attr('fill', colorize);

                    //} else {

                        // Colorize state layer
                        /* shapes = (!IE) ? view.svg.shapes.selectAll('path.states') : view.svg.selectAll('path');
                        shapes
                            .attr('stroke', app.get('style').tWin)
                            .on('touchstart', null)
                            .on('click', null)
                            .attr('fill', '#ffffff')
                            .attr('fill-opacity', 1)
                            .attr('stroke-width', 1)
                            .attr("d", path);

                        features = data.geo.states.centroids;

                        // Add it
                        view.svg.selectAll('circle')
                            .data(features).enter().append('circle')
                                .attr('class', 'centroids')
                                .attr('stroke', app.get('style').tWin)
                                .attr('stroke-width', 1)
                                .attr('cx', function(d) {
                                    return projection(d.geometry.coordinates)[0];
                                })
                                .attr('cy', function(d) {
                                    return projection(d.geometry.coordinates)[1];
                                })
                                .attr('fill', colorize)
                                .transition().ease(ease).duration(timer)
                                .attr('r', function(d) {
                                    return radius(d.properties.ev) * 5 || 0;
                                });

                    } */

                    console.log('end of states');

                    break;

                case 'cds':
                    console.log('congressional');

                    // Remove counties and CDs
                    remove('.counties, .cds, .centroids');

                    features = (res === 'simp') ? dataManager.geo[level][res] :
                                                  dataManager.geo[level][res][state];

                    // Add it
                    shapes = (!IE) ? view.svg.shapes.selectAll('path.cds') : view.svg.selectAll('path');
                    shapes
                        .data(features).enter().append('path')
                            .attr('class', 'cds ' + 'st-' + (state))
                            .attr('fill', colorize)
                            .attr('stroke', '#ffffff')
                            .attr('fill-opacity', 1)
                            .attr('stroke-width', 0.5)
                            .on('touchstart', touch)
                            .on('click', click)
                            .attr('fill-opacity', function(d) {
                                if (res === 'zoom') return 0.5;
                                return 1;
                            })
                            .transition().ease(ease).delay(timer).duration(0)
                            .attr("d", path);

                    // Draw state borders
                    stateBorders();

                    break;

                case 'counties':

                    // Remove counties and CDs
                    remove('.counties, .cds, .centroids');

                    features = (res === 'simp') ? data.geo[level][res] :
                                                  data.geo[level][res][state];

                    // Add it
                    shapes = (!IE) ? view.svg.shapes.selectAll('path.counties') : view.svg.selectAll('path');
                    shapes
                        .data(features).enter().append("path")
                            .attr('class', 'counties ' + 'st-' + (state || '00'))
                            .attr('fill', colorize)
                            .attr('stroke', '#ffffff')
                            .attr('stroke-width', 0.5)
                            .on('touchstart', touch)
                            .on('click', click)
                            .attr('fill-opacity', function(d) {
                                if (res === 'zoom') return 0.5;
                                return 1;
                            })
                            .transition().ease(ease).delay(timer).duration(0)
                            .attr("d", path);


                    // Draw state borders
                    stateBorders();

                    break;

            }

            // Add tooltips
            // showTooltips();

            // Show place names
            //places();

            // Load chart
            /* if (application.views.chart) {
                application.views.chart.render();
            } else {
                application.views.chart = new views.Chart({ race: race });
            } */

            // Load table
            /* if (application.views.table) {
                application.views.table.render();
            } else {
                application.views.table = new views.Table();
            } */

            // Show thumbnails
            // view.updateThumbs(state);

            function reproject() {
                console.log('reproject');
                console.log(dataManager.geo.states.simp);
                var mercator = function(x) {
                            var point = this.pMap.locationPoint({ lat: x[1], lon: x[0] });
                            return [point.x, point.y];
                        },
                    currentFeature = _(dataManager.geo.states.simp).find(function(f) {
                            return f.id === '00' //app.get('state');
                        });

                var region = false; //app.get('region');

                if (region) {
                    // County Lookup
                    if (region.length === 5) {
                        currentFeature = _(dataManager.geo.counties.simp).find(function(f) {
                            return f.id === app.get('region');
                        });
                    }

                    // CD Lookup for house elections
                    if(region.length === 4) {
                        currentFeature = _(dataManager.geo.cds.simp).find(function(f) {
                            return f.id === app.get('region');
                        });
                    }
                }

                var bounds = currentFeature ? d3.geo.bounds(currentFeature) : false,
                    scale = (width / height >= 960 / 500) ? height * 2 : width * 1.25,
                    albers = d3.geo.albersUsa()
                        .scale(scale)
                        .translate([width / 2, height / 2]);

                view.mercator = mercator;
                view.albers = albers;

                // If this is true we assume its the nation level
                // and use the albers projection
                if (res === 'simp') {
                    if (!view.path) return d3.geo.path().projection(albers);

                    view.path.projection(albers);
                    return view.path;

                // Else this is state or county level data, in which
                // case, use mercator.
                } else {

                    view.pMap.setExtent([
                        { lon: bounds[0][0] - 0.25,
                          lat: bounds[0][1] - 0.25 },
                        { lon: bounds[1][0] + 0.25,
                          lat: bounds[1][1] + 0.25 }
                    ], true);

                    if (!view.path) return d3.geo.path().projection(mercator);

                    view.path.projection(mercator);
                    return view.path;
                }

            }

            function radius(area) {
                var r = Math.round(Math.sqrt(area / Math.PI));
                return r;
            }

            function stateBorders() {


                var features = dataManager.geo.states.zoom;

                if (IE) {
                    var set = view.svg.append('set');
                    set.selectAll('path')
                        .data(features).enter().append('path')
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
                }

                // If no state layer exists
                if (!view.svg.shapes.selectAll('path.states')[0].length) {

                    // Add it
                    view.svg.shapes.selectAll('path.states')
                        .data(features).enter().append('path')
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

            function colorize(d) {
                var data, result, winner, leader, color;

                // id.length === 2:
                //   house + zoom, solid tie color
                //   counties, match state data

                // If this is a state feature but not a state layer (it's a border)
                if (d.id.length === 2 && level !== 'states') {

                    // No fill if its the target state
                    if (state === d.id) return 'none';

                    // No fill for boundaries around simpified features
                    if (res === 'simp') return 'none';

                    // Use default gray for CDs
                    if (res === 'zoom' && level === 'cds') return app.get('style').t;

                    // Use state colors for counties
                    if (res === 'zoom' && level === 'counties') {
                        data = dataManager.results[race].states[d.id];
                    }

                } else {
                    data = dataManager[race][level][d.id.substr(0, 2)];
                }

                result = _(data).find(function(r) {
                    return r.id === d.id;
                }) || [];

                // If no results, use solid gray
                if (!_(result).size()) return app.get('style').tWin;

                leader = _(result.results).find(function(r) {
                    return r.lead;
                });

                winner = _(result.results).find(function(r) {
                    if (level === 'counties') {
                        if (result.precincts.pct === 100) return r.lead;
                    } else {
                        return r.win;
                    }
                });

                if (winner) {
                    color = (winner.party.toLowerCase() === 'republican') ? app.get('style').rWin :
                            (winner.party.toLowerCase() === 'democratic') ? app.get('style').dWin :
                                                                            app.get('style').oWin;
                } else {
                    color = (!leader)                                 ? app.get('style').t :
                        (!leader.party)                               ? app.get('style').o :
                        (leader.party.toLowerCase() === 'republican') ? app.get('style').r :
                        (leader.party.toLowerCase() === 'democratic') ? app.get('style').d :
                                                                        app.get('style').o;
                }

                return color;
            }

            function remove(selector) {
                if (!IE) {
                    view.svg.selectAll(selector).remove();
                }
            }

            function showTooltips() {

                // Remove unused events
                view.svg.selectAll('path')
                    .on('mouseover', null)
                    .on('mousemove', null)
                    .on('mouseout', null);

                // Add events for current data layer
                view.svg.selectAll((mapMode === 'electoral') ? 'circle' : 'path')
                    .each(function(d) {

                        var data;

                        if (level === 'states') {
                            data = (results[d.id]) ? results[d.id][0] : false;
                        } else if (res === 'simp') {
                            data = _(results[d.id.substr(0, 2)]).find(function(r) {
                                return r.id === d.id;
                            });
                        } else {
                            data = _(results).find(function(r) {
                                return r.id === d.id;
                            });
                        }

                        if (!data) return;

                        // Normalize name
                        data.name = d.properties.name;
                    })
                    .on("mouseover", mouseOver)
                    .on("mousemove", function() {
                        var top = (!IE) ? d3.event.pageY : d3.event.clientY,
                            left = (!IE) ? d3.event.pageX : d3.event.clientX,
                            width = $('#tooltip .inner').width();
                            height = $('#tooltip .inner').height() / 2 + 15,
                            wHeight = $(window).height(),
                            wWidth = $(window).width();

                        top = (top < height) ? height : top;
                        top = (top + height > wHeight) ? wHeight - height - 5 : top;

                        if (left > $(window).width() / 2) {
                            $('#tooltip').toggleClass('flip', true);
                            left = (left < width + 40) ? width + 40 : left;
                        } else {
                            $('#tooltip').toggleClass('flip', false);
                            left = (left + width + 60 > wWidth) ? wWidth - width - 60 : left;
                        }

                        tooltip
                            .style("top", (top - 10)+"px")
                            .style("left",(left + 10)+"px");

                    })
                    .on("mouseout", function(d) {
                        if (mapMode === 'electoral') {
                            d3.select(this).attr('stroke', app.get('style').tWin);
                        } else {
                            d3.select(this).attr('stroke', '#ffffff');
                        }
                        if (!IE && mapMode !== 'electoral') {
                            if (this.parentNode) this.parentNode.insertBefore(this, this.parentNode.firstChild);
                        }

                        $('#tooltip').toggleClass('in', false);
                    });
            }

            function touch(d) {
                var top = (!IE) ? d3.event.pageY : d3.event.clientY,
                    left = (!IE) ? d3.event.pageX : d3.event.clientX,
                    width = $('#tooltip .inner').width();
                    height = $('#tooltip .inner').height() / 2 + 15,
                    wHeight = $(window).height(),
                    wWidth = $(window).width();

                d3.event.stopPropagation();
                d3.event.preventDefault();
                d3.select(this).on('click', null);

                if (d3.select(this).attr('fill') === app.get('style').tWin) return;

                top = (top < height) ? height : top;
                top = (top + height > wHeight) ? wHeight - height - 5 : top;

                if (left > $(window).width() / 2) {
                    $('#tooltip').toggleClass('flip', true);
                    left = (left < width + 40) ? width + 40 : left;
                } else {
                    $('#tooltip').toggleClass('flip', false);
                    left = (left + width + 60 > wWidth) ? wWidth - width - 60 : left;
                }

                tooltip
                    .style("top", (top - 10)+"px")
                    .style("left",(left + 10)+"px");

                d3.selectAll('path').attr('stroke', '#ffffff');

                (_(mouseOver).bind(this, d))();
                if (view.touched === d.id) (_(click).bind(this, d))();
                view.touched = d.id;

                return false;
            }

            function click(d) {

                // Reset tooltips
                $('#tooltip').toggleClass('in', false);
                showTooltips();

                // If no results, dont zoom
                if (d3.select(this).attr('fill') === app.get('style').tWin) return;

                var state = trim(d.properties.name.replace(/\d+/g, ''));

                // If d.id equals 4 or 5, assume its a
                // county or congressional state.
                if (d.id.length >= 4) {
                    // if the id matches the current region id,
                    // bounce out to state
                    if (d.id === app.get('region')) {
                        application.go({
                            state: app.get('stateName'),
                            region: false
                        });
                    } else {
                        application.go({
                            state: app.get('stateName') || urlify(_(STATES).find(function(s) {
                                return d.id.substr(0, 2) === s.id;
                            }).name),
                            region: (app.get('stateName')) ? d.id : false,
                            mapMode: false
                        });
                    }
                } else {
                    application.go({
                        state: urlify(state),
                        region: false
                    });
                }
            }

            function mouseOver(d) {
                var data;

                var top = (!IE) ? d3.event.pageY : d3.event.clientY,
                    left = (!IE) ? d3.event.pageX : d3.event.clientX,
                    width = $('#tooltip .inner').width();
                    height = $('#tooltip .inner').height() / 2 + 15,
                    wHeight = $(window).height(),
                    wWidth = $(window).width();

                top = (top < height) ? height : top;
                top = (top + height > wHeight) ? wHeight - height - 5 : top;

                if (left > $(window).width() / 2) {
                    $('#tooltip').toggleClass('flip', true);
                    left = (left < width + 40) ? width + 40 : left;
                } else {
                    $('#tooltip').toggleClass('flip', false);
                    left = (left + width + 60 > wWidth) ? wWidth - width - 60 : left;
                }


                if (level === 'states') {
                    data = (results[d.id]) ? results[d.id][0] : false;
                } else if (res === 'simp') {
                    data = _(results[d.id.substr(0, 2)]).find(function(r) {
                        return r.id === d.id;
                    });
                } else {
                    data = _(results).find(function(r) {
                        return r.id === d.id;
                    });
                }

                if (!data) return;

                d3.select(this).attr('stroke', '#000000');

                if (!($.browser.msie  && parseInt($.browser.version, 10) === 9)) {
                    d3.select(this).attr('stroke', '#000000');
                    if (!IE && mapMode !== 'electoral') this.parentNode.appendChild(this);
                }

                tooltip
                    .style("top", (top - 10)+"px")
                    .style("left",(left + 10)+"px")
                    .html(template({
                        geo: d.properties,
                        data: data
                    }));
                $('#tooltip').toggleClass('in', true);
                if (IE) $('#tooltip').width();
            }

            function mapboxMap() {

                // If zoomed in
                if (res !== 'simp'  && view.mbMap.getLayers().length === 0) {
                // Add tiles
                    var mbLayer = mapbox.layer().tilejson(TJ);
                    view.mbMap.addLayer(mbLayer)
                        .center(view.pMap.center())
                        .zoom(view.pMap.zoom());
                }

                var $lead = $('li.leading').find('.text'),
                    $win = $('li.win').find('.text');

                // Change the copy of the legend depending on
                // Nation/State level.
                if (level === 'counties') {
                    $lead.text('< 100%'); $win.text('100% reporting');
                } else {
                    $lead.text('Leading'); $win.text('Win');
                }

                // If zooming from local view
                if (res === 'simp') {
                    $('#mapbox, #nation-view, #state-view').toggleClass('in', false);

                    // Legend key text read for national view.
                    $lead.text('Leading'); $win.text('Win');
                    return;
                }

                if (app.get('region')) {
                    $('#state-view').toggleClass('in', true);
                } else {
                    $('#state-view').toggleClass('in', false);
                }

                // If zooming in from national
                if (!$('#mapbox').hasClass('in')) {

                    // Center tile map and show it
                    view.mbMap.center(view.pMap.center()).zoom(view.pMap.zoom());
                    $('#mapbox, #nation-view').toggleClass('in', true);
                    return;
                }

                // If moving to another state while zoomed in
                if ($('#mapbox').hasClass('in') && res === 'zoom') {
                    view.mbMap.ease.location(view.pMap.center())
                        .zoom(view.pMap.zoom())
                        .easing('easeInOut')
                        .run(timer);
                    return;
                }

            }

            // Needs data update to include state fips
            function places() {

                remove('.places');

                if (res === 'zoom') {

                    // show places
                    if (!data.geo.places.length) {
                        view.getData(['places'], showPlaces);
                    } else {
                        showPlaces();
                    }

                }

                function showPlaces() {

                    var places = data.geo.places,
                        projection = view.mercator;

                    if (IE) {
                        view.svg.selectAll('circle')
                            .data(_(places).filter(function(feature) {
                                return feature.properties.state === state;
                            })).enter().append('circle')
                            .attr('fill', '#000000')
                            .attr('class', 'places')
                            .attr('cx', function(d) {
                                return projection(d.geometry.coordinates)[0];
                            })
                            .attr('cy', function(d) {
                                return projection(d.geometry.coordinates)[1];
                            })
                            .attr('r', 3);

                        view.svg.selectAll('circle.outline')
                            .data(_(places).filter(function(feature) {
                                return (feature.properties.capital && feature.properties.state === state);
                            })).enter().append('circle')
                            .attr('class', 'places')
                            .attr('fill', 'none')
                            .attr('stroke', '#000000')
                            .attr('stroke-width', 1)
                            .attr('cx', function(d) {
                                return projection(d.geometry.coordinates)[0];
                            })
                            .attr('cy', function(d) {
                                return projection(d.geometry.coordinates)[1];
                            })
                            .attr('r', 5);

                        view.svg.selectAll('text')
                            .data(_(places).filter(function(feature) {
                                return feature.properties.state === state;
                            })).enter().append('text')
                            .attr('class', 'places')
                            .text(function(d) {
                                return d.properties.name.toUpperCase();
                            })
                            .attr('font-size', 10)
                            .attr('text-anchor', function(d) {
                                if (d.properties.placement === 'right') return 'start';
                                if (d.properties.placement === 'left') return 'end';
                                return 'middle';
                            })
                            .attr('transform', function(d) {
                                var x = 0, y = -10;
                                if (d.properties.placement === 'right')  y = 4;
                                if (d.properties.placement === 'left')   y = 4;
                                if (d.properties.placement === 'bottom') y = 18;
                                if (d.properties.placement === 'right')  x = 10;
                                if (d.properties.placement === 'left')   x = -10;

                                return 'translate(' + x + ',' + y + ')';
                            })
                            .attr('x', function(d) {
                                return projection(d.geometry.coordinates)[0];
                            })
                            .attr('y', function(d) {
                                return projection(d.geometry.coordinates)[1];
                            });

                            return undefined;
                    }

                    view.svg.labels.selectAll('circle')
                        .data(_(places).filter(function(feature) {
                            return feature.properties.state === state;
                        })).enter().append('circle')
                        .attr('class', 'places')
                        .transition().ease(ease).delay(timer).duration(0)
                        .attr('cx', function(d) {
                            return projection(d.geometry.coordinates)[0];
                        })
                        .attr('cy', function(d) {
                            return projection(d.geometry.coordinates)[1];
                        })
                        .attr('r', 3);

                    view.svg.labels.selectAll('circle.outline')
                        .data(_(places).filter(function(feature) {
                            return (feature.properties.capital && feature.properties.state === state);
                        })).enter().append('circle')
                        .attr('class', 'places')
                        .attr('fill', 'none')
                        .attr('stroke', '#000000')
                        .attr('stroke-width', 1)
                        .transition().ease(ease).delay(timer).duration(0)
                        .attr('cx', function(d) {
                            return projection(d.geometry.coordinates)[0];
                        })
                        .attr('cy', function(d) {
                            return projection(d.geometry.coordinates)[1];
                        })
                        .attr('r', 5);

                    view.svg.labels.selectAll('text')
                        .data(_(places).filter(function(feature) {
                            return feature.properties.state === state;
                        })).enter().append('text')
                        .attr('class', 'places')
                        .transition().ease(ease).delay(timer).duration(0)
                        .text(function(d) {
                            return d.properties.name.toUpperCase();
                        })
                        .attr('font-size', 10)
                        .attr('font-family', function(d) {
                            if (d.properties.capital)
                                return "'Futura Today Demibold', Helvetica, Arial, sans-serif;";
                        })
                        .attr('text-anchor', function(d) {
                            if (d.properties.placement === 'right') return 'start';
                            if (d.properties.placement === 'left') return 'end';
                            return 'middle';
                        })
                        .attr('dy', function(d) {
                            if (d.properties.placement === 'right') return 4;
                            if (d.properties.placement === 'left') return 4;
                            if (d.properties.placement === 'bottom') return 18;
                            return -10;
                        })
                        .attr('dx', function(d) {
                            if (d.properties.placement === 'right') return 10;
                            if (d.properties.placement === 'left') return -10;
                            return 0;
                        })
                        .attr('x', function(d) {
                            return projection(d.geometry.coordinates)[0];
                        })
                        .attr('y', function(d) {
                            return projection(d.geometry.coordinates)[1];
                        });

                }

            }

            console.log('end drawmap');

        } //drawmap
    });
    console.log('return view');
    return view;
});