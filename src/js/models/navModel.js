define(['backbone', 'models/config'], function (Backbone, Config) {

    return Backbone.Model.extend({
        
        currentRace: {},
        currentState: {},
        
        states: Config.states.slice(), // Copy all states
        
        getStateDisplay: function () {
            return (this.currentState && this.currentState.display) ? this.currentState.display : 'USA';
        },
        getStateIcon: function () {
            return 'icon-' + ((this.currentState && this.currentState.abbr) ? 'lg-' + this.currentState.abbr : 'usa-mainland');
        }
        
    });
    
});