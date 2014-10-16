define([
	'jquery',
	'underscore',
	'backbone',
    'views/components/resultList',
    'views/components/resultMap',
    'views/components/balanceChart',
    'views/components/updatesFeed',
    'views/components/ads',
    'models/config',
    'models/dataManager',
    'models/indexModel',    
    'text!views/pages/index.html'
],

function ($, _, Backbone, ResultList, ResultMap, BalanceChart, UpdatesFeed, AdView, config, dataManager, IndexModel, templateFile) {

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
        
        events: {
            'click a': 'anchorClick'
        },

        // TODO: REMOVE ME AFTER DESKTOP FIX
        anchorClick: function(e) {
            if (!config.isMobile && e.currentTarget.href.indexOf('#') !== -1) {
                window.location = e.currentTarget.href;
            }
        },

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
                needsBoP = (this.model.race.id !== 'i' || this.model.fips),
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
                               
                
                if (needsResultList) {
                    if (!resultList) {
                        resultList = new ResultList();
                        this.$('#list').html(resultList.el);
                    }
                    this.$('#list').show();
                    this.refreshResults();
                } else {
                    this.$('#list').hide();
                    if (resultList) {
                        resultList.reset();
                    }
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
                    // adView.refresh();
                } else {
                    this.$('.adview').hide();
                }

                if (needsMap) {
                    if (!resultMap) {
                        resultMap = new ResultMap();
                        this.$("#map").html(resultMap.el);
                    }
                    this.$('#map').show();
                    resultMap.render();
                    console.log('show map');
                } else {
                    this.$('#map').hide();
                }
                
            } else {
                // TODO: Loading / initial state
            }
        },
        
        refreshResults: function () {
            
            var dataFeed = dataManager[this.model.race.key],
                detailFeed = (dataFeed && this.model.state) ? dataFeed.detail[this.model.state.id] : false,
                hasData = (dataFeed && dataFeed.loaded && !dataFeed.loading),
                hasDetail = (detailFeed && detailFeed.loaded && !detailFeed.loading);
            
            if (resultList) {
                resultList.model.race = this.model.race;
                resultList.model.state = this.model.state;
                resultList.model.data = hasData ? dataFeed.data : [];
                if (this.model.race.id === 'i' && this.model.state) {
                    var detail = _.findWhere(dataFeed.data, { id: this.model.state.id });
                    resultList.model.detail = (detail) ? detail.initiatives : [];
                } else {
                    resultList.model.detail = hasDetail ? detailFeed.data : [];
                }
                resultList.render();
            }

            if (resultMap) {
                resultMap.model.race = this.model.race;
                resultMap.model.state = this.model.state;
                resultMap.model.data = hasData ? dataFeed.data : [];
                resultMap.model.detail = hasDetail ? detailFeed.data : [];
                resultMap.model.fips = this.model.fips;
                resultMap.refresh();
            }

            if (this.model.fips || (this.model.state && this.model.race.id != 'h')) {
                this.refreshSummary();
            }
        },
        
        refreshSummary: function () {

            if (!balanceChart) return;
            
            if (dataManager.summary.loaded) {
                balanceChart.model.data = dataManager.summary.data;
                balanceChart.model.race = this.model.race;
                balanceChart.model.updateTime = dataManager.summary.updateTime;
                balanceChart.model.fips = this.model.fips;
            }

            if (this.model.state && (this.model.race.id === 'g' || this.model.race.id === 's')) {
                balanceChart.model.detail = _.findWhere(dataManager[this.model.race.key].data, {id: this.model.state.id});
            } else if (this.model.fips) {
                if (this.model.race.id === 'i') {
                    var stateData = _.findWhere(dataManager[this.model.race.key].data, {id: this.model.state.id});
                    if (stateData) {
                        balanceChart.model.detail = _.findWhere( stateData.initiatives, {id: parseInt(this.model.fips)});
                    }
                } else if (this.model.race.id === 'h') {
                    balanceChart.model.detail = _.findWhere(dataManager[this.model.race.key].data, {id: this.model.state.id + '-District ' + this.model.fips});
                } else {
                    balanceChart.model.detail = {};
                }
            } else {
                balanceChart.model.detail = {};
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