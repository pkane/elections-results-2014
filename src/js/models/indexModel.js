define(['backbone'], function (Backbone) {

    return Backbone.Model.extend({
        
        isMobile: false,
        
        race: { key: '' },
        
        state: false
        
    });

});