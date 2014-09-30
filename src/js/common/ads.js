/* jshint unused: false */
define([
    'jquery',
    'underscore',
    'backbone'
],
    function ($, _, Backbone) {
        'use strict';

        var staticInfo = JSON.parse($('.staticinfo').html());
        
        return {
            registerAd: function (domId, adUnit, adSizes, targetingObj) {
                console.log('Ad: ' + domId + ' - ' + adUnit);
	   
                var $node = $('#' + domId);

                if (staticInfo.platform === 'mobile') {
                    
                    $node.css({ background: '#ccc', width: '320px', height: '50px', textAlign: 'center', margin: '0 auto' });

                } else {

                    $node.css({ background: '#ccc', width: '300px', height: '250px', textAlign: 'center', paddingTop: '100px' });

                }

                $node.html(adUnit);
            }
        };
    });