define(['jquery', 'underscore', 'backbone', 'api/analytics', 'models/config'], function ($, _, Backbone, analytics, config) {

	var events = _.extend({}, Backbone.Events),
        initialized = false
        ;

	events.on({
		'track:pageview': function(pageViewName) {
			if (initialized) {
				console.log('track:pageview ', pageViewName);
			  
				analytics.trackPageView({
					ssts: config.ssts,
					cst: config.ssts,
					contentType : 'interactives',
					pathName: window.location.pathname + pageViewName
				});
			}
			  
			initialized = true;
		},

		'track:event': function(eventName) {
			console.log('track:event ', eventName);
			analytics.trackEvent(eventName);
		}
	});

	return events;
});