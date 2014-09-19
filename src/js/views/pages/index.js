define([
	'jquery',
	'underscore',
	'backbone',
    'views/components/resultList',
    'views/components/resultMap',
    'views/components/balanceChart',
    'models/dataManager',
    'models/indexModel',
    'text!views/pages/index.html'
],
function ($, _, Backbone, ResultList, ResultMap, BalanceChart, dataManager, IndexModel, templateFile) {

    var resultList,
        resultMap,
        balanceChart,
        indexView = Backbone.View.extend({
        
        el: '#election-content',
            
        model: new IndexModel(),
        
        template: _.template(templateFile),
        
        useOembedTemplate: false,
        
        initialize: function () {
            balanceChart = new BalanceChart();
            resultList = new ResultList();
            
            this.listenTo(dataManager, 'change:senate', this.refreshResults);
            this.listenTo(dataManager, 'change:house', this.refreshResults);
            this.listenTo(dataManager, 'change:governors', this.refreshResults);
            this.listenTo(dataManager, 'change:initiatives', this.refreshResults);
            
            this.listenTo(dataManager, 'change:summary', this.refreshSummary);

            $('#election-content').html(this.el);
        },
        
        render: function () {

            this.refresh();
            
            this.$el.html(this.template(this.model));
            
            this.$('#balanceOfPower').html(balanceChart.el);
            this.$("#map").html(resultMap.el);
            this.$('#list').html(resultList.el);
            
            return this;
        },
            
        refresh: function () {
            this.refreshResults();
            
            if (this.model.race.id === 'i') {
                this.$('#balanceOfPower').hide();
            } else {
                this.$('#balanceOfPower').show();
                this.refreshSummary();
            }
        },
        
        refreshResults: function () {
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
        },
        
        refreshSummary: function () {
            console.log('BoP refresh');
            
            balanceChart.model.data = dataManager.summary.data;
            balanceChart.model.race = this.model.race;
            balanceChart.model.updateTime = dataManager.summary.updateTime;

            balanceChart.render();
        }
    });
    
    return indexView;
});