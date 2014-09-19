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
        
        updateView = function (raceKey, stateAbbr, fip, oembed) {
            var race = _.findWhere(config.races, { key: raceKey }),
                state = _.findWhere(config.states, { abbr: stateAbbr });

            rootView.useOembedTemplate = (oembed !== null);
            rootView.model.race = race;
            rootView.model.state = state;

            navView.model.currentRace = race;
            navView.model.currentState = state;
            navView.refresh();

            // TODO: If not cached / most current version
            // FIXME: Request both detail and full if no data exists
            dataManager.loadRace(race, state);
            
            rootView.refresh();
        },
        
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
                    
                    updateView(raceKey, stateAbbr, '', oembed);
                });

                Router.on('route:race', function (raceKey, stateAbbr, fip, oembed) {
                    console.log('Nav to race w/ params: ' + raceKey + '|' + stateAbbr + '|' + fip);

                    updateView(raceKey, stateAbbr, fip, oembed);
                });
                
                dataManager.loadRace(_.findWhere(config.races, { key: 'summary' }));
                
                rootView.render();
                navView.render();

                Backbone.history.start();
            },
            
            refresh: function () {
                dataManager.loadRace(_.findWhere(config.races, { key: 'summary' }));
                dataManager.loadRace(_.findWhere(config.races, { key: 'updates' }));

                dataManager.loadRace(navView.model.currentRace, navView.model.currentState);
            }
        };
    
    return App;
});