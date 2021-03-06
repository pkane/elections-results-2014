define([
	'jquery',
	'underscore',
	'backbone',
    'd3',
    'models/config',
    'text!views/components/balanceChart.html'    
],
function ($, _, Backbone, d3, config, chartTemplate) {

    var isRendered = false,
        seatsHeld = { 
            s: { dem: 34, rep: 30, total: 100, was: { dem: 55, rep: 45}},
            h: { dem: 0, rep: 0, total: 435, was: { dem: 199, rep: 233}},
            g: { dem: 7, rep: 7, total: 50, was: { dem: 21, rep: 29}}
        },
        view = Backbone.View.extend({
        
        className: 'balance-of-power-chart',
        
        template: _.template(chartTemplate),

        timeFormat: d3.time.format('%I:%M %p'),
        numFormat: d3.format(','),
        pctFormat: d3.format('.1%'),
            
        sortValues: { 
            0: ['Yes', 'For', 'Approve', 'In Favor', 'Maintained'],
            1: ['No', 'Against', 'Reject', 'Repealed']
        },
        
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
                progressOther = this.$('.bop-group-results .bar-progress-other'),
                desc = this.$('.bop-group-desc');
            
            if (this.model.detail && this.model.detail.id) {
                
                var hasDem = false, 
                    hasRep = false,
                    isMultirace = _.chain(this.model.detail.results).pluck('seatNumber').uniq().value().length > 1,
                    candidate = _.chain(this.model.detail.results).filter(function (item) {
                            return !isMultirace || (item.seatNumber === ((this.model.fips) ? this.model.fips : '0') );
                        }, this).sortBy(function (item) {
                            return item.votes * -1; // Reverse
                        }).filter(function (item) {
                            var result = false;
                            if (item.party === 'Democratic') {
                                result = !hasDem;
                                hasDem = true;
                            } else if (item.party === 'Republican') {
                                result = !hasRep;
                                hasRep = true;
                            } else {
                                result = true;
                            }
                        
                            return result;
                        }).first(2).value();
                
                if (candidate.length == 1) {
                    candidate.push({ 
                        party: ((candidate[0].party === 'Democratic') ? 'Republican' : 'Democratic'),
                        name: 'Uncontested',
                        votes: 0,
                        pct: 0
                    });
                }
                
                if (candidate.length == 2) {
                    if (candidate[1].party === 'Democratic' || candidate[0].party === 'Republican') {
                        candidate.reverse();
                    } else if (this.model.race.id === 'i' && this.sortValues[1].indexOf(candidate[0].name) > -1) {
                        candidate.reverse();
                    }
                    
                    var pctLeft = this.pctFormat(candidate[0].pct/100),
                        pctRight = this.pctFormat(candidate[1].pct/100),
                        pctOther = 0;

                    this.$('.desc-all').hide();
                    this.$('.desc-individual').show();

                    if (candidate[0].party === 'Democratic') {
                        $(progressLeft).addClass('dem').removeClass('other yes');
                        $(numLeft).addClass('dem').removeClass('other yes');
                        $('.text-left', desc).addClass('dem').removeClass('other yes');
                        $('.icon', progressLeft).addClass('icon-dem-right');
                    } else if (!candidate[0].party) {
                        $(progressLeft).removeClass('dem other').addClass('yes');
                        $(numLeft).removeClass('dem other').addClass('yes');
                        $('.text-left', desc).removeClass('dem other').addClass('yes');
                        $('.icon', progressLeft).removeClass('icon-dem-right dem');
                    } else {
                        $(progressLeft).removeClass('dem yes').addClass('other');
                        $(numLeft).removeClass('dem yes').addClass('other');
                        $('.text-left', desc).removeClass('dem yes').addClass('other');
                        $('.icon', progressLeft).removeClass('icon-dem-right dem');                        
                    }

                    if (candidate[1].party === 'Republican') {
                        $(progressRight).addClass('rep').removeClass('other no');
                        $(numRight).addClass('rep').removeClass('other no');
                        $('.text-right', desc).addClass('rep').removeClass('other no');
                        $('.icon', progressRight).addClass('icon-rep-left');
                    } else if (!candidate[1].party) {
                        $(progressRight).removeClass('rep other').addClass('no');
                        $(numRight).removeClass('rep other').addClass('no');
                        $('.text-right', desc).removeClass('rep other').addClass('no');
                        $('.icon', progressRight).removeClass('icon-rep-left dem');
                    } else {
                        $(progressRight).removeClass('rep no').addClass('other');
                        $(numRight).removeClass('rep no').addClass('other');
                        $('.text-right', desc).removeClass('rep no').addClass('other');
                        $('.icon', progressRight).removeClass('icon-rep-left dem');
                    }

                    $('.num', numLeft).text(pctLeft);
                    $('.num', numRight).text(pctRight);
                    
                    $('.party-label', numLeft).text('');
                    $('.party-label', numRight).text('');

                    $(progressLeft).css('width', pctLeft);
                    $(progressRight).css('width', pctRight);
                    $(progressOther).css('width', pctOther);

                    $('.text-left .name', desc).text(candidate[0].name);
                    $('.text-right .name', desc).text(candidate[1].name);

                    $('.text-left .votes', desc).text(this.numFormat(candidate[0].votes));
                    $('.text-right .votes', desc).text(this.numFormat(candidate[1].votes));

                    $('.bar-progress-left', desc).css('width', '0%');
                    $('.bar-progress-right', desc).css('width', '0%');
                    
                    this.$('.updated').text(this.pctFormat(this.model.detail.precincts.pct/100) + ' reporting');
                }
            } else if (this.model.data.length > 0 && this.model.race.id !== 'i') {

                var results = _.findWhere(this.model.data, { id: this.model.race.id.toUpperCase() }),
                    held = seatsHeld[this.model.race.id],
                    dem = _.findWhere(results.results, { party: 'Democratic' }),
                    rep = _.findWhere(results.results, { party: 'Republican' }),
                    other = _.findWhere(results.results, { party: 'Other' }),
                    leftPct = ((dem.seats + held.dem) / held.total)*100 + '%'
                    ;
                
                this.$('.desc-all').show();
                this.$('.desc-individual').hide();
                
                $(progressLeft).addClass('dem').removeClass('other yes');
                $('.icon', progressLeft).addClass('icon-dem-right');
                
                $(progressRight).addClass('rep').removeClass('other no');
                $('.icon', progressRight).addClass('icon-rep-left');
                
                $(numRight).removeClass('rep no other');
                $(numLeft).removeClass('dem yes other');
                
                $('.num', numLeft).text(dem.seats + held.dem);
                $('.party-label', numLeft).text(config.isMobile ? 'Dem' : 'Democrat');
                $('.num', numRight).text(rep.seats + held.rep);
                $('.party-label', numRight).text(config.isMobile ? 'GOP' : 'Republican');

                $(progressLeft).css('width', leftPct);
                $(progressRight).css('width', ((rep.seats + held.rep) / held.total)*100 + '%');
                $(progressOther).css('width', (other.seats / held.total)*100 + '%').css('left', leftPct);
                
                $('.bar-progress-left', desc).css('width', (held.was.dem / held.total)*100 + '%');
                $('.bar-progress-right', desc).css('width', (held.was.rep / held.total)*100 + '%');
                
                $('.text-left .num', desc).text(this.numFormat(held.was.dem));
                $('.text-right .num', desc).text(this.numFormat(held.was.rep));

                this.$('.updated').text('updated ' + this.timeFormat(this.model.updateTime));
            } else {
                console.log('Build placeholder loading state for BoP');
            }
            
            return this;
        }
        
    });
    
    return view;
});