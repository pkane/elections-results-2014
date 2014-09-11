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
    getSettings = function (completeHandler) {
        return {
            dataType: 'jsonp',
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
            required: false
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
        
        load: function (race) {
            console.log('DataMan load ' + race.key + ' v.' + config.api.dataFeedVersionId);
                        
            $.ajax(
                getOpUri(race.op, { raceId: race.id }),
                getSettings(function (xhr, statusCode) {
                    if (statusCode === 'success' && typeof xhr.responseJSON !== 'string') {
                        instance[race.key].loaded = true;
                        instance[race.key].data = xhr.responseJSON;
                    }
                })
            );
        }
        
    }))();

    return instance;
});