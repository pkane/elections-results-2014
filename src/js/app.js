define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'views/pages/index',
    'views/components/nav',
    'models/config',
    'models/dataManager'
],
function ($, _, Backbone, Router, IndexView, NavView, config, dataManager) {
    var rootView = new IndexView(),
        navView = new NavView(),
        
        checkFeedVersion = function () {
            console.log('data version check');

            $.ajax(config.api.base + config.api.op.version, {
                
                dataType: 'jsonp',
                jsonpCallback: 'ping',
                cache: true,
                timeout: config.api.pollFrequency,
            
                complete: function (xhr, statusCode) {
                    if (statusCode === 'success') {
                        var remoteVersion = parseInt(xhr.responseJSON);
                        
                        if (remoteVersion > config.api.dataFeedVersionId) {
                            config.api.dataFeedVersionId = remoteVersion;
                            App.refresh();
                        } else {
                            console.log('using current data');
                        }
                    }
                },
                error: function (xhr, statusCode, msg) {
                    // TODO: error handling
                    console.dir(xhr);
                    console.log('Version check error: ' + statusCode + '::' + msg);
                }
            
            });
        },
        checkFeedVersionInt,
        
        App = {
            
            init: function () {
                
                // Initial data version
                checkFeedVersion();
                
                // Setup data version loop
                if (checkFeedVersionInt > -1) {
                    clearInterval(checkFeedVersionInt);
                }
                checkFeedVersionInt = setInterval(checkFeedVersion, config.api.pollFrequency);

                // Setup routing handlers
                Router.on('route:index', function (indexType, stateAbbr, oembed) {
                    console.log('Nav to full race: ' + indexType);

                    var race = _.findWhere(config.races, { key: indexType }),
                        state = _.findWhere(config.states, { abbr: stateAbbr });
                    
                    rootView.useOembedTemplate = (oembed !== null);
                    
                    if (!indexType || indexType === 'index') {
                        indexType = 'senate';
                        stateAbbr = '';
                    }
                                        
                    rootView.model.race = indexType;
                    rootView.model.state = state;
                    
                    navView.model.set('currentRace', indexType);
                    navView.model.set('currentState', stateAbbr);

                    // TODO: If not cached / most current version
                    // FIXME: Request both detail and full if no data exists
                    dataManager.load(race, state);
                    
                    rootView.refresh();
                });

                Router.on('route:race', function (race, stateAbbr, fip, oembed) {
                    console.log('Nav to race w/ params: ' + race + '|' + stateAbbr + '|' + fip);

                    var state = _.findWhere(config.states, { abbr: stateAbbr });
                    
                    rootView.useOembedTemplate = (oembed !== null);
                    
                    rootView.model.race = race;
                    rootView.model.state = state;
                    rootView.model.fip = fip;
                    
                    navView.model.set('currentRace', race);
                    navView.model.set('currentState', stateAbbr);
                    
                    rootView.refresh();
                });
                
                rootView.render();
                navView.render();

                Backbone.history.start();
            },
            
            refresh: function () {
                var currentRace = _.findWhere(config.races, { key: navView.model.get('currentRace') }),
                    currentState = _.findWhere(config.states, { abbr: navView.model.get('currentState') });
                
                dataManager.load(currentRace, currentState);
            }
        };
    
    return App;
});