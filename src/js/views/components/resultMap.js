define([
    'jquery',
    'underscore',
    'backbone',
    'models/config',
    'models/dataManager',
    'models/fips',
    'text!views/components/resultMap.html',
    'd3',
    'events/analytics'
],
function ($, _, Backbone, config, dataManager, fipsMap, resultMap, D3, analytics) {
    var IE = $('html').hasClass('lt-ie9'),
        tooltip,
        templates = {
            tooltip: _.template('<h4 class="map-tooltip-heading"><%= heading %></h4>'
                + '<table class="table table-condensed"><thead><tr><th>Candidate</th><th class="right">Votes</th><th class="percent">%</th></tr></thead>'
                + '<tbody><%= listing %></tbody></table>'
                + '<span class="muted"><%= pctReporting %></span>'),
            tooltipItem: _.template('<tr><td><%= label %><%= win %></td>'
                + '<td class="right"><%= votes %></td>'
                + '<td class="right" style="text-align:right"><%= pct %></td></tr>')
        },
        voteFormat = d3.format(','),
        view = Backbone.View.extend({

        model: new (Backbone.Model.extend({}))(),
        
        template: _.template(resultMap),

        mapCache: { path: 'none', places: 'none' },    
            
        drawMap: function(geoJsonPath, geoJsonPlaces, strokeWidth) {
            
            if (this.model.race) {

                d3.json(geoJsonPath, _.bind(function(json) {
                    this.svg.html('');
                    this.svg                       
                        .selectAll('path')
                        .data(json.features)
                        .enter()
                        .append('path')
                        .attr('fill', _.bind(this.fillColor, this))
                        .attr('stroke', '#fff')
                        .attr('stroke-width', strokeWidth || 1)
                        .attr("d", d3.geo.path().projection(this.projection))
                        .attr("class", _.bind(this.cssClass, this))
                        .on('click', _.bind(this.clicked, this))
                        .on('mouseover', _.bind(this.mouseOver, this))
                        .on('mousemove', _.bind(this.mouseMove, this))                        
                        .on('mouseout', this.mouseOut)
                        ;

                        if (geoJsonPlaces) {
                            d3.json(geoJsonPlaces, _.bind(function(places) {

                                console.log('places found', places, this.model.state);

                                var projection = this.projection,
                                    state = this.model.state,
                                    filteredPlaces = _.filter(places.features, function(f) {
                                        return f.properties.state === state.id;
                                    }),
                                    fnX = function(d) { return projection(d.geometry.coordinates)[0] },
                                    fnY = function(d) { return projection(d.geometry.coordinates)[1] }
                                    ;

                                this.svg                                    
                                    .selectAll('circle')
                                    .data(filteredPlaces)
                                    .enter().append('circle')
                                    .attr({
                                        'cx': fnX,
                                        'cy': fnY,
                                        'r': 3,
                                        'stroke': 'rgb(12,12,12)',
                                        'stroke-width': 1,
                                        'fill': 'rgb(244,244,244)'
                                    })
                                    ;

                                this.svg
                                    .selectAll('circle.outline')
                                    .data(_.filter(filteredPlaces, function(f) {
                                        return f.properties.capital;
                                    }))
                                    .enter().append('circle')
                                    .attr({
                                        'class': 'places',
                                        'fill': 'none',
                                        'stroke': '#000',
                                        'stroke-width': 1,
                                        'cx': fnX,
                                        'cy': fnY,
                                        'r': 6
                                    })
                                    ;                                    

                                this.svg
                                    .selectAll('text')
                                    .data(filteredPlaces)
                                    .enter().append('text')
                                    .text(function(d) {
                                        return d.properties.name.toUpperCase();
                                    })
                                    .attr({
                                        'class': 'places',
                                        'fill': '#000000',
                                        'font-size': 11,
                                        'font-weight': 'bold',
                                        'x': fnX,
                                        'y': fnY
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
                                    });

                            }, this));
                         }                     

                }, this));
            }
        },

        cssClass: function(d) {
            if (this.model.state) {
                return (this.findItemById(d.id) ? "has-data state-level" : "");
            } else {
                return (this.findItemById(d.id) ? "has-data nation-level" : "");
            }
        },

        clicked: function(d) {
            if (!this.model.state && this.findItemById(d.id)) {
                var state = _.findWhere(config.states, { id: (this.model.race.id == 'h' ? d.id.substr(0, 2) : d.id) });

                analytics.trigger('track:event', this.model.race.key + 'results2014map' + state.abbr);
                window.location.hash = this.model.race.key + "-" + state.abbr;

            }
        },

        findItemById: function(id) {
            var item, state = id;

            if (this.model.race.id == 'h') {
                state = id.substr(0, 2);
                id = state + '-District ' + parseInt(id.substr(-2))
            }
            
            if (this.model.detail && this.model.detail.length > 0) {
                item = _.findWhere(this.model.detail, { id: id });
            } else {
                item = _.findWhere(this.model.data, { id: id });
            }

            return item;
        },

        mouseOver: function(d, i) {

            var found = this.findItemById(d.id);

            if (found) {
                var uncontested = (found.results && found.results.length === 1),
                    tooldata = {
                        heading: d.properties.name + ((this.model.state && (this.model.race.id != 'h')) ? ', ' + this.model.state.display : ''),
                        pctReporting: (!uncontested ? found.precincts.pct.toFixed(1) + '% Precincts reporting' : ''),
                        listing: _.chain(found.results).sortBy('seatNumber').reduce(function(memo, item, index, list) {
                            var itemData = {
                                label: (item.name ? item.name : 'Other') + (((item.name != '') && item.party) ? ' (' + item.party.substr(0,1).toUpperCase() + ')' : ''),
                                win: (item.win ? '<span class="won"></span>' : ''),
                                votes: (!uncontested ? voteFormat(item.votes) : 'Uncontested'),
                                pct: (!uncontested ? item.pct.toFixed(1) + '%' : '')
                            };
                            if (list[index-1] && list[index-1].seatNumber !== item.seatNumber) {
                                memo += '<tr><td colspan="3"><hr /></td></tr>';
                            }
                            return memo + templates.tooltipItem(itemData);
                        }, '').value()
                    };

                tooltip.html(templates.tooltip(tooldata));
                
                this.offsetTop = this.$el.offset().top;
                this.mouseMove(d, i);
            } else {
                tooltip.html('');
                tooltip.classed('hidden', true);
            }            
        },

        mouseMove: function(d, i) {
            if (tooltip.html() && tooltip.html() != '') {
                var mouse = d3.mouse(this.el),
                    mouseX = mouse[0], mouseY = mouse[1],                    
                    tooltipHeight = $(tooltip.node()).height(),
                    leftOffset = mouseX - 135,
                    topOffset = mouseY + 20;

                if ((this.offsetTop + mouseY + tooltipHeight) > (window.innerHeight + window.scrollY)) {                    
                    topOffset = mouseY - tooltipHeight - 40;
                }

                tooltip
                    .classed('hidden', false)
                    .attr('style', 'left:' + leftOffset + 'px; top:'+ topOffset + 'px; opacity: 1;')
                    ;                
            }

        },

        mouseOut: function() {
            tooltip.classed('hidden', true);
        },
        
        fillColor: function(d) {
            var id = d.id,
                partyColors = config.partyColors,
                state = id,
                hasState = !!this.model.state,
                found,
                color = partyColors.defaultColor
                ;

            if (this.model.race.id == 'h') {
                state = id.substr(0, 2);
                id = state + '-District ' + parseInt(id.substr(-2))
            } else if (this.model.state) {
                state = this.model.state.id;
            }
            
            if (this.model.detail && this.model.detail.length > 0) {
                found = _.findWhere(this.model.detail, { id: id });
            } else {
                found = _.findWhere(this.model.data, { id: id });
            }

            if (found) {
                if (!this.model.state || this.model.state && state == this.model.state.id) {
                    _.find(found.results, function(item) {
                        
                        var isCurrentSeat = !item.seatNumber || this.model.race.id === 'h' || (item.seatNumber === ((this.model.fips) ? this.model.fips : '0'));
                        
                        if (!hasState) {
                            if (item.win && isCurrentSeat) {
                                color = partyColors[item.party.toLowerCase() + "Win"] || partyColors["otherWin"];
                                return true;
                            } else if (item.lead && isCurrentSeat) {
                                color = partyColors[item.party.toLowerCase()] || partyColors["other"];
                            }
                        } else if (isCurrentSeat && (item.lead || (item.win && item.pct == 0))) {
                           color = partyColors[item.party.toLowerCase() + "Win"] || partyColors["otherWin"];
                        }
                    }, this);
                }
            }
            
            return color;
        },

        renderNav: function() {
            console.log('render nav');

            var swapBtn = this.$('.resultmap-swap-btn');
            
            var races = (this.model.detail && this.model.detail.length > 0) ? _.chain(this.model.detail[0].results).pluck('seatNumber').uniq().value() : [],
                currentSeat = (this.model.fips) ? this.model.fips : (this.model.race && this.model.race.id === 's') ? '0' : '1';
            
            if (this.model.race) {
                var raceKey = this.model.race.key,
                    altSeat = (races.length > 1) ? _.reject(races, function (i) { return i === currentSeat; })[0] : false;

                this.$('#state-list-dropdown-btn').css('display', 'inline-block');
                this.$('#resultmap-back-btn').attr("href", "#" + raceKey);

                if (altSeat) {

                    for (var i = races.length - 1; i >= 0; i--) {
                        $(swapBtn[i]).attr("href", "#race/" + raceKey + '-' + this.model.state.abbr + '-' + races[i]).html((races[i] === '0') ? 'General Election' : 'Special Election');
                        if ( i === races.indexOf(currentSeat) ) {
                            $(swapBtn[i]).addClass('active-race');
                        } else {
                            $(swapBtn[i]).removeClass('active-race');
                        }
                    };

                }

                this.$('.state-list-dropdown')
                    .html(_.map(config.states, function(state) {

                        var found = _.find(this.model.data, function(item) { return item.id.substr(0, 2) === state.id;  });

                        if (found) {
                            return ['<li><a class=\'state-list-link\' href=\'#', raceKey ,'-', state.abbr , '\'>', state.display ,'</a></li>'].join('');
                        }

                        return '';
                        
                    }, this).join(''));
            }
            
            this.$('#resultmap-back-btn').css('display', this.model.state ? 'inline-block': 'none');
            this.$('.resultmap-swap-btn').css('display', races.length > 1 ? 'inline-block': 'none');
            this.$('.main-map-controls').css('width', races.length > 1 ? '100%': 'auto');
        },

        refresh: function() {
            console.log('-- refresh --');
            
            this.renderMap();
            this.renderNav();
        },

        render: function () {
            console.log('-- render --');
            this.$el.html(this.template(this.model));            
            this.renderMap();
            this.renderNav();
            tooltip = d3.select("#map-tooltip");

            var stateListDropdown = this.$('.state-list-dropdown');
            this.$('#state-list-dropdown-btn').on('click', function() {
                !stateListDropdown.hasClass("visible") ? stateListDropdown.addClass("visible") : stateListDropdown.removeClass("visible")
            });

            return this;
        },

        renderMap: function() {
            if (this.model.race) {

                var width = this.$el.width(), 
                    height = Math.floor(width * 3 / 4),
                    scaleMultiplier = 1.0,
                    natScaleMultiplier = 1.2;

                if ($('#main-map').width() < 402) {
                    scaleMultiplier = 0.6;
                    natScaleMultiplier = 0.65;
                } else if ($('#main-map').width() < 610) {
                    scaleMultiplier = 0.9;
                    natScaleMultiplier = 0.9;
                }

                this.svg = d3.select(this.el)
                             .select('svg')
                             .attr('width', width)
                             .attr('height', height)
                             ;

                if (this.model.state) {
                    console.count('-- render STATE map');

                    d3.json(dataManager.getGeo('states', 'centroids'), _.bind(function(json) {

                        var found = _.findWhere(json.features, { id: this.model.state.id });                            

                        console.log('Setting projection', found.geometry.scale * scaleMultiplier);
                        this.projection = d3.geo
                                            .mercator()
                                            .translate([width/2, height/2])
                                            .scale(found.geometry.scale * scaleMultiplier)
                                            .center(found.geometry.coordinates)                                                    
                                            ;

                        if (this.model.race.id == 'h') {
                            this.drawMap(dataManager.getGeo('cds',  this.model.state.id), dataManager.getGeo('places'));
                        } else {
                            this.drawMap(dataManager.getGeo('counties', this.model.state.id), dataManager.getGeo('places'));
                        }

                    }, this));

                } else {
                    console.count('-- render NATIONAL map');

                    console.log('Setting projection', 800 * natScaleMultiplier); 
                    this.projection = d3.geo
                                        .albersUsa()
                                        .translate([width/2, height/2])
                                        .scale(800 * natScaleMultiplier)
                                        ;
                    
                    if (this.model.race.id == 'h') {
                        this.drawMap(dataManager.getGeo('cds', 'simp'), '', 0.3);
                    } else {
                        this.drawMap(dataManager.getGeo('states')); 
                    }

                }
            }
        }

    });
    
    return view;
});
