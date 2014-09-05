/* global siteManager */
define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'appView',
    'views/index/index',
    'models/indexModel'
],
function ($, _, Backbone, Router, AppView, IndexView, IndexModel) {
    var rootView = new AppView(),
        App = {
            init: function () {

                if (typeof(siteManager) !== 'undefined') {
                    siteManager.header.setClosedFixed();
                }

                Router.on('route:index', function (indexType, oembed) {

                    var model = new IndexModel(),
                        view = new IndexView();
                    
                    if (!indexType || indexType === 'index') {
                        indexType = 'senate';
                    }
                    
                    model.race = indexType;
                    model.useOembedTemplate = (oembed !== null);

                    view.model = model;
                    
                    rootView.showView(view);

                });

                Router.on('route:state', function (abbr, oembed) {

                    console.log('Show state: ' + abbr);

                    if (oembed) {
                        console.log('Use oembed template');
                    }
                });

                Router.on('route:race', function (race, stateAbbr, fip, oembed) {

                    console.log('Nav to race w/ params: ' + race + '|' + stateAbbr + '|' + fip);

                    if (oembed) {
                        console.log('Use oembed template');
                    }
                });

                Backbone.history.start();
            }
        };
    
    return App;
});