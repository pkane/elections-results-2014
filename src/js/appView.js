define([
    'jquery',
    'underscore',
    'backbone'
],
function ($, _, Backbone) {
    'use strict';
    
    var AppView = Backbone.Router.extend({

        el: '#election-content',

        initialize: function () {

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

        setNav: function (view) {
            if (this.currentNav) {
                this.currentNav.undelegateEvents();
                this.currentNav.remove();
                this.currentNav.off();
            }

            this.currentNav = view;
            this.currentNav.render();

            $('#election-bar-content').html(this.currentNav.el);
        }

    });

    return AppView;

});