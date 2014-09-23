define([
	'jquery',
	'underscore',
	'backbone',
    'views/components/resultList',
    'views/components/resultMap',
    'views/components/balanceChart',
    'views/components/updatesFeed',
    'views/components/ads',
    'models/dataManager',
    'models/indexModel',    
    'text!views/pages/index.html'
],
function ($, _, Backbone, ResultList, ResultMap, BalanceChart, UpdatesFeed, AdView, dataManager, IndexModel, templateFile) {

    var resultList,
        resultMap,
        balanceChart,
        updatesFeed,
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
            updatesFeed = new UpdatesFeed();
            
            this.listenTo(dataManager, 'change:senate', this.refreshResults);
            this.listenTo(dataManager, 'change:house', this.refreshResults);
            this.listenTo(dataManager, 'change:governors', this.refreshResults);
            this.listenTo(dataManager, 'change:initiatives', this.refreshResults);
            
            this.listenTo(dataManager, 'change:summary', this.refreshSummary);
            
            this.listenTo(dataManager, 'change:updates', this.refreshUpdateFeed);

            $('#election-content').html(this.el);
        },
        
        render: function () {

            this.$el.html(this.template(this.model));
            
            this.$('#balanceOfPower').html(balanceChart.el);
            this.$("#map").html(resultMap.el);
            this.$('#list').html(resultList.el);

            this.$('#updatesFeed').html(updatesFeed.el);

            this.refresh();
            
            adView = new AdView();
            
            return this;
        },
            
        refresh: function () {
            this.refreshResults();
            
            this.refreshUpdateFeed();
            
            if (this.model.race.id === 'i') {
                this.$('#balanceOfPower').hide();
                this.$('#map').hide();
            } else {
                this.$('#balanceOfPower').show();
                this.$('#map').show();
                this.refreshSummary();
            }

            resultMap.render();
            
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
        },
        
        refreshSummary: function () {
            console.log('BoP refresh');
            
            balanceChart.model.data = dataManager.summary.data;
            balanceChart.model.race = this.model.race;
            balanceChart.model.updateTime = dataManager.summary.updateTime;

            balanceChart.render();
        },
 
        refreshUpdateFeed: function () {
            console.log('Feed refresh');
            
            updatesFeed.model.data = dataManager.updates.data;
            updatesFeed.render();
        }
    });
    
    return indexView;
});