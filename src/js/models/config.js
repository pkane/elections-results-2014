define(['jquery'], function ($) {

    var staticInfo = JSON.parse($('.staticinfo').html()),
        isMobile = staticInfo.platform === 'mobile'
        ;

    return {
        appVersion: 2,

        isMobile: isMobile,
        pageInfo: staticInfo,
        ssts: 'news/politics/elections/results',


        ads: {
            sizes: (function() { return isMobile ? [[320, 50]]: [[300, 250]];  })(),
            unit: (function() {
                return ((isMobile ? 'mobileweb-banner_top/': 'poster/') + 'news/politics/elections_results');
            })()
        },

        api: {
            base: 'http://api.gannett-cdn.com/internal/ElectionsServices/Elections/',
            key: 'api_key=mwpprad6j3da5u34cnt7prnh',
            dataFeedVersionId: 0,
            lastChecked: 0,
            pollFrequency: 5 * 60 * 1000, // TBD
            op: {
                version: 'CurrentVersion',
                all: '2014/AllRaces',
                initiatives: '2014/BallotInitiativesByState',
                initiativesDetail: '2014/StateBallotInitiatives/{stateId}',
                raceByState: '2014/RaceResultsByState/{raceId}',
                raceByCounty: '2014/StateResultsByCountyOrCd/{raceId}/{stateId}',
                raceByCountyDetail: '2014/StateResultsByCountyOrCdDetail/{raceId}/{stateId}',
                updates: 'DataFeedVersions/2014'
            }
        },

        geoBase: (function() { return window.location.port === '9000' ? '' : '/services/webproxy/?url=http://www.gannett-cdn.com/GDContent/2014/election-results/json/'; })(),

        races: [
            { id: 'h', key: 'house', display: 'House', op: 'raceByCounty', detail: 'raceByCountyDetail'},
            { id: 's', key: 'senate', display: 'Senate', op: 'raceByState', detail: 'raceByCountyDetail'},
            { id: 'g', key: 'governors', display: 'Governor', op: 'raceByState', detail: 'raceByCountyDetail'},
            { id: 'i', key: 'initiatives', display: 'Initiatives', op: 'initiatives', detail: 'initiativesDetail'},
            { id: 's', key: 'summary', op: 'all'},
            { id: 'u', key: 'updates', op: 'updates'}
        ],
        
        states: [
            { id: '01', abbr: 'al', display: 'Alabama'},
            { id: '02', abbr: 'ak', display: 'Alaska'},
            { id: '04', abbr: 'az', display: 'Arizona'},
            { id: '05', abbr: 'ar', display: 'Arkansas'},
            { id: '06', abbr: 'ca', display: 'California'},
            { id: '08', abbr: 'co', display: 'Colorado'},
            { id: '09', abbr: 'ct', display: 'Connecticut'},
            { id: '10', abbr: 'de', display: 'Delaware'},
            { id: '11', abbr: 'dc', display: 'District of Columbia'},
            { id: '12', abbr: 'fl', display: 'Florida'},
            { id: '13', abbr: 'ga', display: 'Georgia'},
            { id: '15', abbr: 'hi', display: 'Hawaii'},
            { id: '16', abbr: 'id', display: 'Idaho'},
            { id: '17', abbr: 'il', display: 'Illinois'},
            { id: '18', abbr: 'in', display: 'Indiana'},
            { id: '19', abbr: 'ia', display: 'Iowa'},
            { id: '20', abbr: 'ks', display: 'Kansas'},
            { id: '21', abbr: 'ky', display: 'Kentucky'},
            { id: '22', abbr: 'la', display: 'Louisiana'},
            { id: '23', abbr: 'me', display: 'Maine'},
            { id: '24', abbr: 'md', display: 'Maryland'},
            { id: '25', abbr: 'ma', display: 'Massachusetts'},
            { id: '26', abbr: 'mi', display: 'Michigan'},
            { id: '27', abbr: 'mn', display: 'Minnesota'},
            { id: '28', abbr: 'ms', display: 'Mississippi'},
            { id: '29', abbr: 'mo', display: 'Missouri'},
            { id: '30', abbr: 'mt', display: 'Montana'},
            { id: '31', abbr: 'ne', display: 'Nebraska'},
            { id: '32', abbr: 'nv', display: 'Nevada'},
            { id: '33', abbr: 'nh', display: 'New Hampshire'},
            { id: '34', abbr: 'nj', display: 'New Jersey'},
            { id: '35', abbr: 'nm', display: 'New Mexico'},
            { id: '36', abbr: 'ny', display: 'New York'},
            { id: '37', abbr: 'nc', display: 'North Carolina'},
            { id: '38', abbr: 'nd', display: 'North Dakota'},
            { id: '39', abbr: 'oh', display: 'Ohio'},
            { id: '40', abbr: 'ok', display: 'Oklahoma'},
            { id: '41', abbr: 'or', display: 'Oregon'},
            { id: '42', abbr: 'pa', display: 'Pennsylvania'},
            { id: '44', abbr: 'ri', display: 'Rhode Island'},
            { id: '45', abbr: 'sc', display: 'South Carolina'},
            { id: '46', abbr: 'sd', display: 'South Dakota'},
            { id: '47', abbr: 'tn', display: 'Tennessee'},
            { id: '48', abbr: 'tx', display: 'Texas'},
            { id: '49', abbr: 'ut', display: 'Utah'},
            { id: '50', abbr: 'vt', display: 'Vermont'},
            { id: '51', abbr: 'va', display: 'Virginia'},
            { id: '53', abbr: 'wa', display: 'Washington'},
            { id: '54', abbr: 'wv', display: 'West Virginia'},
            { id: '55', abbr: 'wi', display: 'Wisconsin'},
            { id: '56', abbr: 'wy', display: 'Wyoming'}
        ],

        partyColors: {
            default: '#e3e3e3',
            democraticWin: '#235468',
            democratic: '#518296',
            republicanWin: '#742b31',
            republican: '#95474e',
            otherWin: '#999999',
            other: '#cccccc',
            tieWin: '#b8b8b8',
            tie: '#e0e0e0'
        },
        
        partyAbbr: {
            'Truth Vision Hope': '(TVH)',
            'Constitution': '(Const.)',
            'Democratic-NPL': '(D-NPL)',
            'Reform': '(Ref.)',
            'Flourish Every Person Can Shine Like the Sun': '(F)',
            'Independent Green': '(IG)',
            'Conservative': '(C)',
            'D-R Party': '(D-R)',
            'Stop Common Core': '(SCC)',
            'United Citizens': '(UC)',
            'Other': '(Other)',
            'Farmer': '(Farm.)',
            'Moderate': '(M)',
            'Grassroots Party': '(GP)',
            'Independence': '(Ind.)',
            'Liberty Union': '(LU)',
            'Independent': '(I)',
            'Start the Conversation': '(SC)',
            'Unaffiliated': '(I)',
            'American Labor': '(Am. Labor)',
            'American Constitution Party': '(ACP)',
            'Non-Affiliated': '(I)',
            'Party of New Jersey': '(PNJ)',
            'Lincoln Liberty': '(LL)',
            'Libertarian Party of Florida': '(LPF)',
            'Politicians Are Crooks': '(PAC)',
            'Republican': '(R)',
            'No Party Affiliation': '(I)',
            'Progressive': '(P)',
            'For Americans': '(FA)',
            'Mountain Party': '(MTN)',
            'Write-In Independent': '(I)',
            'No Party Preference': '(I)',
            'Libertarian': '(L)',
            'American': '(Am.)',
            'Working Families': '(WF)',
            'Green': '(G)',
            'Tax Revolt': '(TR)',
            'Of the People': '(OP)',
            'Legalize Marijuana Party': '(LMP)',
            'Independent American': '(IA)',
            'Women\'s Equality': '(WE)',
            'Democratic': '(D)',
            'Allen For Congress': '(AFC)',
            'Stop Boss Politics': '(SBP)',
            'Mr. Smith for Congress': '(MSC)',
            'Alaska Constitution Party': '(ACP)',
            'Green Party': '(G)',
            'Labor': '(Lab.)',
            'Americans Elect': '(AE)',
            'Democratic/Farmer/Labor': '(DFL)'
        }


    };

});