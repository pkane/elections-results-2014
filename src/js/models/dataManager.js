define(['backbone', 'underscore', 'models/config'], function (Backbone, _, config) {

    var getOpUri = function (op, params) {
        
        var opUri = config.api.op[op];
        
        opUri = opUri.replace('{dataFeedVersionId}', '2014'); //config.api.dataFeedVersionId);
        
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
    
    instance = new (Backbone.Model.extend({
        
        initiatives: {
            data: [],
            loaded: false,
            required: false,
            detail: [],
            updateTime: new Date()
        },
        
        house: {
            data: [],
            loaded: false,
            required: false,
            detail: [],
            updateTime: new Date()
        },
        
        senate: {
            data: [],
            loaded: false,
            required: false,
            detail: [],
            updateTime: new Date()
        },
        
        governors: {
            data: [],
            loaded: false,
            required: false,
            detail: [],
            updateTime: new Date()
        },

        summary: {
            data: [],
            loaded: false,
            required: true,
            updateTime: new Date()
        },
        
        updates: {
            data: [],
            loaded: false,
            required: false,
            updateTime: new Date()
        },
        
        loadRace: function (race, state) {
            console.log('DataMan load ' + race.key + ' v.' + config.api.dataFeedVersionId);
            
            var isDetail = (state && race.detail),
                opKey = (isDetail) ? race.detail : race.op,
                opUri = getOpUri(opKey, { raceId: (race) ? race.id : '', stateId: (state) ? state.id : '00' }),
                opSettings = getSettings(function (xhr, statusCode) {
                    if (statusCode === 'success' && typeof xhr.responseJSON !== 'string') {
                        instance[race.key].loaded = true;

                        if (isDetail) {
                            instance[race.key].detail[state.id] = xhr.responseJSON;
                        } else {
                            instance[race.key].data = xhr.responseJSON;
                        }

                        instance[race.key].updateTime = new Date();

                        instance.trigger('change:' + race.key);
                    }
                });
            
            if (config.api.dataFeedVersionId === 0) {
                return; // Ignore initial 0 state? queue request until version updates?
            } else {
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

            return url;
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