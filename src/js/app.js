/* global siteManager */
define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'appView',
    'views/pages/index',
    'views/pages/state',
    'views/pages/race',
    'models/navModel'
],
function ($, _, Backbone, Router, AppView, IndexView, StateView, RaceView, NavModel) {
    var rootView = new AppView(),
        nav = new NavModel(),
        App = {
            init: function () {

                // FIXME: && if !chromeless
                if (typeof(siteManager) !== 'undefined') {
                    siteManager.header.setClosedFixed();
                }

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
            }
        };
    
    return App;
});