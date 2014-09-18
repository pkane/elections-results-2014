define([
	'jquery',
	'underscore',
	'backbone',
    'text!views/components/balanceChart.html'
],
function ($, _, Backbone, chartTemplate) {

    var isRendered = false,
        seatsHeld = { 
            s: { dem: 34, rep: 30, total: 100, was: { dem: 55, rep: 45}},
            h: { dem: 0, rep: 0, total: 435, was: { dem: 199, rep: 233}},
            g: { dem: 6, rep: 7, total: 50, was: { dem: 21, rep: 29}}
        },
        view = Backbone.View.extend({
        
        className: 'balance-of-power-chart',
        
        template: _.template(chartTemplate),
        
        model: new (Backbone.Model.extend({ 
            data: [],
            race: {}
        }))(),
        
        render: function () {
            
            if (!isRendered) {
                this.$el.html(this.template());
                isRendered = true;
            }
            
            if (this.model.data.length > 0 && this.model.race.id !== 'i') {

                console.log('BoP for ' + this.model.race.display);

                var results = _.findWhere(this.model.data, { id: this.model.race.id.toUpperCase() }),
                    held = seatsHeld[this.model.race.id],
                    dem = _.findWhere(results.results, { party: 'Democratic' }),
                    rep = _.findWhere(results.results, { party: 'Republican' }),
                    other = _.findWhere(results.results, { party: 'Other' });
                
                this.$('.bar-results .progress-stat-bar .dem').css('width', ((dem.seats + other.seats + held.dem) / held.total)*100 + '%');
                this.$('.bar-results .progress-stat-bar .rep').css('width', ((rep.seats + held.rep) / held.total)*100 + '%');
                
                this.$('.bar-previous .progress-stat-bar .dem').css('width', (held.was.dem / held.total)*100 + '%');
                this.$('.bar-previous .progress-stat-bar .rep').css('width', (held.was.rep / held.total)*100 + '%');
                
                this.$('.bar-num .dem .num').text(dem.seats + other.seats + held.dem);
                this.$('.bar-num .rep .num').text(rep.seats + held.rep);
                
                this.$('.bar-previous .dem .num').text(held.was.dem);
                this.$('.bar-previous .rep .num').text(held.was.rep);
            }
            
            return this;
        }
        
    });
    
    return view;
});