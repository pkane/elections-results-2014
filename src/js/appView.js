define([
    'jquery',
    'underscore',
    'backbone',
    'views/components/nav'
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
            
            if (this.currentNav) {
                this.currentNav.update();
            }

            $('#election-content').html(this.currentView.el);
        },

        setNav: function (model) {

            this.currentNav = new NavView({model: model});
            this.currentNav.render();

            $('#election-bar-content').html(this.currentNav.el);

        },
        
        refresh: function () {
            console.log('appView refresh');
            this.currentView.refresh();
        }

    });

    return AppView;

});