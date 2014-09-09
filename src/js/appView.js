define([
    'jquery',
    'underscore',
    'backbone',
    'views/nav/nav'
],
function ($, _, Backbone, NavView) {
    'use strict';
    
    var AppView = Backbone.View.extend({

        el: '#election-content',

        initialize: function () {
            console.log('AppView Initialized');
        },

        showView: function (view) {

            if (this.currentView) {
                this.currentView.undelegateEvents();
                this.currentView.remove();
                this.currentView.off();
            }

            this.currentView = view;
            this.currentView.render();
            window.viewInited = true;

            $('#election-content').html(this.currentView.el);
        },

        setNav: function (model) {

            this.currentNav = new NavView(model);
            this.currentNav.render();

            // TODO: Add bindings / listeners to nav
            
            $('#election-bar-content').html(this.currentNav.el);
        }

    });

    return AppView;

});