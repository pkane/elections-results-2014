define([
	'jquery',
	'underscore',
	'backbone',
    'views/components/resultList',
    'views/components/resultMap',
    'views/components/balanceChart',
    'views/components/ads',
    'models/dataManager',
    'models/indexModel',    
    'text!views/pages/index.html',
    'mapbox'
],
function ($, _, Backbone, ResultList, ResultMap, BalanceChart, AdView, dataManager, IndexModel, templateFile, Mapbox) {

    var resultList,
        resultMap,
        balanceChart,
        adView,
        indexView = Backbone.View.extend({
        
        el: '#election-content',
            
        model: new IndexModel(),
        
        template: _.template(templateFile),
        
        useOembedTemplate: false,
        
        initialize: function () {
            balanceChart = new BalanceChart();
            resultMap = new ResultMap();
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

            adView = new AdView();

            L.mapbox.accessToken = 'pk.eyJ1IjoidHJlYmxla2lja2VyIiwiYSI6IjRKTXZtUUEifQ.VBdcmyofyon7L2RFAuGsXQ';
            var map = L.mapbox.map('mapbox', 'treblekicker.jiojdl2a');
            
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

            if (adView)
                adView.refresh();
        },
        
        refreshResults: function () {
            console.log('index refresh ', this.model.race);
            
            resultList.model.race = resultMap.model.race = this.model.race;
            resultList.model.state = resultMap.model.state = this.model.state;
            resultList.model.data = resultMap.model.data = dataManager[this.model.race.key].data;
            resultList.model.detail = resultMap.model.detail = (this.model.state) ? dataManager[this.model.race.key].detail[this.model.state.id] : [];
            resultList.render();
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