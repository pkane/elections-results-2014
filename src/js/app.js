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
                Router.on('route:index', function (raceKey, stateAbbr, oembed) {
                    console.log('Nav to full race: ' + raceKey);

                    if (!raceKey || raceKey === 'index') {
                        raceKey = 'senate';
                        stateAbbr = '';
                    }
                    
                    var race = _.findWhere(config.races, { key: raceKey }),
                        state = _.findWhere(config.states, { abbr: stateAbbr });
                    
                    rootView.useOembedTemplate = (oembed !== null);
                    rootView.model.race = race;
                    rootView.model.state = state;
                    rootView.refresh();
                    
                    navView.model.currentRace = race;
                    navView.model.currentState = state;
                    navView.refresh();
                    
                    // TODO: If not cached / most current version
                    // FIXME: Request both detail and full if no data exists
                    dataManager.load(race, state);
                });

                Router.on('route:race', function (raceKey, stateAbbr, fip, oembed) {
                    console.log('Nav to race w/ params: ' + raceKey + '|' + stateAbbr + '|' + fip);

                    var race = _.findWhere(config.races, { key: raceKey }),
                        state = _.findWhere(config.states, { abbr: stateAbbr });
                    
                    rootView.useOembedTemplate = (oembed !== null);
                    
                    rootView.model.race = race;
                    rootView.model.state = state;
                    rootView.model.fip = fip;
                    rootView.refresh();
                    
                    navView.model.currentRace = race;
                    navView.model.currentState = state;
                    navView.refresh();
                });
                
                rootView.render();
                navView.render();

                Backbone.history.start();
            },
            
            refresh: function () {
                dataManager.load(navView.model.currentRace, navView.model.currentState);
            }
        };
    
    return App;
});