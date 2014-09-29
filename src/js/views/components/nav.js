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

        shareUrl: function() { return escape(location.href); },

        text: {
            message: _.template('Learn more about key #election2014 <%- race %> races via the @USATODAY Election Outlook'),

            facebook: _.template('https://www.facebook.com/dialog/feed/?app_id=<%- appid %>&link=#url#&redirect_uri=#url#name=<%- message %>'),
            twitter: _.template('https://twitter.com/intent/tweet?url=#url#&text=<%- message %>'),
            mail: _.template('mailto:?subject=<%- message %>&body=#url#')
        },

        events: {
            'click .share-icon': 'toggleShare',
            'click .election-overlay-button-close': 'toggleShare',
            'click .race-mobile-select'             : "toggleRaceSelect",
            'click .close-nav'                                              : "close",
            'click #facebook-share': 'shareFacebook',
            'click #twitter-share': 'shareTwitter',
            'click #mail-share': 'shareEmail',
        },

        shareFacebook: function(e) {
            analytics.trigger('track:event', "elections2014facebook");

            if (window.FB) {

               e.preventDefault(); 

               window.FB.ui({
                  method: 'share_open_graph',
                  action_type: 'og.likes',
                  action_properties: JSON.stringify({ object: this.shareUrl() })
                }, function(response){});
                     
            }

            this.shareToggle();
        },

        shareTwitter: function(e) {
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
        
        toggleShare: function () {
            console.log('toggle share');
            this.$(".share-overlay").toggle();
        },

        toggleRaceSelect: function(e) {
            this.$(".race-select-overlay").toggle();    
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
                url = this.shareUrl()
                ;

            this.$('.election-office-projection-heading').text(race.display + ' Results');
            
            console.log('selected ', '.' + race.key + '-item');

            this.$('.nav-item').removeClass('selected');            
            this.$('.' + race.key + '-nav-item').addClass('selected');
            
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