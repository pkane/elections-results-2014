define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'appView',
    'views/pages/index',
    'views/pages/state',
    'views/pages/race',
    'models/config',
    'models/dataManager',
    'models/navModel'
],
function ($, _, Backbone, Router, AppView, IndexView, StateView, RaceView, config, dataManager, NavModel) {
    var rootView = new AppView(),
        nav = new NavModel(),
        
        checkFeedVersion = function () {
            console.log('data check');

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

                    var view = new IndexView({useOembedTemplate: (oembed !== null)});
                    
                    if (!indexType || indexType === 'index') {
                        indexType = 'senate';
                        stateAbbr = '';
                    }
                                        
                    view.model.race = indexType;
                    
                    nav.set('currentRace', indexType);
                    nav.set('currentState', stateAbbr);

                    dataManager.load(_.findWhere(config.races, { key: indexType }), _.findWhere(config.states, { abbr: stateAbbr }));
                    
                    rootView.showView(view);
                });

                Router.on('route:race', function (race, stateAbbr, fip, oembed) {
                    console.log('Nav to race w/ params: ' + race + '|' + stateAbbr + '|' + fip);

                    var view = new RaceView({useOembedTemplate: (oembed !== null)});
                    
                    nav.set('currentRace', race);
                    nav.set('currentState', stateAbbr);
                    
                    rootView.showView(view);
                });
                
                rootView.setNav(nav);

                Backbone.history.start();
                
            },
            
            refresh: function () {
                var currentRace = _.findWhere(config.races, { key: nav.get('currentRace') }),
                    currentState = _.findWhere(config.states, { abbr: nav.get('currentState') });
                
                dataManager.load(currentRace, currentState);
                
                rootView.listenToOnce(dataManager, 'change:' + nav.get('currentRace'), function () {
                    
                    console.log('REFRESH!!');
                    
                    rootView.refresh();
                    
                });
            }
        };
    
    return App;
});