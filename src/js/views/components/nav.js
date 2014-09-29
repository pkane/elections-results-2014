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

        text: {
            message: _.template('Learn more about key #election2014 <%- race %> races via the @USATODAY Election Outlook'),

            facebook: _.template('https://www.facebook.com/dialog/feed/?app_id=<%- appid %>&link=#url#&redirect_uri=#url#name=<%- message %>'),
            twitter: _.template('https://twitter.com/intent/tweet?url=#url#&text=<%- message %>'),
            mail: _.template('mailto:?subject=<%- message %>&body=#url#')
        },

        events: {
            'click .share-icon': 'shareToggle',
            'click .elections-bar-nav-item .office-placeholder'             : "openOverlay",
            'click .close-nav'                                              : "close",
            'click #facebook-share': 'shareFacebook',
            'click #twitter-share': 'shareTwitter',
            'click #mail-share': 'shareEmail',
        },

        _getShareUrl: function() {
            return escape(location.href);
        },

        shareFacebook: function(e) {
            console.log("share facebook ", this._getShareUrl());

            analytics.trigger('track:event', "elections2014facebook");

            if (window.FB) {

               e.preventDefault(); 

               window.FB.ui({
                  method: 'share_open_graph',
                  action_type: 'og.likes',
                  action_properties: JSON.stringify({ object: this._getShareUrl() })
                }, function(response){});
                     
            }

            this.shareToggle();
        },

        shareTwitter: function(e) {
            console.log("share twitter ", e);

            analytics.trigger('track:event', "elections2014twitter");

            if (!config.isMobile) {
                e.preventDefault();
                window.open(e.target.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=550,height=420');
            }                

            this.shareToggle();
        },

        shareEmail: function(e) {
            console.log('share email');
            analytics.trigger('track:event', "elections2014email");
            this.shareToggle();            
        },
        
        shareToggle: function () {
            this.$el.find(".share-overlay").toggle();
        },

        initialize: function () {
            $('#election-bar-content').html(this.el);                        
        },  
        
        render: function () {            
            this.$el.html(this.template(this.model));
            this.refresh();

            return this;
        },
        
        refresh: function () {
            var race = this.model.currentRace,
                state = this.model.currentState,
                message = escape(this.text.message({ race: race.display })),
                url = this._getShareUrl()
                ;

            this.$('.election-office-projection-heading').text(race.display + ' Results');
            
            this.$('.elections-bar-nav-item').removeClass('active-item');
            
            this.$('.elections-bar-nav-item-' + race.key).addClass('active-item');
            
            this.$('.page-icon .icon').removeClass().addClass('icon ' + this.model.getStateIcon());

            this.$('#facebook-share').attr('href', this.text.facebook({ appid: config.pageInfo.facebook.app_id, message: message }).replace(/#url#/g, url));
            this.$('#mail-share').attr('href', this.text.mail({ message: message }).replace(/#url#/g, url));            
            this.$('#twitter-share').attr('href', this.text.twitter({ message: message }).replace(/#url#/g, url));
        },

        toggleOverlay: function(target) {
            var overlay = $('.election-overlay');
            if (overlay.hasClass("clicked")) {
                overlay.removeClass("clicked");
            } else {
                overlay.addClass("clicked");
            }
        },        

        openOverlay: function(e) {
            e.preventDefault();
            this.toggleOverlay(e.currentTarget)
            if ($(window).width() > 1200) {
                this.openJumbo()
            }
        },   

        close: function(e) {
            var overlay = this.$el.find(".election-overlay");
            overlay.removeClass("clicked");
        },             

        toggleDropdown: function(e) {
            e.preventDefault()
            var tar = $(e.currentTarget).next('.elections-dropdown')
            if (tar.hasClass("clicked")) {
                tar.removeClass("clicked")
            } else {
                tar.addClass("clicked")
            }
        }        
        
    });
    
    return indexView;
});