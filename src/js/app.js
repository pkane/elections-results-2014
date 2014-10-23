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
        
        oembedClickHandler = function () {
            if (window.parent) {
                window.parent.location.href = 'http://www.usatoday.com/pages/interactives/elections-results-2014/';
            } else {
                window.location.href = 'http://www.usatoday.com/pages/interactives/elections-results-2014/';
            }
        },
        
        checkFeedVersion = function () {

            $.ajax(config.api.base + config.api.op.version, {
                
                dataType: 'jsonp',
                jsonpCallback: 'ping',
                cache: true,
                timeout: config.api.pollFrequency,
                data: config.api.key,
            
                complete: function (xhr, statusCode) {
                    if (statusCode === 'success') {
                        var remoteVersion = parseInt(xhr.responseJSON);
                        
                        if (remoteVersion > config.api.dataFeedVersionId) {
                            $('body').attr('data-version', remoteVersion);
                            
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
            
            if (oembed) {
                $('#election-app').addClass('oembed');
                $('body').on('click', oembedClickHandler);
            } else {
                $('#election-app').removeClass('oembed');
                $('body').off('click', oembedClickHandler);
            }
            
            rootView.useOembedTemplate = (!!oembed);
            rootView.model.race = race;
            rootView.model.state = state;
            rootView.model.fips = fips;
            
            navView.model.currentRace = race;
            navView.model.currentState = state;
            navView.model.currentFips = fips;
            navView.refresh();
            
            dataManager.updates.required = !oembed;
            dataManager.summary.required = (race.id !== 'i');
            
            dataManager.loadRace(race);
            if (state && race.id !== 'i') { // Initiatives detail comes from main feed
                dataManager.loadRace(race, state);
            }
            
            rootView.refresh();
            analytics.trigger('track:pageview', raceKey);
            window.scroll(0,0);
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
                    dataManager.loadRace(navView.model.currentRace);
                    if (navView.model.currentState && navView.model.currentRace.id !== 'i') {
                        dataManager.loadRace(navView.model.currentRace, navView.model.currentState);
                    }
                }
            }
        };
    
    return App;
});