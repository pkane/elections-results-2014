define(['backbone', 'underscore', 'models/config'], function (Backbone, _, config) {

    var getOpUri = function (op, params) {
        
        var opUri = config.api.op[op];
        
        if (params) {
            _.each(params, function (value, key) {
                opUri = opUri.replace('{' + key + '}', value);
            });
        }
        
        return config.api.base + opUri;
    },
    settingsCount = 0,
    getSettings = function (completeHandler) {
        return {
            dataType: 'jsonp',
            jsonpCallback: 'usat_' + settingsCount++,
            cache: true,
            complete: completeHandler,
            error: errorHandler
        };
    },
    errorHandler = function (xhr, statusCode, msg) {
        // TODO: error handling
        console.dir(xhr);
        console.log('Data error: ' + statusCode + '::' + msg);
    },
    DataFeed = Backbone.Model.extend({
        data: [],
        loaded: false,
        loading: false,
        required: false,
        detail: [],
        updateTime: new Date()
    }),
    
    instance = new (Backbone.Model.extend({
        
        initiatives: new DataFeed(),
        house: new DataFeed(),
        senate: new DataFeed(),
        governors: new DataFeed(),
        summary: new DataFeed(),
        updates: new DataFeed(),
        
        loadRace: function (race, state) {
            console.log('DataMan load ' + race.key + ' v.' + config.api.dataFeedVersionId);
            
            var isDetail = (state && race.detail),
                opKey = (isDetail) ? race.detail : race.op,
                opUri = getOpUri(opKey, { raceId: (race) ? race.id : '', stateId: (state) ? state.id : '00' }),
                opData = (isDetail) ? instance[race.key].detail[state.id] : instance[race.key],
                opSettings = getSettings(function (xhr, statusCode) {
                    if (statusCode === 'success' && typeof xhr.responseJSON !== 'string') {
                        opData.loading = false;
                        opData.data = xhr.responseJSON;
                        opData.updateTime = new Date();
                        opData.loaded = config.api.dataFeedVersionId;

                        instance.trigger('change:' + race.key);
                    }
                });
            
            if (config.api.dataFeedVersionId === 0) {
                console.log('No data feed version');
                return; // Ignore initial 0 state? queue request until version updates?
            } else if (opData && (opData.loading || opData.loaded === config.api.dataFeedVersionId)) {
                console.log('Using cached data/request');
                return;
            } else {
                
                if (isDetail && !opData) {
                    instance[race.key].detail[state.id] = new DataFeed();
                    opData = instance[race.key].detail[state.id];
                }
                
                opData.loading = true;
                
                $.ajax(opUri, opSettings);
            }
        },
        
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

        getGeo: function(level, type) {
            var url = '';

            if (type === 'simp' || type === 'centroids') {
                url = 'data/geo/' + level + '.' + type + '.js';
            } else if (level === 'states' && type === 'zoom') {
                url = 'data/geo/' + level + '.js';
            } else if (type) {
                url = 'data/geo/' + level + '/' + type + '.js';
            } else if (level === 'places') {
                url = 'data/geo/places.js';
            } else {
                url = 'data/geo/' + level + '.js';
            }

            return config.geoBase + url;
        },

        loadGeo: function (level, type) {
            var url = '';
            
            if (type === 'simp' || type === 'centroids') {
                url = 'data/geo/' + level + '.' + type + '.js';
            } else if (level === 'states' && type === 'zoom') {
                url = 'data/geo/' + level + '.js';
            } else if (type) {
                url = 'data/geo/' + level + '/' + type + '.js';
            } else if (level === 'places') {
                url = 'data/geo/places.js';
            } else {
                url = 'data/geo/' + level + '.js';
            }
            
            $.getJSON(url, function (data) {
                if (type === 'simp' || type === 'centroids') {
                    instance.geo[level][type] = data;
                } else if (type) {
                    instance.geo[level][type] = data;
                } else {
                    instance.geo[level] = data;
                }
                instance.trigger('change:' + level);
            });
        }
        
    }))();

    return instance;
});