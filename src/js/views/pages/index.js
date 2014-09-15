define([
	'jquery',
	'underscore',
	'backbone',
    'views/components/resultList',
    'models/dataManager',
    'models/indexModel',
    'text!views/pages/index.html'
],
function ($, _, Backbone, ResultList, dataManager, IndexModel, templateFile) {

    var resultList,
        resultMap,
        indexView = Backbone.View.extend({
        
        model: new IndexModel(),
        
        template: _.template(templateFile),
        
        useOembedTemplate: false,
        
        initialize: function () {
            this.listenTo(dataManager, 'change:senate', this.refresh);
            this.listenTo(dataManager, 'change:house', this.refresh);
            this.listenTo(dataManager, 'change:governors', this.refresh);
            this.listenTo(dataManager, 'change:initiatives', this.refresh);
        },
        
        render: function () {
            
            resultList = new ResultList();
            resultList.model.race = this.model.race;
            resultList.model.data = dataManager[this.model.race].data;
            resultList.render();
            
            this.$el.html(this.template(this.model));
            
            this.$("#list").html(resultList.el);
            
            return this;
        },
        
        refresh: function () {
            console.log('index refresh');
            
            resultList.model.race = this.model.race;
            resultList.model.data = dataManager[this.model.race].data;
            resultList.render();
        }
    });
    
    return indexView;
});