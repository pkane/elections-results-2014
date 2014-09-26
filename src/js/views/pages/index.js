define([
	'jquery',
	'underscore',
	'backbone',
    'views/components/resultList',
    'views/components/balanceChart',
    'views/components/updatesFeed',
    'views/components/ads',
    'models/dataManager',
    'models/indexModel',    
    'text!views/pages/index.html'
],
function ($, _, Backbone, ResultList, BalanceChart, UpdatesFeed, AdView, dataManager, IndexModel, templateFile) {

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
            
            this.refresh();
            
            return this;
        },
            
        refresh: function () {
            
            var isReady = (this.model.race.key !== ''),
                needsBoP = (this.model.race.id !== 'i'),
                needsMap = (!this.useOembedTemplate && !this.model.isMobile && this.model.race.id !== 'i'),
                needsResultList = (!this.useOembedTemplate || this.model.race.id === 'i'),
                needsUpdateFeed = (!this.useOembedTemplate),
                needsAds = (!this.useOembedTemplate);
            
            if (isReady) {
                
                if (needsBoP) { 
                    if (!balanceChart) {
                        balanceChart = new BalanceChart();
                        this.$('#balanceOfPower').html(balanceChart.el);
                    }
                    this.$('#balanceOfPower').show();
                    this.refreshSummary();
                } else {
                    this.$('#balanceOfPower').hide();
                }
                               
                if (needsMap) { 
                    this.$('#map').show();
                } else {
                    this.$('#map').hide();
                }
                
                if (needsResultList) {
                    if (!resultList) {
                        resultList = new ResultList();
                        this.$('#list').html(resultList.el);
                    }
                    this.$('#list').show();
                    this.refreshResults();
                } else {
                    this.$('#list').hide();
                }
                               
                if (needsUpdateFeed) {
                    if (!updatesFeed) {
                        updatesFeed = new UpdatesFeed();
                        this.$('#updatesFeed').html(updatesFeed.el);
                    }
                    this.$('#updatesFeed').show();
                    this.refreshUpdateFeed();
                } else {
                    this.$('#updatesFeed').hide();
                }
                
                if (needsAds) {
                    if (!adView) {
                        adView = new AdView();
                    }
                    this.$('.adview').show();
                    adView.refresh();
                } else {
                    this.$('.adview').hide();
                }
                
            } else {
                // TODO: Loading / initial state
            }
        },
        
        refreshResults: function () {
            console.log('index refresh ', this.model.race);
            
            if (!resultList) return;
            
            if (dataManager[this.model.race.key].loaded) {
                resultList.model.race = this.model.race;
                resultList.model.state = this.model.state;
                resultList.model.data = dataManager[this.model.race.key].data;
                resultList.model.detail = (this.model.state) ? dataManager[this.model.race.key].detail[this.model.state.id] : [];
            }
            
            resultList.render();
        },
        
        refreshSummary: function () {
            console.log('BoP refresh');
            
            if (!balanceChart) return;
            
            if (dataManager.summary.loaded) {
                balanceChart.model.data = dataManager.summary.data;
                balanceChart.model.race = this.model.race;
                balanceChart.model.updateTime = dataManager.summary.updateTime;
            }

            balanceChart.render();
        },
            
        refreshUpdateFeed: function () {
            console.log('Feed refresh');
            
            if (!updatesFeed) return;
            
            if (dataManager.updates.loaded) {
                updatesFeed.model.data = dataManager.updates.data;
            }
            
            updatesFeed.render();
        }
    });
    
    return indexView;
});