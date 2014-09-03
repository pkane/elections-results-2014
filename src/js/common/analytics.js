/* jshint unused: false */
define([
    'jquery',
    'underscore',
    'backbone'
],
    function ($, _, Backbone) {
        'use strict';
        
        return {
            trackEvent: function (trackLabel, destinationUrl) {
                // console.log('Register click event: ' + trackLabel);
            },

            trackPageView: function (infoObj) {
                // console.log('trackPageView');
                //console.log('Register page view: ' + infoObj.ssts + ' '
                //	 + infoObj.cst + ' '
                //	 + infoObj.contentType);
            },
        };
    });