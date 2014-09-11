define(['backbone', 'models/config'], function (Backbone, Config) {

    return Backbone.Model.extend({
        
        currentRace: 'senate',
        currentState: '',
        
        states: Config.states.slice() // Copy all states
        
    });
    
});