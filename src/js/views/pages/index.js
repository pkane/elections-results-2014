define([
	'jquery',
	'underscore',
	'backbone',
    'models/indexModel',
    'text!views/pages/index.html'
],
function ($, _, Backbone, IndexModel, templateFile) {

    var indexView = Backbone.View.extend({
        
        model: new IndexModel(),
        
        template: _.template(templateFile),
        
        useOembedTemplate: false,
        
        render: function () {
            
            this.$el.html(this.template(this.model));
            
            //this.switchMaps();
            
            return this;
        },
        
        switchMaps: function () {

            var mapTemplate = _.template('<iframe id="stateMap" src="http://www.gannett-cdn.com/GDContent/2014/elections/maps/<%= mapType %>/" frameborder="0" scrolling="no" width="<%= width %>" height="800"></iframe>'),
                mapWidth = '100%',
                isiPad = navigator.userAgent.match(/iPad/i) !== null,
                isiPhone = navigator.userAgent.match(/iPhone/i) !== null;
            
            if (model.race === 'governors')
            {
                mapType = 'gov';
            }
            else
            {
                mapType = model.race;
            }
            
            // FIXME: Android? Shouldn't this be width based or framework (desktop v. mobile)?
            if (isiPad || isiPhone) {
                mapWidth = document.body.offsetWidth - 80;
            }
            
            this.$('.map-container').html(mapTemplate({ mapType: mapType, width: mapWidth }));
        }
    });
    
    return indexView;
});