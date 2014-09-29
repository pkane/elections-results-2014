/* jshint unused: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'models/config',
],
    function ($, _, Backbone, config) {
        'use strict';
        
        return {
            registerAd: function (domId, adUnit, adSizes, targetingObj) {
                console.log('Ad: ' + domId + ' - ' + adUnit);
	   
                var $node = $('#' + domId);

                if (config.pageInfo.platform === 'mobile') {
                    
                    $node.css({ background: '#ccc', width: '320px', height: '50px', textAlign: 'center', margin: '0 auto' });

                } else {

                    $node.css({ background: '#ccc', width: '300px', height: '250px', textAlign: 'center', paddingTop: '100px' });

                }

                $node.html(adUnit);
            }
        };
    });