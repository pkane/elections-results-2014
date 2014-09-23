define(['jquery', 'underscore', 'backbone', 'api/analytics', 'models/config'], function ($, _, Backbone, analytics, config) {

	var events = _.extend({}, Backbone.Events);

	events.on({
		'track:pageview': function(pageViewName) {
			analytics.trackPageView({
				ssts: config.ssts,
				cst: config.ssts,
				contentType : 'interactives',
				pathName: window.location.pathname + pageViewName
			});
		},

		'track:event': function(eventName) {
			analytics.trackEvent(eventName);
		}
	});

	return events;
});