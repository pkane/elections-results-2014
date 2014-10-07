define([
	'jquery',
	'underscore',
	'backbone',
    'd3',
    'text!views/components/balanceChart.html'    
],
function ($, _, Backbone, d3, chartTemplate) {

    var isRendered = false,
        seatsHeld = { 
            s: { dem: 34, rep: 30, total: 100, was: { dem: 55, rep: 45}},
            h: { dem: 0, rep: 0, total: 435, was: { dem: 202, rep: 233}},
            g: { dem: 6, rep: 7, total: 50, was: { dem: 21, rep: 29}}
        },
        view = Backbone.View.extend({
        
        className: 'balance-of-power-chart',
        
        template: _.template(chartTemplate),

        timeFormat: d3.time.format('%I:%M %p'),
        numFormat: d3.format(','),
        
        model: new (Backbone.Model.extend({
            data: [],
            detail: {},
            race: {},
            updateTime: new Date()
        }))(),
        
        render: function () {
            
            if (!isRendered) {
                this.$el.html(this.template());
                isRendered = true;
            }
            
            var numLeft = this.$('.bop-group-num-left'),
                numRight = this.$('.bop-group-num-right'),
                progressLeft = this.$('.bop-group-results .bar-progress-left'),
                progressRight = this.$('.bop-group-results .bar-progress-right'),
                desc = this.$('.bop-group-desc');
            
            console.log('BOP - Render', (this.model.detail && this.model.detail.id));
            
            if (this.model.detail && this.model.detail.id) {
                
                var candidate = _.chain(this.model.detail.results).sortBy('votes').last(2).value(); 
                
                if (candidate.length == 2)
                {
                    if (candidate[1].party === 'Democratic' || candidate[0].party === 'Republican') {
                        candidate.reverse();
                    }

                    var pctLeft = Math.round(candidate[0].pct*10)/10,
                        pctRight = Math.round(candidate[1].pct*10)/10;

                    this.$('.desc-all').hide();
                    this.$('.desc-individual').show();

                    if (candidate[0].party === 'Democratic') {
                        $(progressLeft).addClass('dem').removeClass('other');
                        $('.icon', progressLeft).addClass('icon-dem-right');
                    } else {
                        $(progressLeft).removeClass('dem').addClass('other');
                        $('.icon', progressLeft).removeClass('icon-dem-right dem');
                    }

                    if (candidate[1].party === 'Republican') {
                        $(progressRight).addClass('rep').removeClass('other');
                        $('.icon', progressRight).addClass('icon-rep-left');
                    } else {
                        $(progressRight).removeClass('rep').addClass('other');
                        $('.icon', progressRight).removeClass('icon-rep-left dem');
                    } 

                    $('.num', numLeft).text(pctLeft + '%');
                    $('.num', numRight).text(pctRight + '%');

                    $(progressLeft).css('width', pctLeft + '%');
                    $(progressRight).css('width', pctRight + '%');

                    $('.text-left .name', desc).text(candidate[0].name);
                    $('.text-right .name', desc).text(candidate[1].name);

                    $('.text-left .votes', desc).text(this.numFormat(candidate[0].votes));
                    $('.text-right .votes', desc).text(this.numFormat(candidate[1].votes));

                    $('.bar-progress-left', desc).css('width', '0%');
                    $('.bar-progress-right', desc).css('width', '0%');
                } else {
                    console.log('Handle edge case of single candidate');
                }
            } else if (this.model.data.length > 0 && this.model.race.id !== 'i') {

                var results = _.findWhere(this.model.data, { id: this.model.race.id.toUpperCase() }),
                    held = seatsHeld[this.model.race.id],
                    dem = _.findWhere(results.results, { party: 'Democratic' }),
                    rep = _.findWhere(results.results, { party: 'Republican' }),
                    other = _.findWhere(results.results, { party: 'Other' })
                    ;
                
                this.$('.desc-all').show();
                this.$('.desc-individual').hide();
                
                $(progressLeft).addClass('dem').removeClass('other');
                $('.icon', progressLeft).addClass('icon-dem-right');
                
                $(progressRight).addClass('rep').removeClass('other');
                $('.icon', progressRight).addClass('icon-rep-left');
                
                $('.num', numLeft).text(dem.seats + other.seats + held.dem);
                $('.num', numRight).text(rep.seats + held.rep);
                
                $(progressLeft).css('width', ((dem.seats + other.seats + held.dem) / held.total)*100 + '%');
                $(progressRight).css('width', ((rep.seats + held.rep) / held.total)*100 + '%');
                
                $('.bar-progress-left', desc).css('width', (held.was.dem / held.total)*100 + '%');
                $('.bar-progress-right', desc).css('width', (held.was.rep / held.total)*100 + '%');
                
                $('.text-left .votes', desc).text(this.numFormat(held.was.dem));
                $('.text-right .votes', desc).text(this.numFormat(held.was.rep));

                this.$('.updated').text('updated ' + this.timeFormat(this.model.updateTime));
            } else {
                console.log('Build placeholder loading state for BoP');
            }
            
            return this;
        }
        
    });
    
    return view;
});