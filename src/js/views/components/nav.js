define([
    'jquery',
    'underscore',
    'backbone',
    'models/navModel',
    'text!views/components/nav.html'
],
function ($, _, Backbone, NavModel, templateFile) {

    var indexView = Backbone.View.extend({
        
        className: 'election-navigation',
        
        model: new NavModel(),
        
        template: _.template(templateFile),

        events: {
            "click .elections-bar-nav-item .office-placeholder"             : "openOverlay",
            "click .close-nav"                                              : "closeOverlay"
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
                state = this.model.currentState;
            
            this.$('.election-office-projection-heading').text(race.display + ' Results');
            
            this.$('.elections-bar-nav-item').removeClass('active-item');
            
            this.$('.elections-bar-nav-item-' + race.key).addClass('active-item');
            
            this.$('.page-icon .icon').removeClass().addClass('icon ' + this.model.getStateIcon());
            
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

        closeOverlay: function(e) {
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