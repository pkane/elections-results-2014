/* jshint unused: false */

define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    'use strict';

    var init = function () {
        $('#election-content')[0].innerHTML = _.template('Underscore_ <%= status %>')({status: 'works'});
    };

    return {
        init: init
    };
});