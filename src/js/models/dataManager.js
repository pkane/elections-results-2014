define(['backbone', 'underscore', 'models/config'], function (Backbone, _, config) {

    var getOpUri = function (op, params) {
        
        var opUri = config.api.op[op];
        
        opUri = opUri.replace('{dataFeedVersionId}', config.api.dataFeedVersionId);
        
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
            required: false
        },
        
        house: {
            data: [],
            loaded: false,
            required: false
        },
        
        senate: {
            data: [],
            loaded: false,
            required: false,
            forState: function (stateId) {
                return _.filter(instance.senate.data, function (obj) { return obj.id.substr(0, 2) === stateId; });
            }
        },
        
        governors: {
            data: [],
            loaded: false,
            required: false
        },

        summary: {
            data: [],
            loaded: false,
            required: false
        },
        
        load: function (race, state) {
            console.log('DataMan load ' + race.key + ' v.' + config.api.dataFeedVersionId);
            
            if (config.api.dataFeedVersionId === 0) {
                return; // Ignore initial 0 state? queue request until version updates?
            } else {
                $.ajax(
                    getOpUri(race.op, { raceId: (race) ? race.id : '', stateId: (state) ? state.id : '00' }),
                    getSettings(function (xhr, statusCode) {
                        if (statusCode === 'success' && typeof xhr.responseJSON !== 'string') {
                            instance[race.key].loaded = true;

                            //if (race.key === 'senate' || race.key === 'governors' || race.key === 'house') {
                                //instance[race.key].data = _.groupBy(xhr.responseJSON, function (obj) { return obj.id.substr(0, 2); });
                            //} else {
                            instance[race.key].data = xhr.responseJSON;
                            //}

                            console.log('trigger change:' + race.key);
                            instance.trigger('change:' + race.key);
                        }
                    })
                );
            }
        }
        
    }))();

    return instance;
});