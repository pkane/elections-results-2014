define([
    'jquery',
    'underscore',
    'backbone',
    'models/navModel',
    'models/config',
    'text!views/components/nav.html',
    'events/analytics'
],
function ($, _, Backbone, NavModel, config, templateFile, analytics) {

    var indexView = Backbone.View.extend({
        
        className: 'election-navigation',
        
        model: new NavModel(),
        
        template: _.template(templateFile),

        shareUrl: function() {
            var hash = '#' + this.model.currentRace.key + ((this.model.currentState) ? '-' + this.model.currentState.abbr : '');
            return config.share + hash;
        },

        text: {
            message: _.template('Latest <%- race %> race results via @USATODAY #election2014'),

            facebook: _.template('https://www.facebook.com/dialog/feed/?app_id=<%- appid %>&link=#url#&redirect_uri=#url#name=<%- message %>'),
            twitter: _.template('https://twitter.com/intent/tweet?url=#url#&text=<%- message %>'),
            mail: _.template('mailto:?subject=<%- message %>&body=#url#')
        },

        events: {
            'click .share-icon': 'toggleShare',
            'click .dd-nav-link' : 'navLinkClicked',            
            'click .navbar-race .nav-item.selected': 'toggleRaceSelect',            
            'click .close-nav' : 'close',
            'click #facebook-share': 'shareFacebook',
            'click #twitter-share': 'shareTwitter',
            'click #mail-share': 'shareEmail',
            'click a': 'navItemClicked'
        },

        navItemClicked: function(e) {
            var $target = $(e.target),
                $parent = $target.parent(),
                href = e.target.href;
                ;

            if (href && href.indexOf('#') !== -1 && href != window.location.href && (window.innerWidth > config.maxTabletWidth || !$parent.hasClass('selected'))) {                
                analytics.trigger('track:event', 'results2014' + $target.text().toLowerCase());

                if (!config.isMobile) {
                    window.location = e.target.href;    
                }                
            }
        },

        navLinkClicked: function() {
            this.close();
        },

        hideShare: function() {
            this.$('.elections-bar-dropdown').hide();
        },

        hideRaceSelect: function() {
            this.$('.elections-share-dropdown').hide();
        },

        shareFacebook: function(e) {
            analytics.trigger('track:event', 'elections2014facebook');

            if (window.FB) {

               e.preventDefault(); 

               window.FB.ui({
                  method: 'share_open_graph',
                  action_type: 'og.likes',
                  action_properties: JSON.stringify({ object: this.shareUrl() })
                }, function(response){});
                     
            }
        },

        shareTwitter: function(e) {
            analytics.trigger('track:event', 'elections2014twitter');

            if (!config.isMobile) {
                e.preventDefault();
                window.open(e.target.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=550,height=420');
            }
        },

        shareEmail: function(e) {
            analytics.trigger('track:event', 'elections2014email');
        },
        
        toggleOverlay: function() {
            this.$('.elections-overlay').toggle();
            $(this.el).toggleClass('modal-on');
            $(this.el).parent().toggleClass('inherit');
        },

        toggleShare: function () {
            console.log('toggle share');
            this.$('.elections-share-dropdown').toggle();
            this.toggleOverlay();
        },

        toggleRaceSelect: function(e) {
            if (window.innerWidth < 992) {
                console.log('toggle race selected');

                e.preventDefault();                
                this.$('.elections-bar-dropdown').toggle();
                this.toggleOverlay();
            }
        },  
        
        initialize: function () {
            $('#election-bar-content').html(this.el);

            // collapse nav on scroll on desktop
            if (!config.isMobile) {
                var $win = $(window);

                $win.scroll(function () {
                    if ($win.scrollTop() > 0) {
                        $('#election-bar-content').addClass("collapsed");
                    } else {
                        $('#election-bar-content').removeClass("collapsed");
                    }
                });
            }
        },  
        
        render: function () {            
            this.$el.html(this.template(this.model));
            this.refresh();

            return this;
        },
        
        refresh: function () {
            var race = this.model.currentRace,
                state = this.model.currentState,
                fips = this.model.currentFips,
                message = escape(this.text.message({ race: race.display })),
                url = encodeURIComponent(this.shareUrl()),
                pageTitle = ''
                ;

            console.log("### RACE ", state);

            if (race.key == "initiatives") { 
                this.$('.election-office-projection-heading').addClass('initiatives') 
            } else { 
                this.$('.election-office-projection-heading').removeClass('initiatives'); 
            }
            
            if (race.id === 's') {
                fips = (fips === '2') ? 'Special Election' : '';
            }
            
            if (state && state.id) {
                pageTitle = ((config.isMobile) ? state.abbr.toUpperCase() : state.display) + ' ' ;
            }
            pageTitle += race.display + ' ' + ((race.id !== 'i') ? fips : '') + ' Results';
            
            this.$('.election-office-projection-heading').text(pageTitle);

            this.$('.nav-item').removeClass('selected');            
            this.$('.' + race.key + '-nav-item').addClass('selected');
            
            this.$('.page-icon .icon').removeClass().addClass('icon ' + this.model.getStateIcon());
            this.$('.page-icon-mini .icon').removeClass().addClass('icon ' + this.model.getStateIcon());

            this.$('#facebook-share').attr('href', this.text.facebook({ appid: config.pageInfo.facebook.app_id, message: message }).replace(/#url#/g, url));
            this.$('#mail-share').attr('href', this.text.mail({ message: message }).replace(/#url#/g, url));            
            this.$('#twitter-share').attr('href', this.text.twitter({ message: message }).replace(/#url#/g, url));
        },

        close: function(e) {
            this.hideShare();
            this.hideRaceSelect();
            this.toggleOverlay();
        }          
        
    });
    
    return indexView;
});