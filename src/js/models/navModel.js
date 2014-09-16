define(['backbone'], function (Backbone) {

    return Backbone.Model.extend({
        
        currentRace: {},
        currentState: {},
        
        getStateDisplay: function () {
            return (this.currentState && this.currentState.display) ? this.currentState.display : 'USA';
        },
        getStateIcon: function () {
            return 'icon-' + ((this.currentState && this.currentState.abbr) ? 'lg-' + this.currentState.abbr : 'usa-mainland');
        }
        
    });
    
});