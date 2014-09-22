/* jshint unused: false */
define([
    'jquery',
    'underscore',
    'backbone'
],
    function ($, _, Backbone) {
        'use strict';
        
        return {
            registerAd: function (domId, adUnit, adSizes, targetingObj) {
                console.log('Ad: ' + domId + ' - ' + adUnit);

                $('#' + domId).html(adUnit);
            }
        };
    });