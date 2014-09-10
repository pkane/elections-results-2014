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
    'models/indexModel',
    'models/navModel'
],
function ($, _, Backbone, Router, AppView, IndexView, StateView, RaceView, IndexModel, NavModel) {
    var rootView = new AppView(),
        nav = new NavModel(),
        App = {
            init: function () {

                // FIXME: && if !chromeless
                if (typeof(siteManager) !== 'undefined') {
                    siteManager.header.setClosedFixed();
                }

                Router.on('route:index', function (indexType, oembed) {

                    var model = new IndexModel(),
                        view = new IndexView();
                    
                    if (!indexType || indexType === 'index') {
                        indexType = 'senate';
                    }
                    
                    nav.set('currentRace', indexType);
                    nav.set('currentState', '');
                    
                    model.race = indexType;
                    model.useOembedTemplate = (oembed !== null);

                    view.model = model;
                    
                    rootView.showView(view);

                });

                Router.on('route:state', function (abbr, oembed) {

                    var view = new StateView();
                    
                    nav.set('currentState', abbr);
                    
                    rootView.showView(view);
                    
                    if (oembed) {
                        console.log('Use oembed template');
                    }
                });

                Router.on('route:race', function (race, stateAbbr, fip, oembed) {

                    var view = new RaceView();
                    
                    console.log('Nav to race w/ params: ' + race + '|' + stateAbbr + '|' + fip);

                    nav.set('currentRace', race);
                    nav.set('currentState', stateAbbr);
                    
                    rootView.showView(view);
                    
                    if (oembed) {
                        console.log('Use oembed template');
                    }
                });
                
                rootView.setNav(nav);

                Backbone.history.start();
            }
        };
    
    return App;
});