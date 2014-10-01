define([
	'jquery',
	'underscore',
	'backbone',
    'text!views/components/balanceChart.html',
    'moment'
],
function ($, _, Backbone, chartTemplate, Moment) {

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
                
            if (this.model.detail && this.model.detail.id) {
                
                var candidate = _.chain(this.model.detail.results).sortBy('votes').last(2).value(); 
                
                if (candidate.length == 2)
                {
                    if (candidate[1].party === 'Democratic' || candidate[0].party === 'Republican') {
                        candidate.reverse();
                    }

                    var pctLeft = Math.round(candidate[0].pct*100)/100,
                        pctRight = Math.round(candidate[1].pct*100)/100;

                    this.$('.desc-all').hide();
                    this.$('.desc-individual').show();

                    if (candidate[0].party === 'Democratic') {
                        $(progressLeft).addClass('dem').removeClass('other');
                        $('icon', progressLeft).addClass('icon-dem-left');
                    } else {
                        $(progressLeft).removeClass('dem').addClass('other');
                        $('icon', progressLeft).removeClass('icon-dem-left dem');
                    }

                    if (candidate[1].party === 'Republican') {
                        $(progressRight).addClass('rep').removeClass('other');
                        $('icon', progressRight).addClass('icon-rep-left');
                    } else {
                        $(progressRight).removeClass('rep').addClass('other');
                        $('icon', progressRight).removeClass('icon-rep-left dem');
                    } 

                    $('.num', numLeft).text(pctLeft + '%');
                    $('.num', numRight).text(pctRight + '%');

                    $(progressLeft).css('width', pctLeft + '%');
                    $(progressRight).css('width', pctRight + '%');

                    $('.text-left .name', desc).text(candidate[0].name);
                    $('.text-right .name', desc).text(candidate[1].name);

                    $('.text-left .votes', desc).text(candidate[0].votes);
                    $('.text-right .votes', desc).text(candidate[1].votes);

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
                    other = _.findWhere(results.results, { party: 'Other' }),
                    updateTime = new Moment(this.model.updateTime);
                
                // icon-rep-left
                
                this.$('.desc-all').show();
                this.$('.desc-individual').hide();
                
                $(progressLeft).addClass('dem').removeClass('other');
                $('icon', progressLeft).addClass('icon-dem-left');
                
                $(progressRight).addClass('rep').removeClass('other');
                $('icon', progressRight).addClass('icon-rep-left');
                
                $('.num', numLeft).text(dem.seats + other.seats + held.dem);
                $('.num', numRight).text(rep.seats + held.rep);
                
                $(progressLeft).css('width', ((dem.seats + other.seats + held.dem) / held.total)*100 + '%');
                $(progressRight).css('width', ((rep.seats + held.rep) / held.total)*100 + '%');
                
                $('.bar-progress-left', desc).css('width', (held.was.dem / held.total)*100 + '%');
                $('.bar-progress-right', desc).css('width', (held.was.rep / held.total)*100 + '%');
                
                $('.text-left .votes', desc).text(held.was.dem);
                $('.text-right .votes', desc).text(held.was.rep);
                
                this.$('.updated').text('updated ' + updateTime.format('h:mm a'));
            } else {
                console.log('Build placeholder loading state for BoP');
            }
            
            return this;
        }
        
    });
    
    return view;
});