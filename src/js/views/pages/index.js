define([
	'jquery',
	'underscore',
	'backbone',
    'views/components/resultList',
    'views/components/resultMap',
    'models/dataManager',
    'models/indexModel',
    'text!views/pages/index.html'
],
function ($, _, Backbone, ResultList, ResultMap, dataManager, IndexModel, templateFile) {

    var resultList,
        resultMap,
        indexView = Backbone.View.extend({
        
        el: '#election-content',
            
        model: new IndexModel(),
        
        template: _.template(templateFile),
        
        useOembedTemplate: false,
        
        initialize: function () {
            this.listenTo(dataManager, 'change:senate', this.refresh);
            this.listenTo(dataManager, 'change:house', this.refresh);
            this.listenTo(dataManager, 'change:governors', this.refresh);
            this.listenTo(dataManager, 'change:initiatives', this.refresh);
            
            $('#election-content').html(this.el);
        },
        
        render: function () {
            
            resultList = new ResultList();

            resultMap = new ResultMap();
            
            this.refresh();
            
            this.$el.html(this.template(this.model));
            
            this.$("#list").html(resultList.el);

            this.$("#map").html(resultMap.el);
            
            return this;
        },
        
        refresh: function () {
            console.log('index refresh');
            
            resultList.model.race = this.model.race;
            resultList.model.state = this.model.state;
            resultList.model.data = dataManager[this.model.race.key].data;
            resultList.model.detail = (this.model.state) ? dataManager[this.model.race.key].detail[this.model.state.id] : [];
            resultList.render();

            //resultMap.model.race = this.model.race;
            //resultMap.model.state = this.model.state;
            //resultMap.model.data = dataManager[this.model.race.key].data;
            //resultMap.model.detail = (this.model.state) ? dataManager[this.model.race.key].detail[this.model.state.id] : [];
            resultMap.render();
        }
    });
    
    return indexView;
});