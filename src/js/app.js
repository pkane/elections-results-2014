define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'views/pages/index',
    'views/components/nav',
    'models/config',
    'models/dataManager',
    'events/analytics'
],
function ($, _, Backbone, Router, IndexView, NavView, config, dataManager, analytics) {
    var rootView = new IndexView(),
        navView = new NavView(),
        
        checkFeedVersion = function () {

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
        
        updateView = function (raceKey, stateAbbr, fips, oembed) {
            console.log('update view ', raceKey);

            var race = _.findWhere(config.races, { key: raceKey }),
                state = _.findWhere(config.states, { abbr: stateAbbr });

            rootView.useOembedTemplate = (!!oembed);
            rootView.model.race = race;
            rootView.model.state = state;
            rootView.model.fips = fips;
            
            console.log('Setting fips ' + fips);

            navView.model.currentRace = race;
            navView.model.currentState = state;
            
            if (oembed) {
                $('#election-app').addClass('oembed');
                $(navView.el).hide();
            } else {
                $('#election-app').removeClass('oembed');
                navView.refresh();
                $(navView.el).show();
            }

            // TODO: If not cached / most current version
            // FIXME: If detail and no data, Request both detail and full
            
            dataManager.updates.required = !oembed;
            dataManager.summary.required = (race.key !== 'i');
            
            dataManager.loadRace(race);
            if (state) {
                dataManager.loadRace(race, state);
            }
            
            rootView.refresh();
            analytics.trigger('track:pageview', raceKey);
        },
        
        App = {
            
            init: function () {
                
                rootView.model.isMobile = config.isMobile;
                
                // Initial data version
                checkFeedVersion();
                
                // Setup data version loop
                if (checkFeedVersionInt > -1) {
                    clearInterval(checkFeedVersionInt);
                }
                checkFeedVersionInt = setInterval(checkFeedVersion, config.api.pollFrequency);

                // Setup routing handlers
                Router.on('route:index', function (raceKey, stateAbbr, oembed) {
                    console.log('Nav to full race: ', raceKey);

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

                Router.initialize();
            },
            
            refresh: function () {
                if (dataManager.summary.required) {
                    dataManager.loadRace(_.findWhere(config.races, { key: 'summary' }));
                }
                
                if (dataManager.updates.required) {
                    dataManager.loadRace(_.findWhere(config.races, { key: 'updates' }));
                }
                
                if (navView.model.currentRace.key) {
                    dataManager.loadRace(navView.model.currentRace, navView.model.currentState);
                }
            }
        };
    
    return App;
});